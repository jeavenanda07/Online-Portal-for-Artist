"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavLinksProps {
  username: String | undefined;
  isMyAccount: Boolean;
}

const NavLinks = ({username, isMyAccount} : NavLinksProps) => {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: `/profile/${username}`, range: "-left-0" },
    { name: "Gallery", href: `/profile/${username}/gallery`, range: "left-0"  },
    { name: "Posts", href: `/profile/${username}/posts`,range: "-left-1" },
    // { name: "Favorites", href: `/profile/${username}/favorites`,range: "left-2" },
    { name: "Artworks", href: `/profile/${username}/artworks`,range: "-left-1" },
    // { name: "Appreciation", href: `/profile/${username}/appreciation`,range: "left-1" },
    { name: "About", href: `/profile/${username}/about`,range: "left-0" },
    { name: "Stats", href: `/profile/${username}/stats`,range: "left-0" },
  ];

  const visibleLinks = links.filter((item) => {
    if (!isMyAccount && item.name === "About") {
      return false; 
    }
    return true;
  });

  return (
    <ul className="flex gap-8 items-center bg-primary h-17 w-full">
      {visibleLinks.map((item) => (
        <li
          key={item.href}
          className={clsx(
            "opacity-50 text-base px-4 py-1 hover:opacity-100 transition relative",
            {
              "opacity-100": pathname === item.href,
            }
          )}
        >
          <Link href={item.href} className="">{item.name}</Link>
          <hr className={`${item.href === pathname && "border-green-500 border-2 opacity-100"} ${item.range} ${item.name == "Appreciation" && "w-28"} w-20 absolute opacity-0 -bottom-5`}/>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;