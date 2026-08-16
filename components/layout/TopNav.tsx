import Link from "next/link";
import { auth } from "@/auth";
import { logoutAction } from "@/lib/actions";
import NavLinks from "./NavLinks";

export default async function TopNav() {
  const session = await auth();

  return (
    <nav className="hidden lg:flex sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-8 h-16 items-center justify-between">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hwaseong-logo2.jpg`} alt="화성시 로고" className="h-9 w-auto object-contain" />
        <span className="font-bold text-[#1D4994] text-lg">나들이 추천 플랫폼</span>
      </div>

      <NavLinks />

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <span className="text-sm text-gray-600">{session.user?.name}님</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                로그아웃
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="text-sm bg-[#1D4994] text-white px-3 py-1.5 rounded-lg hover:bg-[#14356C] transition-colors"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
