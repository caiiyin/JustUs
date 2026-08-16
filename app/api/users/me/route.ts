import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseLifeStageTags, serializeLifeStageTags } from "@/lib/constants";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: { id: true, email: true, name: true, lifeStageTags: true, createdAt: true },
  });
  if (!user) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({
    user: { ...user, lifeStageTags: serializeLifeStageTags(user.lifeStageTags) },
  });
}

export async function PATCH(req: Request) {
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

  const { name, lifeStageTags } = body as Record<string, unknown>;

  // ── 유효성 검증 ─────────────────────────────
  const updateData: { name?: string; lifeStageTags?: ReturnType<typeof parseLifeStageTags> } = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
    }
    updateData.name = name.trim();
  }

  if (lifeStageTags !== undefined) {
    if (!Array.isArray(lifeStageTags)) {
      return NextResponse.json({ error: "lifeStageTags는 배열이어야 합니다." }, { status: 400 });
    }
    const parsed = parseLifeStageTags(lifeStageTags as string[]);
    if (parsed === null) {
      return NextResponse.json(
        { error: "lifeStageTags에 유효하지 않은 값이 포함되어 있습니다." },
        { status: 400 }
      );
    }
    updateData.lifeStageTags = parsed;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "변경할 필드가 없습니다." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData as Parameters<typeof prisma.user.update>[0]["data"],
    select: { id: true, email: true, name: true, lifeStageTags: true, createdAt: true },
  });

  return NextResponse.json({
    user: { ...updated, lifeStageTags: serializeLifeStageTags(updated.lifeStageTags) },
  });
}
