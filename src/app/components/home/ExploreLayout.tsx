import ArtList from "../shared/ArtList";
import { BsSearch } from 'react-icons/bs';
import Link from "next/link";
import SearchHeader from '../ui/SearchHeader';
import { prisma } from "@/lib/prisma";

async function getAllArtworks() {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user_profile: {
          select: {
            full_name: true,
            username: true,
            avatar_pic: true,
          },
        },
      },
    });
    return artworks;
  } catch (err) {
    console.error("Failed to fetch artworks:", err);
    return [];
  }
}

const ExploreLayout = async () => {
  const artworks = await getAllArtworks();

  return (
    <div className="flex flex-col gap-4 relative mt-10">
      {/* Search bar */}
      <div className="fixed top-12 md:left-5 md:right-5 z-20 left-2 right-2 bg-background py-5 pt-10">
        <div className="relative z-20">
          <input
            type="text"
            placeholder="Search"
            className="pl-15 h-[4em] w-full bg-primary rounded-md"
          />
          <BsSearch className="absolute top-4 left-5" />
        </div>
      </div>

      {/* Art grid */}
      {artworks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 mt-40">
          <p className="text-lg font-bold text-white">No artworks yet</p>
          <p className="text-sm mt-1" style={{ color: "#4b5563" }}>
            Be the first to upload your masterpiece.
          </p>
        </div>
      ) : (
        <div
          className="w-full mx-auto columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 mt-30"
        >
          {artworks.map((art) => (
            <Link
              href={`/explore/${art.artwork_id}`}
              key={art.artwork_id}
              className="break-inside-avoid"
            >
              <ArtList art={art} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreLayout;