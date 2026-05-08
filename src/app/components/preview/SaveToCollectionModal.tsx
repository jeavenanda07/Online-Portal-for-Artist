"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Check, Loader2, X, Lock, Globe, BookMarked, FolderPlus } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { notify } from "@/utils/toastHelper";
import Link from "next/link";

interface Gallery {
  id: string;
  title: string;
  description?: string;
  visibility: string;
  cover_image?: string;
  _count: { artworks: number };
  artworks: { artwork: { art_file: string } }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  artworkId: string;
}

export default function SaveToCollectionModal({ isOpen, onClose, artworkId }: Props) {
  const { userDetails } = useUserData();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: "",
    description: "",
    visibility: "public",
  });
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  // Fetch galleries + already-saved state when modal opens
  useEffect(() => {
    if (!isOpen || !userDetails?.user_profile_id || !artworkId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [galleriesRes, savedRes] = await Promise.all([
          fetch(`/api/gallery/user?user_profile_id=${userDetails.user_profile_id}`),
          fetch(`/api/gallery/save-artwork?artwork_id=${artworkId}&user_profile_id=${userDetails.user_profile_id}`),
        ]);
        const galleriesData = await galleriesRes.json();
        const savedData = await savedRes.json();
        setGalleries(galleriesData.galleries ?? []);
        setSavedIds(savedData.savedGalleryIds ?? []);
      } catch {
        notify("Failed to load galleries.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, userDetails?.user_profile_id, artworkId]);

  const handleToggleSave = async (galleryId: string) => {
    setSavingId(galleryId);
    try {
      const res = await fetch("/api/gallery/save-artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gallery_id: galleryId, artwork_id: artworkId }),
      });
      const data = await res.json();
      if (!res.ok) { notify("Failed to save.", "error"); return; }

      setSavedIds((prev) =>
        data.saved ? [...prev, galleryId] : prev.filter((id) => id !== galleryId)
      );
      setGalleries((prev) =>
        prev.map((g) =>
          g.id === galleryId
            ? { ...g, _count: { artworks: g._count.artworks + (data.saved ? 1 : -1) } }
            : g
        )
      );
      notify(data.saved ? "Added to gallery!" : "Removed from gallery.", "success");
    } catch {
      notify("Something went wrong.", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleCreateGallery = async () => {
    if (!newGallery.title.trim() || !userDetails?.user_profile_id) {
      notify("Gallery title is required.", "error");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/gallery/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_profile_id: userDetails.user_profile_id,
          title: newGallery.title,
          description: newGallery.description,
          visibility: newGallery.visibility,
        }),
      });
      const data = await res.json();
      if (!res.ok) { notify(data.message || "Failed to create.", "error"); return; }

      // Append to local list with empty count
      setGalleries((prev) => [
        { ...data, _count: { artworks: 0 }, artworks: [] },
        ...prev,
      ]);
      setNewGallery({ title: "", description: "", visibility: "public" });
      setShowCreate(false);
      notify("Gallery created!", "success");
    } catch {
      notify("Something went wrong.", "error");
    } finally {
      setCreating(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#0a0a0a", border: "1px solid #1a2e1a" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #1a2e1a" }}
        >
          <div className="flex items-center gap-2">
            <BookMarked size={16} style={{ color: "#4ade80" }} />
            <h3 className="font-black text-white text-sm">Save to Gallery</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[55vh] overflow-y-auto space-y-3">

          {/* Create new gallery toggle */}
          <Link
            href={`/profile/${userDetails?.username.replace('@', '')}/gallery`}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: showCreate ? "rgba(34,197,94,0.08)" : "#0d0d0d",
              border: `1px solid ${showCreate ? "#22c55e" : "#1a2e1a"}`,
              color: "#4ade80",
            }}
          >
            <FolderPlus size={15} />
            Create new gallerydss
          </Link>

          {showCreate && (
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
            >
              <input
                type="text"
                placeholder="Gallery name *"
                value={newGallery.title}
                onChange={(e) => setNewGallery((p) => ({ ...p, title: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateGallery(); }}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none"
                style={{ background: "#141414", border: "1px solid #1a2e1a" }}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newGallery.description}
                onChange={(e) => setNewGallery((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none"
                style={{ background: "#141414", border: "1px solid #1a2e1a" }}
              />
              <select
                value={newGallery.visibility}
                onChange={(e) => setNewGallery((p) => ({ ...p, visibility: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none"
                style={{ background: "#141414", border: "1px solid #1a2e1a" }}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGallery}
                  disabled={creating || !newGallery.title.trim()}
                  className="px-5 py-2 rounded-lg text-xs font-black flex items-center gap-2 disabled:opacity-40 transition-all"
                  style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#000" }}
                >
                  {creating && <Loader2 size={12} className="animate-spin" />}
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          )}

          <div className="h-px" style={{ background: "#1a2e1a" }} />

          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "#0d0d0d" }} />
              ))}
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-8">
              <BookMarked size={28} className="mx-auto mb-2" style={{ color: "#1a2e1a" }} />
              <p className="text-xs font-bold" style={{ color: "#4b5563" }}>
                No galleries yet. Create one above.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {galleries.map((gallery) => {
                const isSaved = savedIds.includes(gallery.id);
                const isSaving = savingId === gallery.id;
                const cover = gallery.cover_image || gallery.artworks?.[0]?.artwork?.art_file;

                return (
                  <button
                    key={gallery.id}
                    onClick={() => handleToggleSave(gallery.id)}
                    disabled={isSaving}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                    style={{
                      background: isSaved ? "rgba(34,197,94,0.06)" : "#0d0d0d",
                      border: `1px solid ${isSaved ? "rgba(34,197,94,0.3)" : "#1a2e1a"}`,
                    }}
                  >
                    {/* Cover thumbnail */}
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ background: "#1a2e1a" }}
                    >
                      {cover ? (
                        <img src={cover} alt={gallery.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookMarked size={14} style={{ color: "#4b5563" }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{gallery.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px]" style={{ color: "#4b5563" }}>
                          {gallery._count.artworks} artwork{gallery._count.artworks !== 1 ? "s" : ""}
                        </span>
                        <span style={{ color: "#2a3a2a" }}>·</span>
                        {gallery.visibility === "private"
                          ? <Lock size={10} style={{ color: "#4b5563" }} />
                          : <Globe size={10} style={{ color: "#4b5563" }} />
                        }
                      </div>
                    </div>

                    {/* Save state indicator */}
                    <div className="shrink-0">
                      {isSaving ? (
                        <Loader2 size={16} className="animate-spin" style={{ color: "#4ade80" }} />
                      ) : isSaved ? (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: "#22c55e" }}
                        >
                          <Check size={12} className="text-black" />
                        </div>
                      ) : (
                        <div
                          className="w-6 h-6 rounded-full border flex items-center justify-center"
                          style={{ borderColor: "#1a2e1a" }}
                        >
                          <Plus size={12} style={{ color: "#4b5563" }} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 flex justify-end" style={{ borderTop: "1px solid #1a2e1a" }}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ color: "#4b5563", border: "1px solid #1a2e1a" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}