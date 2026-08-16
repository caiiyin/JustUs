import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }
  const userId = Number(session.user.id);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { courseId, rating, content } = body as Record<string, unknown>;

  // ── 유효성 검증 ─────────────────────────────
  if (courseId === undefined || courseId === null) {
    return NextResponse.json({ error: "courseId는 필수입니다." }, { status: 400 });
  }
  if (rating === undefined || rating === null) {
    return NextResponse.json(
      { error: "rating은 1~5 정수로 입력해주세요." },
      { status: 400 }
    );
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json(
      { error: "rating은 1~5 정수로 입력해주세요." },
      { status: 400 }
    );
  }
  if (!content || typeof content !== "string" || content.trim() === "") {
    return NextResponse.json({ error: "리뷰 내용을 입력해주세요." }, { status: 400 });
  }

  const courseIdNum = Number(courseId);
  const course = await prisma.course.findUnique({ where: { id: courseIdNum } });
  if (!course) {
    return NextResponse.json({ error: "코스를 찾을 수 없습니다." }, { status: 404 });
  }

  const review = await prisma.review.create({
    data: { userId, courseId: courseIdNum, rating: ratingNum, content: content.trim() },
  });

  return NextResponse.json({ review }, { status: 201 });
}
