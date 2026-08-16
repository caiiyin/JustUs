import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { serializeLifeStageTags } from "@/lib/constants";

async function getAuthUserId(): Promise<number | null> {
  const session = await getSession();
  return session?.user?.id ? Number(session.user.id) : null;
}

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }

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
          estimatedTime: true,
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

export async function POST(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { courseId } = body as Record<string, unknown>;
  if (!courseId) {
    return NextResponse.json({ error: "courseId는 필수입니다." }, { status: 400 });
  }
  const courseIdNum = Number(courseId);
  if (!Number.isInteger(courseIdNum) || courseIdNum < 1) {
    return NextResponse.json({ error: "유효하지 않은 코스 ID입니다." }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { id: courseIdNum } });
  if (!course) {
    return NextResponse.json({ error: "코스를 찾을 수 없습니다." }, { status: 404 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_courseId: { userId, courseId: courseIdNum } },
  });
  if (existing) {
    return NextResponse.json({ error: "이미 즐겨찾기에 추가된 코스입니다." }, { status: 409 });
  }

  await prisma.favorite.create({ data: { userId, courseId: courseIdNum } });
  return NextResponse.json({ message: "즐겨찾기에 추가되었습니다." }, { status: 201 });
}

export async function DELETE(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  let courseIdNum: number | undefined;

  // body 또는 query string으로 courseId 받기
  const { searchParams } = new URL(req.url);
  const qsCourseId = searchParams.get("courseId");
  if (qsCourseId) {
    courseIdNum = Number(qsCourseId);
  } else {
    try {
      const body = (await req.json()) as Record<string, unknown>;
      courseIdNum = Number(body.courseId);
    } catch {
      // body 없는 경우 무시
    }
  }

  if (!courseIdNum || !Number.isInteger(courseIdNum) || courseIdNum < 1) {
    return NextResponse.json({ error: "courseId는 필수입니다." }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_courseId: { userId, courseId: courseIdNum } },
  });
  if (!existing) {
    return NextResponse.json({ error: "즐겨찾기가 존재하지 않습니다." }, { status: 404 });
  }

  await prisma.favorite.delete({ where: { userId_courseId: { userId, courseId: courseIdNum } } });
  return NextResponse.json({ message: "즐겨찾기가 삭제되었습니다." });
}
