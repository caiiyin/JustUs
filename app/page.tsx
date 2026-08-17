import Link from "next/link";
import { Map, ChevronRight, Bell } from "lucide-react";
import CourseCard from "@/components/course/CourseCard";
import NoticeBannerClose from "@/components/ui/NoticeBannerClose";
import { prisma } from "@/lib/prisma";
import { serializeLifeStageTags } from "@/lib/constants";
import { CourseListItem } from "@/types/shared";

function mapCourse(c: {
  id: number; title: string; description: string | null; region: string; theme: string;
  duration: string; estimatedTime: number;
  lifeCycleTags: Parameters<typeof serializeLifeStageTags>[0];
  _count: { courseItems: number; reviews: number; favorites: number };
  reviews: { rating: number }[];
  courseItems: { place: { image: string | null } }[];
}): CourseListItem {
  const ratings = c.reviews.map((r) => r.rating);
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : null;
  return {
    id: c.id, title: c.title, description: c.description,
    region: c.region, theme: c.theme,
    lifeCycleTags: serializeLifeStageTags(c.lifeCycleTags) as CourseListItem["lifeCycleTags"],
    duration: c.duration, estimatedTime: c.estimatedTime,
    placeCount: c._count.courseItems, reviewCount: c._count.reviews,
    favoriteCount: c._count.favorites, avgRating,
    thumbnail: c.courseItems[0]?.place.image ?? null,
  };
}

const INCLUDE = {
  _count: { select: { courseItems: true, reviews: true, favorites: true } },
  reviews: { select: { rating: true } },
  courseItems: {
    take: 1,
    orderBy: { order: "asc" as const },
    include: { place: { select: { image: true } } },
  },
} as const;

async function getHomeData(): Promise<{ popular: CourseListItem[]; latest: CourseListItem[] }> {
  const [popular, latest] = await Promise.all([
    prisma.course.findMany({ include: INCLUDE, orderBy: { favorites: { _count: "desc" } }, take: 8 }),
    prisma.course.findMany({ include: INCLUDE, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  return { popular: popular.map(mapCourse), latest: latest.map(mapCourse) };
}

export default async function HomePage() {
  const { popular: popularCourses, latest: latestCourses } = await getHomeData();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 lg:max-w-7xl lg:pb-8">
      {/* 모바일 상단 헤더 */}
      <header className="bg-white px-4 pt-12 pb-4 lg:hidden sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hwaseong-logo2.jpg`} alt="화성시 로고" className="w-24 mb-1" />
            <h1 className="text-xl font-bold text-gray-900">
              나들이 <span className="text-[#1D4994]">추천 플랫폼</span>
            </h1>
          </div>
          <Link href="/mypage" className="p-1.5 rounded-full hover:bg-gray-100">
            <Bell size={22} className="text-gray-600" />
          </Link>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6 lg:px-8 lg:py-8">
        {/* 지도 배너 */}
        <Link
          href="/map"
          className="flex items-center justify-between bg-[#1D4994] text-white rounded-2xl px-5 py-4 shadow-md"
        >
          <div className="flex items-center gap-3">
            <Map size={28} />
            <div>
              <p className="font-bold text-base">지도에서 코스 확인</p>
              <p className="text-xs opacity-80">내 주변 나들이 코스 찾기</p>
            </div>
          </div>
          <ChevronRight size={22} className="opacity-80" />
        </Link>

        {/* 인기 코스 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">최근 인기 코스</h2>
            <Link href="/courses" className="text-xs text-emerald-600 font-medium">
              전체보기
            </Link>
          </div>

          {popularCourses.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
              {popularCourses.map((course) => (
                <CourseCard key={course.id} course={course} compact />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">코스를 불러오는 중...</p>
          )}
        </section>

        {/* 최신 코스 섹션 */}
        <section>
          <h2 className="font-bold text-gray-900 text-base mb-3">이런 코스 어때요?</h2>
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3">
            {latestCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>

      {/* 하단 공지 배너 */}
      <div
        className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 z-30"
        id="notice-banner"
      >
        <div className="flex items-center justify-between bg-gray-800 text-white rounded-xl px-4 py-3 shadow-lg">
          <a
            href="https://tour.hscity.go.kr/NEW/6festival/festival5.jsp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex-1 pr-2 hover:underline"
          >
            🎡 <span className="font-medium">2026 화성시 주요 축제·행사 일정</span>
          </a>
          <NoticeBannerClose />
        </div>
      </div>
    </div>
  );
}
