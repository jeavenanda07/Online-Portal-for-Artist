"use client";

import { ChevronRight, Heart, Search, Bell, Bookmark, TrendingUp, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ── Sample Data ──────────────────────────────────────────────
const featured = [
  { id: 1, title: "Neon Solitude", artist: "Jeaven Paras", category: "Digital Art", price: 500, likes: 1204, src: "https://i.pinimg.com/736x/38/0b/88/380b88bffd8486577dc3cec2482cfac7.jpg", badge: "Staff Pick" },
  { id: 2, title: "Hollow Bloom", artist: "Seraphina Wynter", category: "Painting", price: 489, likes: 987, src: "https://i.pinimg.com/736x/09/6b/de/096bde6d8f3733af87daeae50f1d6b2f.jpg", badge: "Trending" },
  { id: 3, title: "Drift VII", artist: "Quinn Turner", category: "Concept Art", price: 445, likes: 832, src: "https://i.pinimg.com/736x/25/9b/13/259b13778fe37d82a3e1df2428aa338c.jpg", badge: null },
  { id: 4, title: "Echo Garden", artist: "Mia Carter", category: "Illustration", price: 399, likes: 711, src: "https://i.pinimg.com/736x/73/95/32/739532030d1de7ecb3fc0c0e3a594a5e.jpg", badge: null },
  { id: 5, title: "Signal Lost", artist: "Liam Turner", category: "Pixel Art", price: 346, likes: 603, src: "https://i.pinimg.com/736x/19/5c/ea/195cea83e315b257604c06e3efc1fa62.jpg", badge: "New" },
  { id: 6, title: "Pale Archive", artist: "Ethan Brooks", category: "Sketch", price: 289, likes: 544, src: "https://i.pinimg.com/736x/04/bf/21/04bf21630dac66ba9048ad70d84467e5.jpg", badge: null },
];

const topArtists = [
  { name: "Jeaven Paras", username: "@jeavendrie", artworks: 1200, avatar: "https://i.pinimg.com/1200x/c9/70/79/c9707949e969fd0c80bb6d3c6eae2ae7.jpg" },
  { name: "Seraphina Wynter", username: "@seraphinamae", artworks: 1096, avatar: "https://i.pinimg.com/736x/07/f0/78/07f078f3f067607c62b1739d39fc30a7.jpg" },
  { name: "Quinn Turner", username: "@quinnverty", artworks: 980, avatar: "https://i.pinimg.com/736x/59/45/8f/59458f89a8df4ab7472a06fcfbf223da.jpg" },
];

const categories = ["All", "Digital", "Painting", "Sketch", "Pixel", "Concept"];

const recentlyLiked = [
  { title: "Midnight Resonance", category: "Digital Art", likes: 428, image: "https://i.pinimg.com/736x/aa/47/a5/aa47a5df10aa9dbe16f56ba7eb3b95db.jpg" },
  { title: "Ethereal Bloom", category: "Painting", likes: 312, image: "https://i.pinimg.com/1200x/a1/89/85/a189854911a37f572a76ebb31b7c4446.jpg" },
  { title: "Cyber Cityscape", category: "Pixel Art", likes: 250, image: "https://i.pinimg.com/736x/fc/e9/e3/fce9e33a03fcad649f072f0731d99040.jpg" },
  { title: "Serene Waters", category: "Photography", likes: 180, image: "https://i.pinimg.com/736x/da/6b/19/da6b19742a9bf64674215b6faa5893c9.jpg" },
];

// ── Art Card ─────────────────────────────────────────────────
const ArtCard = ({ art }: { art: typeof featured[0] }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-primary border border-[#1a2e1a] hover:border-[#22c55e]/40 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={art.src} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button onClick={() => setLiked(!liked)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-[#22c55e] hover:text-black transition-all">
            <Heart size={16} fill={liked ? "currentColor" : "none"} className={liked ? "text-red-400" : ""} />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#22c55e] text-black flex items-center justify-center hover:scale-110 transition-transform font-bold text-xs">
            Buy
          </button>
          <button onClick={() => setSaved(!saved)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-all">
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} className="" />
          </button>
        </div>
        {art.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md"
            style={{ background: art.badge === "Staff Pick" ? "#22c55e" : art.badge === "Trending" ? "#f59e0b" : "#3b82f6", color: "#000" }}>
            {art.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold  text-sm">{art.title}</h4>
            <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>{art.artist} · {art.category}</p>
          </div>
          <span className="text-sm font-black" style={{ color: "#4ade80" }}>₱{art.price}</span>
        </div>
        <div className="flex items-center gap-1 mt-3" style={{ color: "#4b5563" }}>
          <Heart size={12} />
          <span className="text-xs">{art.likes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────
const ModernHomepage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">

      <section className="relative px-6 lg:px-20 pt-14 pb-16 border-b border-primary-border overflow-hidden">

        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-5 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: "#4ade80" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
              </span>
              Live community
            </div>
            <h1 className="text-4xl lg:text-5xl font-black  leading-[1.1] tracking-tight">
              Your creative feed,<br />
              <span style={{ color: "#4ade80" }}>curated for you.</span>
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
              Discover art from the community, support local artists, and find your next favorite piece.
            </p>
          </div>

      
          <div className="flex gap-6 lg:gap-10">
            {[{ label: "Artists", value: "1.2k" }, { label: "Artworks", value: "8.4k" }].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black ">{s.value}</p>
                <p className="text-xs mt-1 font-semibold uppercase tracking-widest" style={{ color: "#4b5563" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="px-6 lg:px-20 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-black  flex items-center gap-3">
              <span className="h-6 w-1 rounded-full" style={{ background: "#22c55e" }} />
              Featured Masterpieces
            </h2>
            <p className="text-xs mt-1 ml-4" style={{ color: "#4b5563" }}>Hand-picked by the community</p>
          </div>

          <div className="flex gap-2 flex-wrap ml-4 sm:ml-0">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="text-xs font-bold px-4 py-1.5 bg-secondary rounded-full transition-all duration-200"
                style={activeCategory === cat
                  ? { background: "#22c55e", color: "#000" }
                  : { background: "", color: "#4b5563", border: "1px solid #1a2e1a" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((art) => <ArtCard key={art.id} art={art} />)}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/explore"
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all bg-green-400">
            Explore All Artworks <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Top Creators ── */}
      <section className="px-6 lg:px-20 py-16 border-t border-[#1a2e1a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black  flex items-center gap-3">
                <span className="h-6 w-1 rounded-full" style={{ background: "#22c55e" }} />
                Top Creators
              </h2>
              <p className="text-xs mt-1 ml-4" style={{ color: "#4b5563" }}>Most active this month</p>
            </div>
            <Link href="/leaderboards" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-colors"
              style={{ color: "#4b5563" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4ade80")}
              onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}>
              Leaderboard <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topArtists.map((artist, i) => (
              <div key={i} className="group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer bg-primary border-primary-line"
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1a2e1a")}>

                {/* Rank */}
                <span className="text-3xl font-black w-8 shrink-0" style={{ color: i === 0 ? "#4ade80" : "#1a2e1a" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2">
                  <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm  truncate">{artist.name}</p>
                  <p className="text-xs truncate" style={{ color: "#4b5563" }}>{artist.username} · {artist.artworks.toLocaleString()} works</p>
                </div>

                <button className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: "#0d0d0d", color: "#4ade80", border: "1px solid #1a2e1a" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.color = "#000"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#0d0d0d"; e.currentTarget.style.color = "#4ade80"; }}>
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-20 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.1)" }}>
            <Heart size={20} fill="currentColor" className="text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black ">Recently Liked</h2>
            <p className="text-xs" style={{ color: "#4b5563" }}>What the community is loving right now</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyLiked.map((item, i) => (
            <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#1a2e1a]">
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#4ade80" }}>{item.category}</p>
                <p className="font-bold  text-sm mt-1">{item.title}</p>
                <div className="flex items-center gap-1 mt-2" style={{ color: "#9ca3af" }}>
                  <Heart size={12} fill="currentColor" className="text-red-400" />
                  <span className="text-xs">{item.likes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-20 py-20">
        <div className="max-w-5xl mx-auto rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #052e16 0%, #0a1a0a 100%)", border: "1px solid #166534" }}>

          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.2) 0%, transparent 70%)", filter: "blur(30px)" }} />

          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: "#4ade80" }}>
              Start creating today
            </p>
            <h2 className="text-3xl lg:text-5xl text-white font-black  mb-4 leading-tight">
              Ready to share your vision?
            </h2>
            <p className="mb-10 max-w-md mx-auto text-sm leading-relaxed" style={{ color: "#4b5563" }}>
              Join hundreds of local artists in Atimonan. Start selling or showcasing your work today.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/profile/create"
                className="px-10 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#000", boxShadow: "0 0 24px rgba(34,197,94,0.3)" }}>
                Upload Your Art
              </Link>
              <Link href="/explore"
                className="px-10 py-3.5 rounded-xl font-black text-sm transition-all"
                style={{ background: "transparent", color: "#4ade80", border: "1px solid #166534" }}>
                Browse First
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default ModernHomepage;