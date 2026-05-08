import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { LiaCommentDotsSolid } from "react-icons/lia";
import { IoCartOutline } from "react-icons/io5";

interface ArtListProps {
  art: {
    artwork_id: string;
    art_file: string;
    artwork_title: string;
    likes_count: number;
    sold: number;
    status: string;
    user_profile: {
      full_name: string;
      username: string;
      avatar_pic: string | null;
    } | null;
  };
}


const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  "For Sale":      { bg: "rgba(34,197,94,0.1)",  text: "#4ade80", dot: "#22c55e" },
  "Not for Sale":  { bg: "rgba(113,113,122,0.1)", text: "#71717a", dot: "#71717a" },
  "Free Download": { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", dot: "#3b82f6" },
};


export default function ArtList({ art }: ArtListProps) {
  const author = art.user_profile;

  console.log(art)
  return (
    <div className="mb-4 w-full break-inside-avoid relative">
      <div className="art-item-wrapper rounded-md overflow-hidden relative group">
        <Image
          src={art.art_file}
          alt={art.artwork_title || "Artwork"}
          width={400}
          height={400}
          className="artlist-card w-full h-auto rounded-md transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="artlist-description absolute bottom-0 left-0 text-white p-2 text-sm w-full">
          <h6 className="font-semibold text-md mb-2">
            {art.artwork_title || "Untitled"}
          </h6>

          {/* Author */}
          <div className="flex items-center gap-2 mb-2">
            {author?.avatar_pic ? (
              <Image
                width={24}
                height={24}
                src={author.avatar_pic}
                alt={author.full_name || author.username}
                className="h-6 w-6 object-cover rounded-full"
              />
            ) : (
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: "#22c55e", color: "#000" }}
              >
                {author?.full_name?.[0] || "A"}
              </div>
            )}
            <p className="text-xs">{author?.full_name || author?.username || "Artist"}</p>
          </div>

          {/* Stats */}
          <section className="flex justify-between text-xs">
            <section className="flex items-center gap-4 opacity-60">
              <div className="flex items-center gap-2">
                <FaRegHeart />
                <p>{art.likes_count}</p>
              </div>
              <div className="flex items-center gap-2">
                <LiaCommentDotsSolid />
                <p>0</p>
              </div>
            </section>
       
              {
                art?.status === "For Sale" &&
                <div className="flex items-center gap-2 bg-orange-600 w-fit px-2 rounded-full py-1 text-xs">
                      <IoCartOutline />
                <p>{art.sold}</p>
                </div>
              }

            
          </section>
        </div>

        {/* For Sale badge */}
        {art.status && statusColors[art.status] && (() => {
            const colors = statusColors[art.status];
            return (
              <div className="absolute top-2 left-1 z-10">
                <span
                  // 3. Apply the custom background color, text color, and backdrop blur
                  className="backdrop-blur-[9px] py-1.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                  style={{
                    background: colors.bg,
                    color: colors.text,
                  }}
                >
                  {/* The colored status dot */}
                  <span 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ background: colors.dot }} 
                  />
                  {art.status}
                </span>
              </div>
            );
          })()}
      </div>
    </div>
  );
}