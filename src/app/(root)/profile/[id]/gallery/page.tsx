'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GalleryModal from "@/app/components/profile/gallery/GalleryModal";
import Image from "next/image";
import { FolderOpen, Plus, Lock, ArrowLeft, Star } from "lucide-react";
import { getSession } from "@/app/actions/auth";
import { getUserProfile } from "@/app/actions/userProfile";
import Link from "next/link";

interface Gallery {
  id: string;
  title: string;
  slug: string;
  description?: string;
  visibility: "public" | "private";
  cover_image?: string;
  created_at: string;
  _count?: { artworks: number };
}

interface GalleryArtwork {
  artwork_id: string;
  artwork_title: string;
  art_file: string;
  status: string;
  price: number;
  likes_count: number;
  added_at: string;
  user_profile: {
    full_name: string;
    username: string;
    avatar_pic: string | null;
  } | null;
}

const GalleryCardSkeleton = () => (
  <div className="relative h-64 rounded-2xl overflow-hidden border border-white/5 bg-zinc-900/50 animate-pulse">
    <div className="absolute inset-0 bg-zinc-800" />
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

const ArtworkCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse bg-zinc-900 border border-white/5">
    <div className="aspect-[3/4] bg-zinc-800" />
    <div className="p-3 space-y-2">
      <div className="h-3 w-2/3 rounded bg-zinc-700" />
      <div className="h-2 w-1/3 rounded bg-zinc-700" />
    </div>
  </div>
);

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  "For Sale":      { bg: "rgba(34,197,94,0.1)",  text: "#4ade80", dot: "#22c55e" },
  "Not for Sale":  { bg: "rgba(113,113,122,0.1)", text: "#71717a", dot: "#71717a" },
  "Free Download": { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", dot: "#3b82f6" },
};

const GalleryPage = () => {
  const params = useParams();
  const profileId = params?.id as string;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [galleryData, setGalleryData] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // ── Selected gallery state ────────────────────────────────
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [artworks, setArtworks] = useState<GalleryArtwork[]>([]);
  const [artworksLoading, setArtworksLoading] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    const init = async () => {
      const userAcc = await getUserProfile(`@${profileId}`);
      try {
        setLoading(true);
        const session = await getSession();
        const owner = session?.username?.replace("@", "") === profileId;
        setIsOwner(owner);

        const res = await fetch(`/api/gallery/user?user_profile_id=${userAcc?.user_profile_id}`);
        if (!res.ok) throw new Error("Failed to fetch galleries");
        const data = await res.json();
        const galleries = data.galleries ?? [];
        setGalleryData(
          owner ? galleries : galleries.filter((g: Gallery) => g.visibility === "public")
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [profileId]);

  // ── Fetch artworks when a gallery is selected ─────────────
  const handleSelectGallery = async (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setArtworksLoading(true);
    try {
      const res = await fetch(`/api/gallery/artworks?gallery_id=${gallery.id}`);
      const data = await res.json();
      setArtworks(data.artworks ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setArtworksLoading(false);
    }
  };

  const handleBackToGalleries = () => {
    setSelectedGallery(null);
    setArtworks([]);
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between -mt-6 mb-6">
        {selectedGallery ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToGalleries}
              className="flex items-center gap-2 text-zinc-500 hover:text-[#00d26a] transition-colors text-sm font-bold"
            >
              <ArrowLeft size={16} />
              All Collections
            </button>
            <span className="text-zinc-700">/</span>
            <h4 className="text-xl font-bold">{selectedGallery.title}</h4>
            <span className="text-[10px] text-zinc-500 font-bold">
              ({artworks.length} artwork{artworks.length !== 1 ? "s" : ""})
            </span>
          </div>
        ) : (
          <h4 className="text-xl font-bold">Artworks Collection</h4>
        )}

        {!isOwner && !loading && !selectedGallery && (
          <span className="text-xs text-zinc-500 font-medium">
            {galleryData.length} public collection{galleryData.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <GalleryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* ── Gallery Grid ── */}
      {!selectedGallery && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && [...Array(3)].map((_, i) => <GalleryCardSkeleton key={i} />)}

          {!loading && galleryData.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectGallery(item)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-zinc-900/50 hover:border-[#00d26a]/50 transition-all duration-300 shadow-xl"
            >
              <Image
                fill
                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                src={item.cover_image || "/placeholder.jpg"}
                alt={item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {isOwner && item.visibility === "private" && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                  <Lock size={11} className="text-zinc-400" />
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Private</span>
                </div>
              )}

              <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#00d26a] mb-1">
                    Artwork Collection
                  </p>
                  <h4 className="text-xl font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold mt-1">
                    {item._count?.artworks ?? 0} artwork{(item._count?.artworks ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white shrink-0">
                  <FolderOpen size={18} />
                </div>
              </div>
            </div>
          ))}

          {!loading && !isOwner && galleryData.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
                <FolderOpen size={28} className="text-zinc-600" />
              </div>
              <p className="text-zinc-500 font-medium">No public collections yet.</p>
            </div>
          )}

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
      )}

      {/* ── Selected Gallery Artworks ── */}
      {selectedGallery && (
        <div>
          {artworksLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(6)].map((_, i) => <ArtworkCardSkeleton key={i} />)}
            </div>
          ) : artworks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/10">
              <FolderOpen size={32} className="text-zinc-700 mb-3" />
              <p className="font-bold text-zinc-500">This gallery is empty.</p>
              <p className="text-xs text-zinc-600 mt-1">
                Save artworks from Explore to add them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {artworks.map((art) => {
                const status = statusColors[art.status] || statusColors["Not for Sale"];
                return (
                  // ✅ Clicking redirects to /explore/[artwork_id]
                  <Link
                    key={art.artwork_id}
                    href={`/explore/${art.artwork_id}`}
                    className="group relative rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 hover:border-[#00d26a]/40 transition-all duration-300 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <Image
                        fill
                        src={art.art_file}
                        alt={art.artwork_title}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Status badge */}
                      <span
                        className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg flex items-center gap-1"
                        style={{ background: status.bg, color: status.text, backdropFilter: "blur(8px)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                        {art.status}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-xs font-bold text-white truncate">{art.artwork_title}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1" style={{ color: "#4b5563" }}>
                          <Star size={11} />
                          <span className="text-[10px] font-bold">{art.likes_count}</span>
                        </div>
                        {art.status === "For Sale" && (
                          <span className="text-[10px] font-black" style={{ color: "#4ade80" }}>
                            ₱{art.price?.toFixed(2)}
                          </span>
                        )}
                        {art.status === "Free Download" && (
                          <span className="text-[10px] font-black" style={{ color: "#60a5fa" }}>Free</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;