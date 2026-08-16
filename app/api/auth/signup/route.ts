import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  setSessionCookie,
  validateEmail,
} from "@/lib/auth-helpers";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { email, password, name, lifeStage, familyType } = body as Record<string, string>;

  // ── 필수 필드 검증 ──────────────────────────
  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "email, password, name은 필수입니다." },
      { status: 400 }
    );
  }
  if (!validateEmail(email)) {
    return NextResponse.json(
      { error: "유효하지 않은 이메일 형식입니다." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "비밀번호는 최소 8자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  // ── 중복 이메일 확인 ────────────────────────
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "이미 사용 중인 이메일입니다." },
      { status: 409 }
    );
  }

  // ── 사용자 생성 ─────────────────────────────
  const password_hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password_hash,
      name,
      life_stage: lifeStage ?? null,
      family_type: familyType ?? null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      life_stage: true,
      family_type: true,
      created_at: true,
    },
  });

  // ── 세션 토큰 발급 ───────────────────────────
  const token = await createSessionToken(user);

  const responseHeaders = new Headers({ "Content-Type": "application/json" });
  setSessionCookie(responseHeaders, token);

  return new NextResponse(JSON.stringify({ user, token }), {
    status: 201,
    headers: responseHeaders,
  });
}
