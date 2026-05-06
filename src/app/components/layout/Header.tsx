"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, Home, Globe, ShoppingBag, Trophy } from "lucide-react";
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
  { label: "Explore", href: "/explore", icon: Globe },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Leaderboards", href: "/leaderboards", icon: Trophy },
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
        className="fixed bg-primary top-0 left-0 w-full h-16 z-[100] flex items-center justify-between border-b-1 border-primary-line px-6 lg:px-14"
        style={{
          backdropFilter: "blur(20px)",
        }}
      >

        <div className="flex items-center gap-10">
          <Logo />

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
                    if (!isActive) e.currentTarget.style.color = "#e5e7eb";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#4b5563";
                  }}
                >
                  <Icon size={14} />
                  {label}
                  {/* Active underline */}
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


        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-lg" style={{ background: "#1a2e1a" }} />
              <div className="w-8 h-8 rounded-lg" style={{ background: "#1a2e1a" }} />
              <div className="w-8 h-8 rounded-full" style={{ background: "#1a2e1a" }} />
            </div>
          ) : isLogin ? (
            <>
   
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => setIsChatOpen((i) => !i)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{ color: isChatOpen ? "#4ade80" : "#4b5563" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#4ade80")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isChatOpen ? "#4ade80" : "#4b5563")}
                >
                  <IoChatbubbleEllipsesOutline size={20} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationDropdown(!notificationDropdown);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 relative"
                  style={{ color: notificationDropdown ? "#4ade80" : "#4b5563" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#4ade80")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = notificationDropdown ? "#4ade80" : "#4b5563")}
                >
                  <Bell size={18} />
                  {/* Notification dot */}
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                    style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
                  />
                </button>
              </div>

    
              <div className="hidden md:block w-px h-6 mx-1" style={{ background: "#1a2e1a" }} />

  

<div className="relative" ref={profileMenu.ref as any}>
  <button
    onClick={() => profileMenu.toggle()}
    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border transition-all duration-200"
    style={{
      border: profileMenu.isOpen ? "1px solid #22c55e" : "1px solid #1a2e1a",
      background: profileMenu.isOpen ? "rgba(34,197,94,0.05)" : "transparent",
    }}
  >
    <Image
      src={profile?.avatar_pic || "/avatar_placeholder.png"}
      alt="profile"
      width={32}
      height={32}
      className="rounded-full object-cover"
      style={{ width: 32, height: 32 }}
    />
    <span className="hidden md:block text-xs font-bold max-w-[80px] truncate">
      {profile?.username || "Profile"}
    </span>
  </button>

  <AnimatePresence>
    {profileMenu.isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.15 }}

        className="absolute top-12 right-0 z-[110]"
      >
        <ProfileMenu handleLogOut={handleLogOut} />
      </motion.div>
    )}
  </AnimatePresence>
</div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-widest transition-colors"
                style={{ color: "#4b5563" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e5e7eb")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  color: "#000",
                  boxShadow: "0 0 16px rgba(34,197,94,0.2)",
                }}
              >
                Join Now
              </Link>
            </div>
          )}

   
          <button
            onClick={mobileMenu.open}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "#4b5563" }}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>


      <AnimatePresence>
        {mobileMenu.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={mobileMenu.close}
              className="fixed inset-0 z-[120]"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 w-[75%] max-w-xs z-[130] flex flex-col p-8"
              style={{ background: "#0a140a", borderLeft: "1px solid #1a2e1a" }}
            >
              <button
                onClick={mobileMenu.close}
                className="self-end mb-10 w-9 h-9 flex items-center justify-center rounded-lg"
                style={{ color: "#4b5563", border: "1px solid #1a2e1a" }}
              >
                <X size={18} />
              </button>

              <nav className="flex flex-col gap-2">
                {nav_links.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={mobileMenu.close}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
                      style={{
                        color: isActive ? "#4ade80" : "#4b5563",
                        background: isActive ? "rgba(34,197,94,0.06)" : "transparent",
                        borderLeft: isActive ? "2px solid #22c55e" : "2px solid transparent",
                      }}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              {!isLogin && (
                <div className="mt-auto flex flex-col gap-3">
                  <Link href="/login" onClick={mobileMenu.close}
                    className="w-full py-3 text-center text-sm font-bold rounded-xl transition-all"
                    style={{ border: "1px solid #1a2e1a", color: "#4ade80" }}>
                    Login
                  </Link>
                  <Link href="/register" onClick={mobileMenu.close}
                    className="w-full py-3 text-center text-sm font-black rounded-xl"
                    style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#000" }}>
                    Join Now
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Notification func={setNotificationDropdown} isOpen={notificationDropdown} />
      <ChatPopUp isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}