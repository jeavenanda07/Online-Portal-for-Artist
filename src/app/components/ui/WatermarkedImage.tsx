"use client";

import Image from "next/image";

interface WatermarkedImageProps {
  src: string;
  alt: string;
  artistName: string;
}

export default function WatermarkedImage({ src, alt, artistName }: WatermarkedImageProps) {
  return (
    <div className="relative w-full h-full select-none">
      {/* Actual image */}
      <Image
        width={900}
        height={680}
        src={src || "/placeholder-img.png"}
        alt={alt}
        className="object-contain w-full h-full pointer-events-none"
        style={{ maxHeight: "680px" }}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()} // disable right-click save
      />

      {/* Diagonal repeating watermark grid */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ mixBlendMode: "overlay" }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center gap-1 opacity-20"
            style={{
              top: `${(i % 6) * 18}%`,
              left: `${Math.floor(i / 6) * 28}%`,
              transform: "rotate(-30deg)",
              whiteSpace: "nowrap",
            }}
          >
            <span className="text-white font-black text-xs tracking-widest uppercase">
              ArtistryHub
            </span>
            <span className="text-white font-bold text-[10px] tracking-wider">
              © {artistName}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom-right corner watermark */}
      <div
        className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg pointer-events-none"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      >
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center font-black text-[8px]"
          style={{ background: "#22c55e", color: "#000" }}
        >
          A
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-white font-black text-[10px] tracking-widest">ARTISTRYHUB</span>
          <span className="font-bold text-[9px]" style={{ color: "#4ade80" }}>© {artistName}</span>
        </div>
      </div>

      {/* "Protected" badge top-left */}
      <div
        className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg pointer-events-none"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(34,197,94,0.2)" }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#4ade80" }}>
          Protected
        </span>
      </div>
    </div>
  );
}