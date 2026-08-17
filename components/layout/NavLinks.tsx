"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Heart } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home, pcHidden: true },
  { href: "/map", label: "지도", icon: Map, pcHidden: false },
  { href: "/favorites", label: "즐겨찾기", icon: Heart, pcHidden: false },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-2">
      {NAV_ITEMS.map(({ href, label, icon: Icon, pcHidden }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <li key={href} className={pcHidden ? "lg:hidden" : ""}>
            <Link
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#1D4994] text-white"
                  : "bg-[#EAF2FB] text-[#14356C] hover:bg-[#1D4994] hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
