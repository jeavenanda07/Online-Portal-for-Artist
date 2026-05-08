"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Moon, Sun, LogOut, ShoppingBag, 
  User, ChevronRight, Monitor
} from "lucide-react";

import { getSession } from "@/app/actions/auth";
import { setTheme as setCookieTheme } from "@/app/actions/theme";
import {sessionData } from "@/types/session"
import {getUserInfo} from "@/app/actions/user"
import { notify } from "@/utils/toastHelper";

interface ProfileMenuProps {
  handleLogOut: () => void;
}

type Theme = "light" | "dark";

export const ProfileMenuSkeleton = () => {
  return (
    <div className="flex items-center justify-center animate-pulse">
      <div className="relative w-[320px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-primary/80 backdrop-blur-2xl shadow-2xl">
        
        <div className="p-8 pb-6 flex flex-col items-center border-b border-white/5">
          <div className="w-20 h-20 rounded-full bg-zinc-800 mb-4" />
          <div className="h-5 w-32 bg-zinc-800 rounded-md mb-2" />
          <div className="h-3 w-40 bg-zinc-800 rounded-md mb-4" />
          <div className="h-4 w-16 bg-zinc-800 rounded-full" />
        </div>

        <div className="p-4 space-y-3">
          <div className="h-12 bg-zinc-800 rounded-2xl" />
          <div className="h-12 bg-zinc-800 rounded-2xl" />
          
          <div className="h-px bg-white/5 my-2 mx-4" />

          <div className="h-12 bg-zinc-800 rounded-2xl" />
          <div className="h-12 bg-zinc-800 rounded-2xl" />
          <div className="h-14 bg-zinc-800 rounded-[1.5rem]" />
        </div>

      </div>
    </div>
  );
};

const ProfileMenu = ({ handleLogOut }: ProfileMenuProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      try {
        const sessionData = await getSession();
        if (sessionData) setUserData(await getUserInfo(sessionData.username));
      } catch (error) {
        console.log(error)
        notify("Error fetching session/profile data", 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndData();
  }, []);

  useEffect(() => {
    if (theme === null) return; 
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains("light") ? "light" : "dark";
    setThemeState(currentTheme);
  }, []);

  const handleThemeChange = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await setCookieTheme(newTheme);
  };

  if (loading) {
    return <ProfileMenuSkeleton />;
  }

  return (
    <div className=" flex items-center justify-center">
      <div className="relative w-[320px] overflow-hidden max-md:translate-x-[120px] rounded-[2.5rem] border border-white/10 bg-primary backdrop-blur-2xl shadow-2xl">
        
        <div className="p-8 pb-6 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <Link href={`/profile/${userData?.username?.replace(/^@/, '')}`} className="relative block">
              <div className="rounded-full p-1 bg-gradient-to-tr from-green-400 to-emerald-600">
                <Image
                  width={80}
                  height={80}
                  src={userData?.avatar_pic || "/avatar_placeholder.png"}
                  alt="user profile"
                  className="h-20 w-20 rounded-full bg-primary object-cover border-2 border-black"
                />
              </div>
            </Link>
          </div>

          <h1 className="text-xl font-heading italic uppercase tracking-tighter">
            {userData?.full_name || "Artist Name"}
          </h1>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
            {userData?.credentials?.gmail || ""}
          </p>
          {userData && (
            <span className="mt-2 text-[9px] font-black text-green-400 border border-green-400/20 px-2 py-0.5 rounded-full uppercase">
              {userData?.credentials?.role}
            </span>
          )}
        </div>

        <div className="p-4 space-y-1">
          <MenuLink href="/profile" icon={<User size={16}/>} label="My Portfolio" />
          <MenuLink href="/my-purchases" icon={<ShoppingBag size={16}/>} label="Purchases" />
          
          <div className="h-px bg-white/5 my-2 mx-4" />

          {/* THEME SWITCHER */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 ">
              <Sun size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Theme</span>
            </div>
            
            <div className="flex bg-black/40 p-1 rounded-full border border-white/5 relative isolate">
              <motion.div 
                animate={{ x: theme === 'light' ? 0 : 32 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute inset-y-1 left-1 w-8 bg-green-400 rounded-full -z-10"
              />
              <button 
                onClick={() => handleThemeChange("light")}
                className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? '' : ''}`}
              >
                <Sun size={14} />
              </button>
              <button 
                onClick={() => handleThemeChange("dark")}
                className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? '' : ''}`}
              >
                <Moon size={14} />
              </button>
            </div>
          </div>

          <button
            onClick={handleLogOut}
            className="w-full flex items-center gap-3 px-4 py-4 mt-2 text-red-400 hover:bg-red-500/10 rounded-[1.5rem] transition-all group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link 
    href={href} 
    className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-secondary transition-all group"
  >
    <div className="flex items-center gap-3  transition-colors">
      {icon}
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
    <ChevronRight size={14} className="text-zinc-700 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
  </Link>
);

export default ProfileMenu;