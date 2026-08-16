"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Heart, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/map", label: "지도", icon: Map },
  { href: "/favorites", label: "즐겨찾기", icon: Heart },
  { href: "/mypage", label: "마이페이지", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 max-w-md mx-auto lg:hidden">
      <ul className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
                  active ? "text-[#1D4994]" : "text-gray-400"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
