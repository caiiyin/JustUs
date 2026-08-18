import Link from "next/link";

const PAGES = [
  {
    category: "메인",
    items: [
      { href: "/", label: "홈", desc: "코스 목록 메인 화면" },
      { href: "/map", label: "지도", desc: "카카오맵 전체 코스 지도" },
      { href: "/favorites", label: "즐겨찾기", desc: "찜한 코스 목록" },
      { href: "/mypage", label: "마이페이지", desc: "내 정보 및 메뉴" },
    ],
  },
  {
    category: "코스",
    items: [
      { href: "/courses", label: "코스 목록", desc: "전체 코스 필터/검색" },
      { href: "/courses/1", label: "코스 상세 (ID: 1)", desc: "코스 정보 + 동선 지도" },
      { href: "/courses/2", label: "코스 상세 (ID: 2)", desc: "코스 정보 + 동선 지도" },
    ],
  },
  {
    category: "인증",
    items: [
      { href: "/login", label: "로그인", desc: "이메일/비밀번호 로그인" },
      { href: "/register", label: "회원가입", desc: "신규 계정 생성" },
    ],
  },
];

export default function UICheckPage() {
  return (
    <div className="min-h-screen bg-[#EAF2FB] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hwaseong-logo2.jpg" alt="로고" className="h-12 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-[#1D4994]">우리끼리</h1>
            <p className="text-sm text-[#14356C] mt-0.5">UI 페이지 목록</p>
          </div>
        </div>

        {/* 페이지 카테고리별 카드 */}
        <div className="space-y-6">
          {PAGES.map((group) => (
            <div key={group.category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#1D4994]">
                <h2 className="text-sm font-semibold text-white">{group.category}</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {group.items.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="flex items-center justify-between px-5 py-4 hover:bg-[#EAF2FB] transition-colors group"
                    >
                      <div>
                        <p className="font-semibold text-[#1D4994] text-sm group-hover:underline">
                          {page.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{page.desc}</p>
                      </div>
                      <span className="text-xs text-gray-300 font-mono">{page.href}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#14356C] mt-8 opacity-60">
          /ui-check — 개발용 페이지 목록
        </p>
      </div>
    </div>
  );
}
