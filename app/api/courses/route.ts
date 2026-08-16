import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { koreanToTag, serializeLifeStageTags } from "@/lib/constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lifeStage = searchParams.get("lifeStage");
  const region = searchParams.get("region");
  const theme = searchParams.get("theme");

  // 생애주기 태그 필터 변환
  const tagFilter = lifeStage ? koreanToTag(lifeStage) : undefined;
  if (lifeStage && !tagFilter) {
    return NextResponse.json(
      { error: "유효하지 않은 lifeStage 값입니다." },
      { status: 400 }
    );
  }

  const courses = await prisma.course.findMany({
    where: {
      ...(tagFilter && { lifeCycleTags: { has: tagFilter } }),
      ...(region && { region: { contains: region } }),
      ...(theme && { theme: { contains: theme } }),
    },
    include: {
      _count: { select: { courseItems: true, reviews: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const data = courses.map((c) => {
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
      createdAt: c.createdAt,
      placeCount: c._count.courseItems,
      reviewCount: c._count.reviews,
      avgRating,
    };
  });

  return NextResponse.json({ courses: data, total: data.length });
}
