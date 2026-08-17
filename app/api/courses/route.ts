import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { koreanToTag, serializeLifeStageTags } from "@/lib/constants";
import { Prisma } from "@/app/generated/prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lifeStage = searchParams.get("lifeStage");
  const region = searchParams.get("region");
  const theme = searchParams.get("theme");
  const sort = searchParams.get("sort") ?? "latest";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10") || 10));

  // 생애주기 태그 필터 변환
  const tagFilter = lifeStage ? koreanToTag(lifeStage) : undefined;
  if (lifeStage && !tagFilter) {
    return NextResponse.json(
      { error: "유효하지 않은 lifeStage 값입니다." },
      { status: 400 }
    );
  }

  if (!["popular", "latest", "rating"].includes(sort)) {
    return NextResponse.json(
      { error: "sort는 popular, latest, rating 중 하나여야 합니다." },
      { status: 400 }
    );
  }

  const where: Prisma.CourseWhereInput = {
    ...(tagFilter && { lifeCycleTags: { has: tagFilter } }),
    ...(region && { region: { contains: region } }),
    ...(theme && { theme: { contains: theme } }),
  };

  // 정렬 기준에 따라 orderBy 결정
  let orderBy: Prisma.CourseOrderByWithRelationInput | Prisma.CourseOrderByWithRelationInput[];
  if (sort === "popular") {
    orderBy = { favorites: { _count: "desc" } };
  } else if (sort === "latest") {
    orderBy = { createdAt: "desc" };
  } else {
    // rating — 평균 평점순: Prisma 집계 정렬 지원 없음, 모두 조회 후 메모리 정렬
    orderBy = { createdAt: "desc" };
  }

  const total = await prisma.course.count({ where });
  const totalPages = Math.ceil(total / limit);

  const courses = await prisma.course.findMany({
    where,
    include: {
      _count: { select: { courseItems: true, reviews: true, favorites: true } },
      reviews: { select: { rating: true } },
      courseItems: {
        take: 1,
        orderBy: { order: "asc" },
        include: { place: { select: { image: true } } },
      },
    },
    orderBy,
    ...(sort !== "rating" && { skip: (page - 1) * limit, take: limit }),
  });

  let mapped = courses.map((c) => {
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
      lifeCycleTags: serializeLifeStageTags(c.lifeCycleTags),
      duration: c.duration,
      estimatedTime: c.estimatedTime,
      createdAt: c.createdAt,
      placeCount: c._count.courseItems,
      reviewCount: c._count.reviews,
      favoriteCount: c._count.favorites,
      avgRating,
      thumbnail: c.courseItems[0]?.place.image ?? null,
    };
  });

  // rating 정렬: 메모리 정렬 후 페이징
  if (sort === "rating") {
    mapped = mapped
      .sort((a, b) => {
        const ra = a.avgRating ?? -1;
        const rb = b.avgRating ?? -1;
        return rb - ra;
      })
      .slice((page - 1) * limit, page * limit);
  }

  return NextResponse.json({ courses: mapped, total, page, totalPages });
}
