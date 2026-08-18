import Link from "next/link";
import { User } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/lib/actions";
import NavLinks from "./NavLinks";

export default async function TopNav() {
  const session = await auth();

  return (
    <nav className="hidden lg:flex sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-8 h-16 items-center justify-between">
      {/* 좌측: 로고 + 앱명 (클릭 시 홈) */}
      <Link href="/" className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hwaseong-logo2.jpg`} alt="화성시 로고" className="h-9 w-auto object-contain" />
        <span className="font-bold text-[#1D4994] text-lg">나들이 추천 플랫폼</span>
      </Link>

      {/* 우측: 네비 + 구분선 + 로그인/마이페이지 */}
      <div className="flex items-center gap-2">
        <NavLinks />

        <div className="w-px h-5 bg-gray-200 mx-2" />

        {session ? (
          <>
            <Link
              href="/mypage"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#EAF2FB] text-[#14356C] hover:bg-[#1D4994] hover:text-white transition-all"
            >
              <User size={18} />
              마이페이지
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors px-2"
              >
                로그아웃
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[#EAF2FB] text-[#14356C] hover:bg-[#1D4994] hover:text-white transition-all"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[#1D4994] text-white hover:bg-[#14356C] transition-all"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
