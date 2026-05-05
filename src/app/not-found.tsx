"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(135deg, #050a05 0%, #0a140a 50%, #050a05 100%)" }}
    >
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 text-center">
        {/* 404 */}
        <h1
          className="text-[10rem] font-black leading-none tracking-tighter"
          style={{
            background: "linear-gradient(135deg, #16a34a, #4ade80)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>

        {/* Divider */}
        <div
          className="w-24 h-px mx-auto my-6"
          style={{ background: "linear-gradient(90deg, transparent, #22c55e, transparent)" }}
        />

        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-sm max-w-xs mx-auto mb-10" style={{ color: "#4b5563" }}>
          Looks like this canvas is empty. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300"
            style={{
              background: "#0d0d0d",
              color: "#4ade80",
              border: "1px solid #166534",
            }}
          >
            ← Go Back
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              color: "#000",
              boxShadow: "0 0 20px rgba(34,197,94,0.25)",
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}