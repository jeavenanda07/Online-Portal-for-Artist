import { TfiGallery } from "react-icons/tfi";
import { HiOutlineCake } from "react-icons/hi2";
import { CiLocationOn } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { SlActionRedo } from "react-icons/sl";
import { RiBallPenLine } from "react-icons/ri";
import { MdStorefront } from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";
import { getUserProfile } from "@/app/actions/userProfile";
import {getUserInfo} from "@/app/actions/user"
import Email from "next-auth/providers/email";
import { FaFacebook, FaInstagram, FaTwitter, FaTelegramPlane, FaGlobe } from "react-icons/fa";

const SECTIONS = [
  {
    key: "gallery",
    label: "Featured Gallery",
    description: "Submit your art to your gallery for featuring and display.",
    buttonLabel: "Submit Artwork",
    Icon: IoColorPaletteOutline,
  },
  {
    key: "shop",
    label: "Featured Shop",
    description: "List your artwork for sale and reach collectors worldwide.",
    buttonLabel: "List Item",
    Icon: MdStorefront,
  }
];

const formatDate = (dateString: Date | string) => {
  const date = new Date(dateString);
  
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};


async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const userData = await getUserInfo(`@${id}`, undefined)
  console.log("useData",  userData);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
           <div className="flex-1 flex flex-col gap-6">
            {SECTIONS.map(({ key, label, description, buttonLabel, Icon }) => (
              <div key={key}>
                <h4 className="text-sm font-semibold uppercase tracking-widest opacity-50 mb-3">
                  {label}
                </h4>

                <div className="group relative overflow-hidden bg-primary rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 h-72 sm:h-80 flex flex-col items-center justify-center gap-4 cursor-pointer">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-primary blur-3xl scale-75 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-gradient-primary transition-all duration-300 flex items-center justify-center">
                      <Icon className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">{label}</h4>
                      <p className="text-xs opacity-40 mt-1 max-w-xs leading-relaxed">{description}</p>
                    </div>
                    <button className="bg-gradient-primary text-sm font-semibold px-6 py-2 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:opacity-90 active:scale-95">
                      {buttonLabel}
                    </button>
                  </div>

                  {/* Subtle grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

{/* ── Right sidebar ──────────────────────────────────────────────── */}
<div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-5">

  {/* About card */}
  <div className="bg-primary rounded-2xl border border-white/5 overflow-hidden">
    <div className="px-5 py-4 border-b border-white/5">
      <h2 className="text-sm font-semibold uppercase tracking-widest opacity-50">
        About
      </h2>
    </div>

    <div className="px-5 py-4 space-y-3 text-sm">
      <AboutRow 
        icon={<HiOutlineCake className="h-4 w-4" />} 
        label="Birthday" 
        value={formatDate(userData?.birthdate || "")} 
      />
      <AboutRow icon={<CiLocationOn className="h-4 w-4" />} label="Location" value={userData?.display_location || "Philippines"} />
      <AboutRow icon={<CgProfile className="h-4 w-4" />} label="Joined"  value={formatDate(userData?.credentials?.created_at || "")}  />
      <AboutRow icon={<SlActionRedo className="h-4 w-4" />} label="Pronouns" value={userData?.gender || "Not Specified"} />
      <AboutRow icon={<RiBallPenLine className="h-4 w-4" />} label="Spec" value={userData?.specialization || "Artist"} />
      
      {/* Bio Section */}
      <div className="pt-3 border-t border-white/5">
        <div className="flex gap-3">
          <RiBallPenLine className="h-4 w-4 shrink-0 opacity-50 mt-0.5" />
          <p className="leading-relaxed opacity-70 italic text-xs">
            {userData?.about_me || "No bio available."}
          </p>
        </div>
      </div>

        {/* Skills Section */}
        {userData?.skills.length !== 0 && (
          <div className="pt-3 border-t border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {userData?.skills.map((skill: string, index: number) => (
                <span key={index} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/70">
                  {skill}
                </span>
              ))}
            </div>
        </div>
      )}

      {/* Social Links Section */}
      <div className="pt-3 border-t border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3">Socials</p>
        <div className="flex gap-4">
          {userData?.social_links && Object.entries(userData.social_links).map(([platform, url]) => {
            // CRITICAL: Skip if the value is the skills array or empty string
            if (!url || platform === 'skills' || typeof url !== 'string') return null;

            const getIcon = (name: string) => {
              switch (name) {
                case 'facebook': return <FaFacebook className="hover:text-blue-500" />;
                case 'instagram': return <FaInstagram className="hover:text-pink-500" />;
                case 'twitter': return <FaTwitter className="hover:text-blue-400" />;
                case 'telegram': return <FaTelegramPlane className="hover:text-blue-300" />;
                default: return <FaGlobe />;
              }
            };

            return (
              <a 
                key={platform} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-colors text-lg opacity-60 hover:opacity-100"
                title={platform}
              >
                {getIcon(platform)}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </div>

  <div className="bg-primary rounded-2xl border border-white/5 px-5 py-4 flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold">Commissions</p>
      <p className="text-xs opacity-40 mt-0.5">Currently open</p>
    </div>
    <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      Open
    </span>
  </div>

  {/* Comments card (unchanged) */}
  <div className="bg-primary rounded-2xl border border-white/5 overflow-hidden">
    <div className="px-5 py-4 border-b border-white/5">
      <h2 className="text-sm font-semibold uppercase tracking-widest opacity-50">
        Comments
      </h2>
    </div>
    <div className="px-5 py-10 flex items-center justify-center">
      <p className="text-xs opacity-30">No comments yet.</p>
    </div>
  </div>

</div>
        </div>
      </div>
    </div>
  );
}

// ─── Small helper component ───────────────────────────────────────────────────
function AboutRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="opacity-40 shrink-0">{icon}</span>
      <span className="opacity-40 w-16 shrink-0 text-xs">{label}</span>
      <span className="font-medium truncate">{value}</span>
    </div>
  );
}

export default Page;