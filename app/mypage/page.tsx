import { Bell, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import LifecycleBadge from "@/components/ui/LifecycleBadge";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/actions";

const MENU_GROUPS = [
  {
    items: [
      { label: "즐겨찾기 코스", href: "/favorites" },
      { label: "내가 쓴 리뷰", href: "/mypage/reviews" },
    ],
  },
  {
    items: [
      { label: "공지사항", href: "/notices" },
      { label: "자주 묻는 질문", href: "/mypage/faq" },
      { label: "약관 및 정책", href: "/mypage/terms" },
    ],
  },
];

export default async function MyPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = session.user;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 lg:max-w-2xl lg:pb-8">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 pt-12 pb-4 lg:pt-6 bg-white">
        <h1 className="text-lg font-bold text-gray-900">마이페이지</h1>
        <button className="p-1.5 rounded-full hover:bg-gray-100 relative">
          <Bell size={22} className="text-gray-600" />
        </button>
      </header>

      {/* 프로필 */}
      <div className="bg-white px-4 pb-6 flex items-center gap-4 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600">
          {user?.name?.[0] ?? "?"}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
          <p className="text-sm text-gray-400 mb-2">{user?.email}</p>
          <div className="flex flex-wrap gap-1">
            {(user as { lifeStageTags?: string[] })?.lifeStageTags?.map((tag: string) => (
              <LifecycleBadge key={tag} tag={tag} size="md" />
            ))}
          </div>
        </div>
      </div>

      {/* 메뉴 그룹 */}
      <div className="mt-3 space-y-2">
        {MENU_GROUPS.map((group, gi) => (
          <div key={gi} className="bg-white">
            {group.items.map((item, ii) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                  ii < group.items.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <span className="text-sm text-gray-800 font-medium">{item.label}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* 로그아웃 */}
      <div className="mt-2 bg-white">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-left px-5 py-4 text-sm text-red-500 font-medium hover:bg-gray-50"
          >
            로그아웃
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
