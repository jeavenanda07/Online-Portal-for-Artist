"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getSession } from "@/app/actions/auth";

const sections = [
  {
    id: "discover",
    href: "/explore",
    image: "/discover-art.png",
    label: "Discover Art",
    description: "Browse thousands of artworks from creators worldwide.",
    message: "Explore amazing artworks from talented artists!",
  },
  {
    id: "sell",
    href: "/profile/USR001/shop",
    image: "/sell-art.png",
    label: "Sell Art",
    description: "Turn your passion into profit. Set up your shop today.",
    message: "Start selling your artwork to the world!",
  },
  {
    id: "buy",
    href: "/posts",
    image: "/buy-art.png",
    label: "Community Feed",
    description: "Collect one-of-a-kind pieces from independent artists.",
    message: "Find and collect unique pieces you'll love!",
  },
];

function GetStarted() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        toast.error("Please log in to continue.");
        router.push("/login");
      }
    };
    checkSession();
  }, []);

  const handleSelect = (section: (typeof sections)[0]) => {
    if (selected === section.id) return;
    setSelected(section.id);

    if (toastIdRef.current !== null) {
      toast.dismiss(toastIdRef.current);
    }

    toastIdRef.current = toast.info(section.message, {
      autoClose: 2500,
    });
  };

  const handleGetStarted = () => {
    const picked = sections.find((s) => s.id === selected);
    if (!picked) {
      toast.error("Please select an option first.");
      return;
    }
    router.push(picked.href);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "linear-gradient(135deg, #050a05 0%, #0a140a 50%, #050a05 100%)" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <div className="relative text-center mb-14 z-10">
        <span
          className="inline-block text-xs uppercase tracking-[0.35em] font-bold mb-4 px-4 py-1.5 rounded-full border"
          style={{ color: "#4ade80", borderColor: "#166534", background: "rgba(34,197,94,0.07)" }}
        >
          Welcome to ArtistryHub
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
          What brings you here?
        </h1>
        <p className="mt-3 text-base max-w-sm mx-auto" style={{ color: "#4b5563" }}>
          Choose your path — you can always explore the rest later.
        </p>
      </div>

      {/* Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
        {sections.map((section) => {
          const isSelected = selected === section.id;
          return (
            <button
              key={section.id}
              onClick={() => handleSelect(section)}
              className="group relative flex flex-col items-center text-center rounded-2xl p-7 border transition-all duration-300 cursor-pointer overflow-hidden"
              style={{
                background: isSelected
                  ? "linear-gradient(145deg, #052e16, #0a1a0a)"
                  : "linear-gradient(145deg, #0d0d0d, #111411)",
                borderColor: isSelected ? "#22c55e" : "#1a2e1a",
                boxShadow: isSelected
                  ? "0 0 0 1px #22c55e, 0 0 40px rgba(34,197,94,0.12), inset 0 1px 0 rgba(34,197,94,0.1)"
                  : "0 0 0 1px #1a2e1a",
              }}
            >
              {/* Glow blob on selected */}
              {isSelected && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 70%)",
                    filter: "blur(12px)",
                  }}
                />
              )}

              {/* Checkmark */}
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "green" }}
                >
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Image container */}
              <div
                className="w-24 h-24 mb-5 p-4 bg-secondary rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: isSelected ? "rgba(34,197,94,0.1)" : "#171F2F",
                  border: isSelected ? "1px solid rgba(34,197,94,0.2)" : "#171F2F",
                }}
              >
              <img
              src={section.image}
              alt={section.label}
              className="w-32 h-32 object-contain"
            />
              </div>

              {/* Label */}
              <p
                className="text-base font-bold mb-1.5 transition-colors duration-200"
                style={{ color: isSelected ? "#4ade80" : "#e5e7eb" }}
              >
                {section.label}
              </p>

              {/* Description */}
              <p className="text-xs leading-relaxed" style={{ color: "#4b5563" }}>
                {section.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* CTA */}

<div className="relative z-10 mt-10">
  <button
    onClick={handleGetStarted}
    disabled={!selected}
    className="px-14 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300"
    style={
      selected
        ? {
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            color: "#000",
            boxShadow: "0 0 24px rgba(34,197,94,0.35), 0 4px 12px rgba(0,0,0,0.4)",
            opacity: 1,
          }
        : {
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            color: "#000",
            opacity: 0.25,
            cursor: "not-allowed",
          }
    }
  >
    Get Started →
  </button>
</div>
    </div>
  );
}

export default GetStarted;