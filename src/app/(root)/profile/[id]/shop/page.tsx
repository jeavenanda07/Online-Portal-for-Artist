"use client";

import CreateArtwork from "@/app/components/profile/CreateArtwork";
import Modal from "@/app/components/ui/Modal";
import { useState, useEffect, useRef } from "react";
import { Plus, Star, MoreHorizontal, Pencil, Trash2, Package, Tag, Loader2 } from "lucide-react";
import { notify } from "@/utils/toastHelper";
import { useUserData } from "@/hooks/useUserData";
import { getSession } from "@/app/actions/auth";
import Link from "next/link";

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  "For Sale":      { bg: "rgba(34,197,94,0.1)",  text: "#4ade80", dot: "#22c55e" },
  "Not for Sale":  { bg: "rgba(113,113,122,0.1)", text: "#71717a", dot: "#71717a" },
  "Free Download": { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", dot: "#3b82f6" },
};

const ArtworkCardSkeleton = () => (
  <div
    className="rounded-2xl overflow-hidden animate-pulse bg-primary"
  >
    <div className="h-52 w-full bg-secondary"  />
    <div className="p-4 space-y-3">
      <div className="h-4 w-2/3 rounded-lg bg-background" />
      <div className="h-3 w-1/3 rounded-lg bg-background" />
      <div className="flex justify-between bg-background">
        <div className="h-5 w-16 rounded-lg bg-background" />
        <div className="h-5 w-12 rounded-lg bg-background" />
      </div>
    </div>
  </div>
);

const EditArtworkModal = ({
  artwork,
  onClose,
  onSave,
}: {
  artwork: any;
  onClose: () => void;
  onSave: (updated: any) => void;
}) => {
  const [form, setForm] = useState({
    artwork_title: artwork.artwork_title,
    description: artwork.description || "",
    status: artwork.status,
    price: artwork.price,
    stocks: artwork.stocks,
    tags: artwork.tags || [],
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/artwork/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId: artwork.artwork_id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) { notify(data.message || "Update failed.", "error"); return; }
      notify("Artwork updated!", "success");
      onSave(data.artwork);
      onClose();
    } catch { notify("Something went wrong.", "error"); }
    finally { setSaving(false); }
  };

  return (
    <div
      className="w-full rounded-2xl overflow-hidden "
    >
      <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: "1px solid #1a2e1a" }}>
        <h3 className="font-black ">Edit Artwork</h3>
        <button onClick={onClose} className="text-zinc-500 hover: transition-colors">✕</button>
      </div>

      <div className="p-6 space-y-4">
        <input
          className="w-full px-4 py-3 rounded-xl text-sm  outline-none"
          style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
          value={form.artwork_title}
          onChange={(e) => setForm({ ...form, artwork_title: e.target.value })}
          placeholder="Artwork title"
        />
        <textarea
          className="w-full px-4 py-3 rounded-xl text-sm  outline-none resize-none"
          style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: "#4b5563" }}>Status</label>
            <select
              className="w-full px-3 py-2.5 rounded-xl text-sm  outline-none"
              style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Not for Sale</option>
              <option>For Sale</option>
              <option>Free Download</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: "#4b5563" }}>Price (PHP)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 rounded-xl text-sm  outline-none disabled:opacity-30"
              style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
              disabled={form.status !== "For Sale"}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: "#4b5563" }}>Stocks</label>
          <input
            type="number"
            className="w-full px-4 py-2.5 rounded-xl text-sm  outline-none disabled:opacity-30"
            style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
            disabled={form.status !== "For Sale"}
            value={form.stocks}
            onChange={(e) => setForm({ ...form, stocks: Number(e.target.value) })}
          />
        </div>

        {/* Tags */}
        <div
          className="flex flex-wrap gap-2 p-3 rounded-xl"
          style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
        >
          {form.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}
            >
              {tag}
              <button onClick={() => setForm({ ...form, tags: form.tags.filter((_: any, idx: number) => idx !== i) })}>✕</button>
            </span>
          ))}
          <input
            className="flex-1 min-w-[100px] bg-transparent outline-none text-sm  placeholder:text-zinc-600"
            placeholder="Add tag, press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagInput.trim()) {
                e.preventDefault();
                if (!form.tags.includes(tagInput.trim())) setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
                setTagInput("");
              }
            }}
          />
        </div>
      </div>

      <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: "1px solid #1a2e1a" }}>
        <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-bold text-zinc-500 hover: transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2 rounded-xl text-sm font-black flex items-center gap-2"
          style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#000" }}
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

const ArtworkCard = ({
  artwork,
  onDelete,
  onEdit,
}: {
  artwork: any;
  onDelete: (id: string) => void;
  onEdit: (artwork: any) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const status = statusColors[artwork.status] || statusColors["Not for Sale"];
  console.log("artwork id", artwork.artwork_id);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = async () => {
    if (!confirm("Delete this artwork?")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/artwork/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId: artwork.artwork_id }),
      });
      if (!res.ok) { notify("Failed to delete.", "error"); return; }
      notify("Artwork deleted.", "success");
      onDelete(artwork.artwork_id);
    } catch { notify("Something went wrong.", "error"); }
    finally { setDeleting(false); setMenuOpen(false); }
  };

  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all border-1 border-primary-line cursor-pointer bg-primary duration-300 hover:translate-y-[-2px]"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)")}
    >
      <div className="relative h-52 overflow-hidden">
        <Link href={`/explore/${artwork.artwork_id}`} className="h-full" >
        <img
          src={artwork.art_file}
          alt={artwork.artwork_title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <span
          className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1.5"
          style={{ background: status.bg, color: status.text, backdropFilter: "blur(8px)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
          {artwork.status}
        </span>

        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: "white" }}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div
              className="absolute top-10 right-0 w-36 rounded-xl overflow-hidden z-20 py-1 bg-background"
            >
              <button
                onClick={() => { onEdit(artwork); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-primary  = transition-colors"
              >
                <Pencil size={13} style={{ color: "#4ade80" }} /> Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors"
                style={{ color: "#ef4444" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
        </Link>
       
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="font-bold  text-sm truncate mb-1">{artwork.artwork_title}</h4>

        {/* Tags */}
        {artwork.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {artwork.tags.slice(0, 3).map((tag: string, i: number) => (
              <span
                key={i}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ background: "rgba(34,197,94,0.07)", color: "#4b5563" }}
              >
                {tag}
              </span>
            ))}
            {artwork.tags.length > 3 && (
              <span className="text-[10px] font-bold" style={{ color: "#4b5563" }}>
                +{artwork.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1" style={{ color: "#4b5563" }}>
            <Star size={13} />
            <span className="text-xs font-bold">{artwork.likes_count}</span>
          </div>

          <div className="flex items-center gap-3">
            {artwork.status === "For Sale" && (
              <>
                <div className="flex items-center gap-1" style={{ color: "#4b5563" }}>
                  <Package size={12} />
                  <span className="text-xs font-bold">{artwork.stocks}</span>
                </div>
                <span className="text-sm font-black" style={{ color: "#4ade80" }}>
                  ₱{artwork.price.toFixed(2)}
                </span>
              </>
            )}
            {artwork.status === "Free Download" && (
              <span className="text-xs font-black" style={{ color: "#60a5fa" }}>Free</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Shop Page ─────────────────────────────────────────────────
const ShopPage = () => {
  const { userDetails, loading: userLoading } = useUserData();
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editArtwork, setEditArtwork] = useState<any | null>(null);


  useEffect(() => {
    if (!userDetails?.user_profile_id) return;
    const fetchArtworks = async () => {
      // console.log("getting session", await getSession())
      try {
        const res = await fetch(`/api/artwork/get?user_profile_id=${userDetails.user_profile_id}`);
        const data = await res.json();
        setArtworks(data.artworks || []);
      } catch { notify("Failed to load artworks.", "error"); }
      finally { setLoadingArtworks(false); }
    };
    fetchArtworks();
  }, [userDetails?.user_profile_id]);

  const handleDelete = (artworkId: string) => {
    setArtworks((prev) => prev.filter((a) => a.artwork_id !== artworkId));
  };

  const handleEditSave = (updated: any) => {
    setArtworks((prev) => prev.map((a) => a.artwork_id === updated.artwork_id ? updated : a));
  };

  const isLoading = userLoading || loadingArtworks;

  return (
    <div className="px-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-xl font-black ">Your Artshop</h4>
          <p className="text-xs mt-1" style={{ color: "#4b5563" }}>
            {artworks.length} artwork{artworks.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#000", boxShadow: "0 0 16px rgba(34,197,94,0.2)" }}
        >
          <Plus size={16} /> Upload Art
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(3)].map((_, i) => <ArtworkCardSkeleton key={i} />)}
        </div>
      ) : artworks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 rounded-2xl"
          style={{ border: "2px dashed #1a2e1a" }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#1a2e1a" }}>
            <Tag size={28} style={{ color: "#4ade80" }} />
          </div>
          <p className="font-bold  mb-1">No artworks yet</p>
          <p className="text-xs mb-6" style={{ color: "#4b5563" }}>Upload your first piece to start selling</p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black"
            style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#000" }}
          >
            <Plus size={14} /> Upload First Artwork
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork.artwork_id}
              artwork={artwork}
              onDelete={handleDelete}
              onEdit={setEditArtwork}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} className="w-full max-w-[700px] p-4">
        <CreateArtwork
          onClose={() => setIsCreateOpen(false)}
          onSuccess={(newArtwork) => setArtworks((prev) => [newArtwork, ...prev])}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editArtwork} onClose={() => setEditArtwork(null)} className="w-full max-w-[600px] p-4">
        {editArtwork && (
          <EditArtworkModal
            artwork={editArtwork}
            onClose={() => setEditArtwork(null)}
            onSave={handleEditSave}
          />
        )}
      </Modal>
    </div>
  );
};

export default ShopPage;