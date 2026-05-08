import { FaRegHeart, FaRegCommentAlt } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Package, Tag } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import GoBackBtn from "@/app/components/ui/GoBackBtn";
import Menu from "@/app/components/preview/Menu";
import { prisma } from "@/lib/prisma";
import ProfileIcon from "@/app/components/ui/ProfileIcon";
import WatermarkedImage from "@/app/components/ui/WatermarkedImage";
import BuyButtonSection from "@/app/components/ui/BuySectionButton"; 

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

  if (!art) return notFound();

  const author = art.user_profile;
  const status = statusColors[art.status] || statusColors["Not for Sale"];
  return (
    <div className="min-h-screen max-w-[1890px] w-full -mt-4 m-auto">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full px-4 md:px-10 py-10">
        <GoBackBtn />

        <div className="mt-6 lg:flex gap-10">
          <div className="flex-1 min-w-0">
            <div
              className="w-full rounded-2xl overflow-hidden flex items-center justify-center bg-primary border border-primary-line"
              style={{ minHeight: "420px", maxHeight: "680px" }}
            >
              {art.status === "For Sale" ? (
                <WatermarkedImage
                  src={art.art_file || "/placeholder-img.png"}
                  alt={art.artwork_title || "art preview"}
                  artistName={author?.full_name || author?.username || "Artist"}
                />
              ) : (
                <Image
                  width={900}
                  height={680}
                  src={art.art_file || "/placeholder-img.png"}
                  alt={art.artwork_title || "art preview"}
                  className="object-contain w-full h-full"
                />
              )}
            </div>

            <div className="flex justify-between items-center mt-5 px-1">
              <ul className="flex gap-6">
                <li className="flex items-center gap-2 cursor-pointer transition-colors group text-zinc-500">
                  <FaRegHeart className="group-hover:text-red-400 transition-colors" size={18} />
                  <span className="text-sm font-bold">{art.likes_count}</span>
                </li>
                <li className="flex items-center gap-2 cursor-pointer text-zinc-500">
                  <FaRegCommentAlt size={16} />
                  <span className="text-sm font-bold">0</span>
                </li>
              </ul>
              <Menu art={art} />
            </div>

            <div className="mt-5 mb-6 h-px bg-primary-line" />

            <div className="space-y-3 px-1">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-black">{art.artwork_title}</h2>
                <span
                  className="shrink-0 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                  style={{ background: status.bg, color: status.text }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                  {art.status}
                </span>
              </div>
              {art.description && (
                <p className="text-sm leading-relaxed text-zinc-400">{art.description}</p>
              )}
            </div>

            {/* Author Section */}
            <div className="flex items-center justify-between mt-6 px-4 py-4 rounded-2xl bg-primary">
              <div className="flex items-center gap-3">
                <ProfileIcon username={author?.username} />
                <div>
                  <p className="font-bold text-sm">{author?.full_name || author?.username}</p>
                  <p className="text-xs text-zinc-500">Artist</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500">
                {new Date(art.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Tags */}
            {art.tags && art.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5 px-1">
                {art.tags.map((tag: string, i: number) => (
                  <span key={i} className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-[#00d26a] text-black">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0 mt-8 lg:mt-0 space-y-4">
            <div className="rounded-2xl p-5 bg-primary border border-primary-line">
              <p className="text-xs font-black uppercase tracking-widest mb-3">Listing</p>
              
              {/* INTERACTIVE COMPONENT HERE */}
              <BuyButtonSection art={art} id={id}/>
            </div>

            {/* Details card */}
            <div className="rounded-2xl p-5 space-y-4 bg-primary border border-primary-line">
              <p className="text-xs font-black uppercase tracking-widest">Details</p>
              {[
                { label: "Type",   value: art.artwork_type },
                { label: "Status", value: art.status },
                { label: "Sold",   value: `${art.sold} sold` },
                { label: "Posted", value: new Date(art.created_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500">{label}</span>
                  <span className="text-xs font-black">{value}</span>
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