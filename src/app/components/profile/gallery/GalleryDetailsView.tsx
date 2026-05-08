"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
  Maximize2,
  Settings2,
  Share2,
  Globe,
  Lock,
  Save,
  Loader2,
} from "lucide-react";


import { notify } from "@/utils/toastHelper";

interface Artwork {
  artwork_id: string;
  artwork_title: string;
  art_file: string;
  status?: string; // Made optional if not always returned
  price?: number;
  likes_count?: number;
  user_profile?: {
    full_name: string;
    username: string;
    avatar_pic: string | null;
  } | null;
  added_at?: string;
}

interface Gallery {
  id: string;
  title: string;
  slug: string;
  description?: string;
  visibility: "public" | "private";
  cover_image?: string;
  artworks?: Artwork[]; 
  _count?: { artworks: number };
}

interface GalleryDetailsViewProps {
  folder: Gallery;
  onBack: () => void;
}

const GalleryDetailsView = ({
  folder,
  onBack,
}: GalleryDetailsViewProps) => {

  const [gallery, setGallery] =
    useState<Gallery>(folder);

  const [isEditing, setIsEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState(folder.title);

  const [description, setDescription] =
    useState(folder.description || "");

  const [visibility, setVisibility] =
    useState<"public" | "private">(
      folder.visibility
    );

  // =========================
  // FETCH FULL GALLERY
  // =========================
  const fetchGallery = async () => {
    try {
      const [galleryRes, artworksRes] = await Promise.all([
        fetch(`/api/gallery/${folder.id}`),
        fetch(`/api/gallery/artworks?gallery_id=${folder.id}`),
      ]);
  
      if (galleryRes.ok) {
        const data = await galleryRes.json();
        setGallery(data);
      }
  
      if (artworksRes.ok) {
        const data = await artworksRes.json();
        setGallery((prev) => ({ ...prev, artworks: data.artworks ?? [] }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // =========================
  // UPDATE GALLERY
  // =========================
  const handleUpdateGallery =
    async () => {

      try {

        setLoading(true);

        const res = await fetch(
          `/api/gallery/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: gallery.id,
              title,
              description,
              visibility,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to update gallery"
          );
        }

        const updatedGallery =
          await res.json();

        setGallery(updatedGallery);

        setIsEditing(false);

        notify(
          "Gallery updated successfully",
          "success"
        );

      } catch (error) {

        console.error(error);

        notify(
          "Failed to update gallery",
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // DELETE GALLERY
  // =========================
  const handleDeleteGallery =
    async () => {

      const confirmed = confirm(
        "Delete this gallery?"
      );

      if (!confirmed) return;

      try {

        setLoading(true);

        const res = await fetch(
          `/api/gallery/delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: gallery.id,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to delete gallery"
          );
        }

        notify(
          "Gallery deleted successfully",
          "success"
        );

        onBack();

      } catch (error) {

        console.error(error);

        notify(
          "Failed to delete gallery",
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="h-full flex flex-col bg-primary text-white">

      {/* TOOLBAR */}
      <div className="px-8 py-4 bg-primary/40 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-20">

        <button
          onClick={onBack}
          className="group flex items-center gap-3 text-zinc-500 hover:text-[#00d26a] transition-all font-bold text-sm uppercase tracking-widest"
        >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#00d26a]/10 transition-colors">
            <ArrowLeft size={18} />
          </div>

          Back to Collections
        </button>

        <div className="flex items-center gap-3">

          {/* SHARE */}
          <button className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Share2 size={20} />
          </button>

          {/* EDIT */}
          <button
            onClick={() =>
              setIsEditing(!isEditing)
            }
            className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <Edit3 size={20} />
          </button>

          {/* DELETE */}
          <button
            onClick={handleDeleteGallery}
            className="p-2.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Trash2 size={20} />
          </button>

          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          {/* SAVE */}
          {isEditing && (
            <button
              disabled={loading}
              onClick={
                handleUpdateGallery
              }
              className="flex items-center gap-2 px-6 py-2.5 bg-[#00d26a] text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-tighter"
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              Save Changes
            </button>
          )}

          {/* ADD ART */}
          {!isEditing && (
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#00d26a] text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-tighter">
              <Plus size={18} />
              Add Art
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">

        {/* HERO */}
        <div className="relative px-12 pt-16 pb-12 flex flex-col md:flex-row gap-10 items-center md:items-start bg-gradient-to-b from-[#00d26a]/5 to-transparent">

          {/* COVER */}
          <div className="relative w-56 h-56 shrink-0">

            <div className="absolute inset-0 bg-primary rounded-[3rem] rotate-6 translate-x-2" />

            <div className="absolute inset-0 bg-primary rounded-[3rem] -rotate-3 -translate-x-1" />

            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-zinc-900 shadow-2xl group">

              <Image
                fill
                src={
                  gallery.cover_image ||
                  "/placeholder.jpg"
                }
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                alt="cover"
              />
            </div>
          </div>

          {/* INFO */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl text-center md:text-left pt-4">

            {/* TITLE */}
            {isEditing ? (

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="bg-transparent text-5xl font-black tracking-tighter text-white uppercase italic outline-none border-b border-white/10 pb-2"
              />

            ) : (

              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">

                <h3 className="text-5xl font-black tracking-tighter text-white uppercase italic">
                  {gallery.title}
                </h3>

                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">

                  {gallery.visibility ===
                  "public" ? (
                    <Globe size={12} />
                  ) : (
                    <Lock size={12} />
                  )}

                  {gallery.visibility}
                </span>
              </div>
            )}

            {/* VISIBILITY */}
            {isEditing && (
              <div className="flex gap-3 mt-4">

                <button
                  onClick={() =>
                    setVisibility(
                      "public"
                    )
                  }
                  className={`px-4 py-2 rounded-xl border ${
                    visibility ===
                    "public"
                      ? "border-[#00d26a] bg-[#00d26a]/10"
                      : "border-white/10"
                  }`}
                >
                  Public
                </button>

                <button
                  onClick={() =>
                    setVisibility(
                      "private"
                    )
                  }
                  className={`px-4 py-2 rounded-xl border ${
                    visibility ===
                    "private"
                      ? "border-[#00d26a] bg-[#00d26a]/10"
                      : "border-white/10"
                  }`}
                >
                  Private
                </button>
              </div>
            )}

            {/* DESCRIPTION */}
            <textarea
              disabled={!isEditing}
              className="mt-6 bg-transparent text-zinc-500 text-lg leading-relaxed outline-none focus:text-zinc-300 transition-colors resize-none border-none p-0 w-full"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={3}
            />
          </div>
        </div>

        {/* ART GRID */}
        <div className="px-12 pb-20">

          <div className="flex items-center justify-between mb-8">

            <h4 className="text-xs font-black text-zinc-600 uppercase tracking-[0.4em]">
              Items —
              {" "}
              {gallery.artworks?.length ||
                0}
            </h4>

            <div className="flex gap-2">
              <button className="p-2 text-zinc-500 hover:text-white">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* EMPTY */}
          {!gallery.artworks ||
          gallery.artworks.length ===
            0 ? (

            <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-[3rem]">

              <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-6">
                <ImageIcon size={34} />
              </div>

              <h3 className="text-2xl font-bold mb-2">
                Empty Collection
              </h3>

              <p className="text-zinc-500 max-w-md">
                Start adding artworks
                into this collection.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">

{gallery.artworks.map((art) => (
  <div
    key={art.artwork_id}
    className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-primary border border-white/5 hover:border-[#00d26a]/30 transition-all cursor-pointer"
  >
    <Image
      fill
      src={art.art_file}          // ✅ was art.image_url
      alt={art.artwork_title}     // ✅ was art.title
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
    <div className="absolute bottom-4 left-4 z-20">
      <p className="text-[10px] font-black text-zinc-500 uppercase">Artwork</p>
      <p className="text-sm font-bold text-white tracking-tight">{art.artwork_title}</p>
    </div>
  </div>
))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryDetailsView;