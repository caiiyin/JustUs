import Link from "next/link";
import { Heart } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import CourseCard from "@/components/course/CourseCard";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { serializeLifeStageTags } from "@/lib/constants";
import { CourseListItem } from "@/types/shared";

async function getUserFavorites(userId: number): Promise<CourseListItem[]> {
  const favs = await prisma.favorite.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          _count: { select: { courseItems: true, reviews: true, favorites: true } },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favs.map(({ course: c }) => {
    const ratings = c.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : null;
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      region: c.region,
      theme: c.theme,
      lifeCycleTags: serializeLifeStageTags(c.lifeCycleTags) as CourseListItem["lifeCycleTags"],
      duration: c.duration,
      estimatedTime: c.estimatedTime,
      placeCount: c._count.courseItems,
      reviewCount: c._count.reviews,
      favoriteCount: c._count.favorites,
      avgRating,
    };
  });
}

export default async function FavoritesPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 lg:max-w-4xl lg:pb-8">
        <header className="bg-white px-4 pt-12 pb-4 lg:pt-6 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">즐겨찾기</h1>
        </header>
        <div className="flex flex-col items-center justify-center gap-5 mt-32 px-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart size={32} className="text-gray-300" />
          </div>
          <p className="text-base font-medium text-gray-500 text-center">
            로그인하시고 원하는 코스를 저장하세요
          </p>
          <Link
            href="/login"
            className="bg-[#1D4994] hover:bg-[#14356C] text-white font-semibold px-10 py-3 rounded-2xl transition-colors"
          >
            로그인
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const favorites = await getUserFavorites(Number(session.user.id));

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 lg:max-w-4xl lg:pb-8">
      <header className="bg-white px-4 pt-12 pb-4 lg:pt-6 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">
          즐겨찾기 <span className="text-sm font-normal text-gray-400 ml-1">{favorites.length}개</span>
        </h1>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-32 px-6">
          <Heart size={40} className="text-gray-200" />
          <p className="text-gray-400 text-sm">아직 즐겨찾기한 코스가 없습니다.</p>
          <Link href="/courses" className="text-[#1D4994] text-sm font-medium hover:underline">
            코스 둘러보기
          </Link>
        </div>
      ) : (
        <div className="px-4 py-4 grid grid-cols-1 gap-4 lg:px-8 lg:grid-cols-3">
          {favorites.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
