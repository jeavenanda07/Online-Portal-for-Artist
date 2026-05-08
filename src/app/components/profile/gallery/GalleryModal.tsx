"use client";

import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import CreateGalleryModal from "./CreateGalleryModal";
import GalleryDetailsView from "./GalleryDetailsView";
import Image from "next/image";
import { getSession } from "@/app/actions/auth";

import {
  Plus,
  X,
  LayoutGrid,
  FolderOpen,
} from "lucide-react";

interface Artwork {
  artwork_id: string;
  artwork_title: string;
  art_file: string;
  status?: string;
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
  created_at: string;
  _count?: { artworks: number };
  artworks?: Artwork[]; // ✅ same shape as GalleryDetailsView now
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GalleryModal = ({
  isOpen,
  onClose,
}: GalleryModalProps) => {

  const [createOpen, setCreateOpen] =
    useState(false);

  const [selectedFolder, setSelectedFolder] =
    useState<Gallery | null>(null);

  const [galleryData, setGalleryData] =
    useState<Gallery[]>([]);

  const [loading, setLoading] =
    useState(true);

    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) return;
    
        const profileRes = await fetch(`/api/profile/get?username=${session.username?.replace(/^@/, "")}`);
        const profileData = await profileRes.json();
        const user_profile_id = profileData.profile?.user_profile_id;
        if (!user_profile_id) return;
    
        // ✅ Use /api/gallery/user to get _count
        const res = await fetch(`/api/gallery/user?user_profile_id=${user_profile_id}`);
        if (!res.ok) throw new Error("Failed to fetch galleries");
        const data = await res.json();
        setGalleryData(data.galleries ?? []); // ✅ data.galleries not data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {

    if (isOpen) {
      fetchGalleries();
    }

  }, [isOpen]);

  // =========================
  // CLOSE MODAL
  // =========================
  const handleMainClose = () => {
    setSelectedFolder(null);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleMainClose}
        className="max-w-[1200px] w-[95vw] h-[85vh] flex flex-col overflow-hidden rounded-[2.5rem] border-zinc-800 bg-background shadow-2xl"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-primary-border">

          <div className="flex items-center gap-3">

            <div className="p-2 bg-[#00d26a]/10 rounded-xl">
              <LayoutGrid
                size={20}
                className="text-[#00d26a]"
              />
            </div>

            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                Workspace
              </h2>

              {selectedFolder && (
                <p className="font-bold text-lg leading-none">
                  {selectedFolder.title}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleMainClose}
            className="p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden relative">

          {selectedFolder ? (

            <GalleryDetailsView
              folder={selectedFolder}
              onBack={() =>
                setSelectedFolder(null)
              }
            />

          ) : (

            <div className="p-10 h-full overflow-y-auto">

              {/* TOP */}
              <div className="flex justify-between items-end mb-10">

                <div>
                  <h3 className="text-4xl font-bold tracking-tighter">
                    Collections
                  </h3>

                  <p className="text-zinc-500 mt-2">
                    Curate and organize your
                    digital assets.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setCreateOpen(true)
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-primary  rounded-2xl font-bold hover:bg-[#00d26a] transition-all transform active:scale-95"
                >
                  <Plus size={20} />
                  New Gallery
                </button>
              </div>

              {/* LOADING */}
              {loading ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="h-64 rounded-[2rem] bg-zinc-900 animate-pulse"
                    />
                  ))}

                </div>

              ) : galleryData.length === 0 ? (

                // EMPTY STATE
                <div className="flex flex-col items-center justify-center py-32 text-center">

                  <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-6">
                    <FolderOpen size={34} />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">
                    No Collections Yet
                  </h3>

                  <p className="text-zinc-500 max-w-md">
                    Create your first collection
                    to save artworks and curate
                    inspiration.
                  </p>

                </div>

              ) : (

                // GALLERY GRID
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  {galleryData.map((folder) => (

                    <div
                      key={folder.id}
                      onClick={() =>
                        setSelectedFolder(folder)
                      }
                      className="group relative h-64 rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 bg-zinc-900/50 hover:border-[#00d26a]/50 transition-all shadow-xl"
                    >

                      <Image
                        fill
                        className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        src={
                          folder.cover_image ||
                          "/placeholder.jpg"
                        }
                        alt={folder.title}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">

                        <div>

                          <p className="text-xs font-black uppercase tracking-widest text-[#00d26a] mb-1">
                            Folder
                          </p>

                          <h4 className="text-xl font-bold text-white line-clamp-1">
                            {folder.title}
                          </h4>
                          {/* ✅ Add artwork count */}
                          {folder._count && (
                            <p className="text-[10px] text-zinc-500 font-bold mt-1">
                              {folder._count.artworks} artwork{folder._count.artworks !== 1 ? "s" : ""}
                            </p>
                          )}

                        </div>

                        <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white">
                          <FolderOpen size={18} />
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {!selectedFolder && (

          <div className="px-10 py-6 bg-secondary backdrop-blur-md border-t border-white/5 flex justify-between items-center">

            <span className="text-xs text-zinc-600 font-medium">
              Total Collections:
              {" "}
              {galleryData.length}
            </span>

            <button
              onClick={handleMainClose}
              className="px-10 py-3 bg-green-500 text-white rounded-2xl font-bold border border-white/10 hover:border-[#00d26a] transition-all"
            >
              Close Studio
            </button>

          </div>
        )}
      </Modal>

      {/* CREATE MODAL */}
      <CreateGalleryModal
        isOpen={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }

        onCreate={(newGallery) => {

          // INSTANT UI UPDATE
          setGalleryData((prev) => [
            newGallery,
            ...prev,
          ]);

          setCreateOpen(false);
        }}
      />
    </>
  );
};

export default GalleryModal;