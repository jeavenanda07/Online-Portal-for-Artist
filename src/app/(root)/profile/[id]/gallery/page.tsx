'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import GalleryModal from "@/app/components/profile/gallery/GalleryModal";
import Image from "next/image";
import { FolderOpen, Plus, Lock } from "lucide-react";
import { getSession } from "@/app/actions/auth";
import {getUserProfile} from "@/app/actions/userProfile"

interface Gallery {
  id: string;
  title: string;
  slug: string;
  description?: string;
  visibility: "public" | "private";
  cover_image?: string;
  created_at: string;
}

// ─── Skeleton Card ────────────────────────────────────────────
const GalleryCardSkeleton = () => (
  <div className="relative h-64 rounded-2xl overflow-hidden border border-white/5 bg-zinc-900/50 animate-pulse">
    <div className="absolute inset-0 bg-zinc-800" />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-2.5 w-12 rounded-full bg-[#00d26a]/20" />
        <div className="h-4 w-32 rounded-md bg-white/10" />
      </div>
      <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10" />
    </div>
  </div>
);

const GalleryPage = () => {
  const params = useParams();
  const profileId = params?.id as string;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [galleryData, setGalleryData] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    
   

    const init = async () => {
      const userAcc = await getUserProfile(`@${profileId}`)
      console.log("res", params)
      try {
        setLoading(true);

        const session = await getSession();
        const owner = session?.username?.replace("@", "") === profileId;
        setIsOwner(owner);

        const res = await fetch(`/api/gallery/get?userId=${userAcc?.user_profile_id}`);
        console.log("")
        
        if (!res.ok) throw new Error("Failed to fetch galleries");
        const data = await res.json();

        // ✅ Step 3: filter with the LOCAL `owner` variable, not the stale `isOwner` state
        setGalleryData(
          owner ? data : data.filter((g: Gallery) => g.visibility === "public")
        );

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [profileId]); // ✅ single effect, single dep

  // ... rest of your JSX unchanged // re-fetch when ownership is confirmed

  return (
    <div>
      <div className="flex items-center justify-between -mt-6 mb-6">
        <h4 className="text-xl font-bold">Gallery</h4>
        {/* Only show collection count badge for visitors */}
        {!isOwner && !loading && (
          <span className="text-xs text-zinc-500 font-medium">
            {galleryData.length} public collection{galleryData.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <GalleryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* ── Skeletons ── */}
        {loading && [...Array(3)].map((_, i) => <GalleryCardSkeleton key={i} />)}

        {/* ── Gallery Cards ── */}
        {!loading && galleryData.map((item) => (
          <div
            key={item.id}
            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-zinc-900/50 hover:border-[#00d26a]/50 transition-all duration-300 shadow-xl"
          >
            <Image
              fill
              className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              src={item.cover_image || "/placeholder.jpg"}
              alt={item.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* Private badge — only visible to owner */}
            {isOwner && item.visibility === "private" && (
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                <Lock size={11} className="text-zinc-400" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Private</span>
              </div>
            )}

            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#00d26a] mb-1">
                  Gallery
                </p>
                <h4 className="text-xl font-bold text-white line-clamp-1">
                  {item.title}
                </h4>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white shrink-0">
                <FolderOpen size={18} />
              </div>
            </div>
          </div>
        ))}

        {/* ── Empty state for visitors ── */}
        {!loading && !isOwner && galleryData.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
              <FolderOpen size={28} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-medium">No public collections yet.</p>
          </div>
        )}

        {/* ── Create card — owner only ── */}
        {!loading && isOwner && (
          <div
            onClick={() => setIsCreateOpen(true)}
            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-dashed border-white/10 bg-zinc-900/30 hover:border-[#00d26a]/50 hover:bg-zinc-900/60 transition-all duration-300 shadow-xl flex flex-col items-center justify-center gap-3"
          >
            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#00d26a]/50 group-hover:bg-[#00d26a]/10 flex items-center justify-center transition-all duration-300">
              <Plus size={28} className="text-white/40 group-hover:text-[#00d26a] transition-colors duration-300" />
            </div>
            <p className="text-sm font-bold text-white/40 group-hover:text-white/80 uppercase tracking-widest transition-colors duration-300">
              Create new Collections
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default GalleryPage;