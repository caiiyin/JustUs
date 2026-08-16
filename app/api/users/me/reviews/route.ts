import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }
  const userId = Number(session.user.id);

  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      course: { select: { id: true, title: true, region: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      content: r.content,
      createdAt: r.createdAt,
      course: r.course,
    })),
    total: reviews.length,
  });
}
