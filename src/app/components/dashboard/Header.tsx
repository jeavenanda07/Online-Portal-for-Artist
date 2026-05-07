'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { CgLogOut } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-10 h-16 flex items-center justify-between
      px-6 bg-background backdrop-blur-md border-b border-[#1a2e1a]">

      {/* Left — page breadcrumb hint */}
      <div className="flex items-center gap-2 text-[#3a5c3a] text-sm">
        <RxDashboard className="text-base" />
        <span className="text-[#5a7a5a]">/</span>
        <span className="text-[#b8dbb8] font-medium">Admin Panel</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg
              text-[#6b8f6b] hover:bg-[#0d1a0d] hover:text-[#39ff6a] transition-all duration-150"
          >
            <IoNotifications className="text-lg" />
            {/* unread dot */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#39ff6a] rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0a130a] border border-[#1a2e1a]
              rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1a2e1a]">
                <p className="text-xs font-semibold text-[#39ff6a] tracking-wide uppercase">
                  Notifications
                </p>
              </div>
              {[
                { title: "New report submitted", time: "2 min ago" },
                { title: "Artwork flagged for review", time: "1 hr ago" },
                { title: "New user registered", time: "3 hrs ago" },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-[#0d1a0d] transition-colors cursor-pointer
                  border-b border-[#111e11] last:border-0">
                  <p className="text-sm text-[#c8e6c8] font-medium">{n.title}</p>
                  <p className="text-xs text-[#3a5c3a] mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#1a2e1a] mx-1" />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-lg
              hover:bg-[#0d1a0d] transition-all duration-150 group"
          >
            <Image
              width={32}
              height={32}
              src="https://i.pinimg.com/736x/76/84/b7/7684b7cbf34ac441c6f377f359fb6868.jpg"
              alt="Admin avatar"
              className="rounded-lg w-8 h-8 object-cover ring-1 ring-[#1a3a1a] group-hover:ring-[#39ff6a]/40 transition-all"
            />
            <div className="text-left">
              <p className="text-xs font-semibold text-[#c8e6c8] leading-none">Admin</p>
              <p className="text-[10px] text-[#3a5c3a] leading-none mt-0.5">Administrator</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0a130a] border border-[#1a2e1a]
              rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1a2e1a]">
                <p className="text-xs font-medium text-[#c8e6c8]">Signed in as</p>
                <p className="text-xs text-[#39ff6a] font-semibold mt-0.5">Administrator</p>
              </div>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm
                  text-[#7a5a5a] hover:bg-[#1f0d0d] hover:text-[#ff6b6b] transition-all"
              >
                <CgLogOut className="text-base" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}