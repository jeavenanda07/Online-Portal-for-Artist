"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { RxDashboard } from "react-icons/rx";
import { TbReportSearch } from "react-icons/tb";
import { FaRegStar, FaRegUserCircle } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { LuClipboardList } from "react-icons/lu";
import { RiShieldUserLine } from "react-icons/ri";
import { SiMedibangpaint } from "react-icons/si";
import Image from "next/image";
import logo from "@/app/logo-dark.png";
import { notify } from "@/utils/toastHelper";
import { deleteSession } from "@/app/actions/auth";
import { supabase } from "@/lib/supabaseClient";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: <RxDashboard /> },
  {
    name: "Report Management",
    href: "/dashboard/report-management",
    icon: <TbReportSearch />,
    children: [
      { name: "Report History", href: "/dashboard/report-management/report-history", icon: <LuClipboardList /> },
      { name: "Reported Users", href: "/dashboard/report-management/reported-users", icon: <RiShieldUserLine /> },
      { name: "Reported Artwork", href: "/dashboard/report-management/reported-artwork", icon: <SiMedibangpaint /> },
    ],
  },
  { name: "Featured Artwork", href: "/dashboard/featured-artwork", icon: <FaRegStar /> },
  { name: "User Management", href: "/dashboard/users-management", icon: <FaRegUserCircle /> },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const opened = links.find((l) => l.children && pathname?.startsWith(l.href));
    setOpen(opened ? opened.name : null);
  }, [pathname]);

  const handleToggle = (name: string) => {
    setOpen((prev) => (prev === name ? null : name));
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(href);

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    await deleteSession();
    notify("Logged out successfully", "success");
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[17rem] z-20 flex flex-col
      bg-background border-r border-[#1a2e1a]">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[#1a2e1a]">
        <Image src={logo} alt="Artistry Hub" width={32} height={32} className="w-8 h-8 object-contain" />
        <span className="text-[#39ff6a] font-semibold text-[15px] tracking-wide">
          Artistry Hub
        </span>
      </div>

      {/* Nav label */}
      <p className="px-5 pt-6 pb-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#3a5c3a]">
        Navigation
      </p>

      {/* Links */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-0.5">
        {links.map((item) => {
          const dropdownOpen = open === item.name;
          const activeParent = isActive(item.href);

          return (
            <div key={item.name}>
              {item.children ? (
                <>
                  <div
                    className={clsx(
                      "flex items-center justify-between rounded-lg transition-all duration-150",
                      activeParent
                        ? "bg-[#0d1f0d] text-[#39ff6a]"
                        : "text-[#6b8f6b] hover:bg-[#0d1a0d] hover:text-[#b8dbb8]"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 flex-1 text-sm font-medium"
                    >
                      <span className={clsx("text-base", activeParent ? "text-[#39ff6a]" : "")}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                    <button
                      onClick={() => handleToggle(item.name)}
                      className={clsx(
                        "p-2 mr-1 transition-transform duration-200",
                        dropdownOpen ? "rotate-180" : ""
                      )}
                    >
                      <IoIosArrowDown className="text-xs" />
                    </button>
                  </div>

                  {dropdownOpen && (
                    <div className="ml-4 mt-0.5 mb-1 pl-3 border-l border-[#1a3a1a] flex flex-col gap-0.5">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={clsx(
                              "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-150",
                              childActive
                                ? "bg-[#0d1f0d] text-[#39ff6a]"
                                : "text-[#5a7a5a] hover:bg-[#0d1a0d] hover:text-[#b8dbb8]"
                            )}
                          >
                            <span className="text-sm">{child.icon}</span>
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    activeParent
                      ? "bg-[#0d1f0d] text-[#39ff6a]"
                      : "text-[#6b8f6b] hover:bg-[#0d1a0d] hover:text-[#b8dbb8]"
                  )}
                >
                  <span className={clsx("text-base", activeParent ? "text-[#39ff6a]" : "")}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-[#1a2e1a] pt-3">
        <button
          onClick={handleLogOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-[#5a4a4a] hover:bg-[#1f0d0d] hover:text-[#ff6b6b] transition-all duration-150"
        >
          <CgLogOut className="text-base" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Navbar;