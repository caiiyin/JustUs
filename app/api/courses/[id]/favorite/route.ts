import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function getAuthUserId(): Promise<number | null> {
  const session = await getSession();
  return session?.user?.id ? Number(session.user.id) : null;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  const courseId = Number((await params).id);
  if (!Number.isInteger(courseId) || courseId < 1) {
    return NextResponse.json({ error: "유효하지 않은 코스 ID입니다." }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: "코스를 찾을 수 없습니다." }, { status: 404 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) {
    return NextResponse.json({ error: "이미 즐겨찾기에 추가된 코스입니다." }, { status: 409 });
  }

  await prisma.favorite.create({ data: { userId, courseId } });
  return NextResponse.json({ message: "즐겨찾기에 추가되었습니다." }, { status: 201 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  const courseId = Number((await params).id);
  if (!Number.isInteger(courseId) || courseId < 1) {
    return NextResponse.json({ error: "유효하지 않은 코스 ID입니다." }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!existing) {
    return NextResponse.json({ error: "즐겨찾기가 존재하지 않습니다." }, { status: 404 });
  }

  await prisma.favorite.delete({ where: { userId_courseId: { userId, courseId } } });
  return NextResponse.json({ message: "즐겨찾기가 삭제되었습니다." });
}
