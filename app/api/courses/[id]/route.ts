import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeLifeStageTags } from "@/lib/constants";
import { getSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const courseId = Number(id);
  if (!Number.isInteger(courseId) || courseId < 1) {
    return NextResponse.json({ error: "유효하지 않은 코스 ID입니다." }, { status: 400 });
  }

  const session = await getSession();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      courseItems: {
        orderBy: { order: "asc" },
        include: { place: true },
      },
      reviews: { select: { rating: true } },
      favorites: userId ? { where: { userId } } : false,
    },
  });

  if (!course) {
    return NextResponse.json({ error: "코스를 찾을 수 없습니다." }, { status: 404 });
  }

  const ratings = course.reviews.map((r) => r.rating);
  const avgRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null;

  return NextResponse.json({
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
      region: course.region,
      theme: course.theme,
      lifeCycleTags: serializeLifeStageTags(course.lifeCycleTags),
      duration: course.duration,
      estimatedTime: course.estimatedTime,
      createdAt: course.createdAt,
      places: course.courseItems.map((ci) => ({
        order: ci.order,
        place: {
          id: ci.place.id,
          name: ci.place.name,
          address: ci.place.address,
          lat: ci.place.lat,
          lng: ci.place.lng,
          category: ci.place.category,
          phone: ci.place.phone,
          hours: ci.place.hours,
          image: ci.place.image,
          tags: ci.place.tags,
        },
      })),
      reviewCount: ratings.length,
      avgRating,
      isFavorited: userId
        ? Array.isArray(course.favorites) && course.favorites.length > 0
        : false,
    },
  });
}
