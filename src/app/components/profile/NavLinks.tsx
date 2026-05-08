"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavLinksProps {
  username: String | undefined;
  isMyAccount: Boolean;
}

const NavLinks = ({ username, isMyAccount }: NavLinksProps) => {
  const pathname = usePathname();

  const links = [
    { name: "Home",     href: `/profile/${username}` },
    { name: "Gallery",  href: `/profile/${username}/gallery` },
    { name: "Posts",    href: `/profile/${username}/posts` },
    { name: "Artworks", href: `/profile/${username}/artworks` },
    { name: "About",    href: `/profile/${username}/about` },
  ];

  const visibleLinks = links.filter((item) => {
    if (!isMyAccount && item.name === "About") return false;
    return true;
  });

  return (
    <nav className="w-full overflow-x-auto scrollbar-none -mb-px">
      <ul className="flex items-center min-w-max gap-1">
        {visibleLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  "relative flex items-center px-3 sm:px-4 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "text-[#00d26a]"
                    : "text-zinc-500 hover:text-white"
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#00d26a]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavLinks;