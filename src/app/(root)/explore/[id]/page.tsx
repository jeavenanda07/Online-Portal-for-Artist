import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Package, Tag } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import GoBackBtn from "@/app/components/ui/GoBackBtn";
import Menu from "@/app/components/preview/Menu";
import { prisma } from "@/lib/prisma";
import ProfileIcon from "@/app/components/ui/ProfileIcon";
import DownloadButton from "@/app/components/ui/DownloadButton";

async function getArtwork(id: string) {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { artwork_id: id },
      include: {
        user_profile: {
          select: {
            user_profile_id: true,
            full_name: true,
            username: true,
            avatar_pic: true,
          },
        },
      },
    });
    return artwork;
  } catch (err) {
    console.error("getArtwork error:", err);
    return null;
  }
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  "For Sale":      { bg: "rgba(34,197,94,0.1)",  text: "#4ade80", dot: "#22c55e" },
  "Not for Sale":  { bg: "rgba(113,113,122,0.1)", text: "#71717a", dot: "#71717a" },
  "Free Download": { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", dot: "#3b82f6" },
};

const ArtPreview = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const art = await getArtwork(id);

  if (!art) return notFound()

  const author = art.user_profile;
  const status = statusColors[art.status] || statusColors["Not for Sale"];

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #050a05 0%, #0a140a 50%, #050a05 100%)" }}
    >
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-10 py-10">
        <GoBackBtn />

        <div className="mt-6 lg:flex gap-10">

          <div className="flex-1 min-w-0">
            <div
              className="w-full rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                background: "#0d0d0d",
                border: "1px solid #1a2e1a",
                minHeight: "420px",
                maxHeight: "680px",
              }}
            >

              <Image
                width={900}
                height={680}
                src={art.art_file || "/placeholder-img.png"}
                alt={art.artwork_title || "art preview"}
                className="object-contain w-full h-full"
                style={{ maxHeight: "680px" }}
              />
            </div>

            {/* Reaction row */}
            <div
              className="flex justify-between items-center mt-5 px-1"
            >
              <ul className="flex gap-6">
                <li
                  className="flex items-center gap-2 cursor-pointer transition-colors group"
                  style={{ color: "#4b5563" }}
                >
                  <FaRegHeart className="group-hover:text-red-400 transition-colors" size={18} />
                  <span className="text-sm font-bold">{art.likes_count}</span>
                </li>
                <li
                  className="flex items-center gap-2 cursor-pointer"
                  style={{ color: "#4b5563" }}
                >
                  <FaRegCommentAlt size={16} />
                  <span className="text-sm font-bold">0</span>
                </li>
              </ul>
              <Menu art={art} />
            </div>

            {/* Divider */}
            <div className="mt-5 mb-6 h-px" style={{ background: "#1a2e1a" }} />

            {/* Title & description */}
            <div className="space-y-3 px-1">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-black text-white leading-tight">{art.artwork_title}</h2>
                {/* Status badge */}
                <span
                  className="shrink-0 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                  style={{ background: status.bg, color: status.text }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                  {art.status}
                </span>
              </div>

              {art.description && (
                <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
                  {art.description}
                </p>
              )}
            </div>

            {/* Author row */}
            <div
              className="flex items-center justify-between mt-6 px-4 py-4 rounded-2xl"
              style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
            >
              <div className="flex items-center gap-3">
                {author?.avatar_pic ? (
                  <ProfileIcon 
                    username={author?.username}
                    email={undefined}
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm"
                    style={{ background: "#1a2e1a", color: "#4ade80" }}
                  >
                    {author?.full_name?.[0] || "A"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-white text-sm">
                    {author?.full_name || author?.username}
                  </p>
                  <p className="text-xs" style={{ color: "#4b5563" }}>0 followers</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-xs hidden sm:block" style={{ color: "#4b5563" }}>
                  {new Date(art.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <button
                  className="px-4 py-1.5 rounded-lg text-xs font-black transition-all"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  Follow
                </button>
              </div>
            </div>

            {/* Tags */}
            {art.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5 px-1">
                {art.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold"
                    style={{
                      background: "rgba(34,197,94,0.07)",
                      color: "#4b5563",
                      border: "1px solid #1a2e1a",
                    }}
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 h-px" style={{ background: "#1a2e1a" }} />

            {/* Comments */}
            <div className="mt-8 px-1">
              <button className="flex items-center gap-2 mb-6" style={{ color: "#4b5563" }}>
                <FaRegCommentAlt size={14} />
                <span className="text-sm font-bold">0 Comments</span>
                <MdKeyboardArrowDown size={18} />
              </button>
              {/* Wire up comments when ready */}
              <div
                className="py-12 flex flex-col items-center justify-center rounded-2xl"
                style={{ border: "2px dashed #1a2e1a" }}
              >
                <FaRegCommentAlt size={24} style={{ color: "#1a2e1a" }} />
                <p className="text-xs mt-3 font-bold" style={{ color: "#4b5563" }}>
                  No comments yet. Be the first.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="lg:w-80 shrink-0 mt-8 lg:mt-0 space-y-4">

            {/* Price card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
            >
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#4b5563" }}>
                Listing
              </p>

              {art.status === "For Sale" ? (
                <>
                  <p className="text-3xl font-black text-white mb-1">
                    ₱{art.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-1.5 mb-5" style={{ color: "#4b5563" }}>
                    <Package size={13} />
                    <span className="text-xs font-bold">{art.stocks} in stock</span>
                  </div>
                  <button
                    className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg,#16a34a,#22c55e)",
                      color: "#000",
                      boxShadow: "0 0 20px rgba(34,197,94,0.2)",
                    }}
                  >
                    Buy Now
                  </button>
                  <button
                    className="w-full py-3 rounded-xl font-black text-sm mt-2 transition-all"
                    style={{ background: "transparent", color: "#4ade80", border: "1px solid #1a2e1a" }}
                  >
                    Add to Cart
                  </button>
                </>
              ) : art.status === "Free Download" ? (
               <DownloadButton artworkId={id}/>
              ) : (
                <p className="text-sm font-bold" style={{ color: "#4b5563" }}>
                  This artwork is not for sale.
                </p>
              )}
            </div>

            {/* Artwork info card */}
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "#0d0d0d", border: "1px solid #1a2e1a" }}
            >
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#4b5563" }}>
                Details
              </p>
              {[
                { label: "Type",    value: art.artwork_type },
                { label: "Status",  value: art.status },
                { label: "Sold",    value: `${art.sold} sold` },
                { label: "Likes",   value: art.likes_count },
                { label: "Posted",  value: new Date(art.created_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs font-bold" style={{ color: "#4b5563" }}>{label}</span>
                  <span className="text-xs font-black text-white">{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtPreview;