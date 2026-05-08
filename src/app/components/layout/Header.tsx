"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Palette, Newspaper,   Menu, X, Bell, } from "lucide-react";
import { usePopup } from "@/hooks/usePopup";
import { useRouter, usePathname } from "next/navigation";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import ProfileMenu from "../Menu/ProfileMenu";
import Notification from "@/app/components/ui/Notification";
import ChatPopUp from "../chat/ChatPopUp";
import Logo from "../ui/Logo";
import { getSession, deleteSession } from "@/app/actions/auth";
import { setData } from "@/utils/storage";
import { notify } from "@/utils/toastHelper";
import { supabase } from "@/lib/supabaseClient";
import { getUserInfo } from "@/app/actions/user";

export const nav_links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Artworks", href: "/explore", icon: Palette },
  { label: "Community Feed", href: "/posts", icon: Newspaper },
];

export default function Header() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [profile, setProfile] = useState<any>();
  const [isLogin, setIsLoginIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notificationDropdown, setNotificationDropdown] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const mobileMenu = usePopup();
  const profileMenu = usePopup();

  useEffect(() => {
    const fetchSessionAndData = async () => {
      try {
        const sessionData = await getSession();

        if (sessionData) {
          setIsLoginIn(true);
          setProfile(await getUserInfo(sessionData?.username));
        }
      } catch (error) {
        console.error("Error fetching session/profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndData();
  }, []);

  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut();

      await deleteSession();

      setIsLoginIn(false);

      setData("token", false);

      profileMenu.close();

      notify("Logged out successfully", "success");

      router.refresh();
      router.push("/");
    } catch (error) {
      notify("Logout failed", "error");
    }
  };

  return (
    <>
      <header
        className="fixed bg-primary top-0 left-0 w-full h-16 z-[100] flex items-center justify-between border-b border-primary-line px-6 lg:px-14"
        style={{
          backdropFilter: "blur(20px)",
        }}
      >
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <Logo />

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav_links.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={label}
                  href={href}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
                  style={{ color: isActive ? "#4ade80" : "#4b5563" }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#4b5563";
                    }
                  }}
                >
                  <Icon size={14} />
                  {label}

                  {isActive && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                      style={{ background: "#22c55e" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div
                className="w-8 h-8 rounded-lg"
                style={{ background: "#1a2e1a" }}
              />

              <div
                className="w-8 h-8 rounded-lg"
                style={{ background: "#1a2e1a" }}
              />

              <div
                className="w-8 h-8 rounded-full"
                style={{ background: "#1a2e1a" }}
              />
            </div>
          ) : isLogin ? (
            <>
              {/* CHAT + NOTIFICATION */}
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => setIsChatOpen((i) => !i)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{
                    color: isChatOpen ? "#4ade80" : "#4b5563",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#4ade80";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isChatOpen
                      ? "#4ade80"
                      : "#4b5563";
                  }}
                >
                  <IoChatbubbleEllipsesOutline size={20} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationDropdown(!notificationDropdown);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 relative"
                  style={{
                    color: notificationDropdown
                      ? "#4ade80"
                      : "#4b5563",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#4ade80";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = notificationDropdown
                      ? "#4ade80"
                      : "#4b5563";
                  }}
                >
                  <Bell size={18} />

                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                    style={{
                      background: "#22c55e",
                      boxShadow: "0 0 6px #22c55e",
                    }}
                  />
                </button>
              </div>

              {/* DIVIDER */}
              <div
                className="hidden md:block w-px h-6 mx-1"
                style={{ background: "#1a2e1a" }}
              />

              {/* PROFILE */}
              <div className="relative" ref={profileMenu.ref as any}>
                <button
                  onClick={() => profileMenu.toggle()}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border transition-all duration-200"
                  style={{
                    border: profileMenu.isOpen
                      ? "1px solid #22c55e"
                      : "1px solid #1a2e1a",

                    background: profileMenu.isOpen
                      ? "rgba(34,197,94,0.05)"
                      : "transparent",
                  }}
                >
                  <Image
                    src={
                      profile?.avatar_pic ||
                      "/avatar_placeholder.png"
                    }
                    alt="profile"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    style={{
                      width: 32,
                      height: 32,
                    }}
                  />

                  <span className="hidden md:block text-xs font-bold max-w-[80px] truncate">
                    {profile?.username || "Profile"}
                  </span>
                </button>

                <AnimatePresence>
                  {profileMenu.isOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 8,
                        scale: 0.96,
                      }}
                      transition={{ duration: 0.15 }}
                      className="absolute max-sm:right-20 top-12 right-0 z-[110]"
                    >
                      <ProfileMenu handleLogOut={handleLogOut} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* DESKTOP ONLY LOGIN/JOIN */
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-widest transition-colors"
                style={{ color: "#4b5563" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#4b5563";
                }}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-5 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #16a34a, #22c55e)",

                  color: "#000",

                  boxShadow:
                    "0 0 16px rgba(34,197,94,0.2)",
                }}
              >
                Join Now
              </Link>
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={mobileMenu.open}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "#4b5563" }}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
      {mobileMenu.isOpen && (
  <>
    {/* BACKDROP */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={mobileMenu.close}
      className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm"
    />

    {/* SIDEBAR */}
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 300,
      }}
      className="fixed inset-y-0 right-0 w-[85%] max-w-[340px] z-[130] flex flex-col overflow-hidden border-l border-white/10 bg-primary shadow-2xl"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.25em] text-white">
            Navigation
          </h2>
          <p className="text-[11px] text-zinc-500 mt-1">
            Explore the platform
          </p>
        </div>

        <button
          onClick={mobileMenu.close}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-secondary text-zinc-400 hover:text-white hover:border-[#00d26a]/40 hover:bg-[#00d26a]/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* PROFILE SECTION */}
      {isLogin && (
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-4">
            <Image
              src={profile?.avatar_pic || "/avatar_placeholder.png"}
              alt="profile"
              width={52}
              height={52}
              className="rounded-2xl object-cover border border-white/10"
            />

            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                @{profile?.username || "username"}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {nav_links.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                onClick={mobileMenu.close}
                className={`group relative flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-200 ${
                  isActive
                    ? "bg-[#00d26a]/10 border border-[#00d26a]/20"
                    : "border border-transparent hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-[#00d26a]" />
                )}

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? "bg-[#00d26a] text-black"
                      : "bg-secondary text-zinc-400 group-hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                </div>

                {/* TEXT */}
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-black uppercase tracking-wide ${
                      isActive ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {label}
                  </span>

                  <span className="text-[11px] text-zinc-500">
                    Open {label.toLowerCase()}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/5 p-5">
        <button
          onClick={mobileMenu.close}
          className="w-full rounded-2xl bg-green-500 py-3 text-sm font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] active:scale-95"
        >
          Close Menu
        </button>
      </div>
    </motion.div>
  </>
)}
      </AnimatePresence>

      <Notification
        func={setNotificationDropdown}
        isOpen={notificationDropdown}
      />

      <ChatPopUp
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
}