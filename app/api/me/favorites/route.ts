import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { serializeLifeStageTags } from "@/lib/constants";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }
  const userId = Number(session.user.id);

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          region: true,
          theme: true,
          lifeCycleTags: true,
          duration: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    favorites: favorites.map((f) => ({
      id: f.id,
      createdAt: f.createdAt,
      course: {
        ...f.course,
        lifeCycleTags: serializeLifeStageTags(f.course.lifeCycleTags),
      },
    })),
    total: favorites.length,
  });
}
