import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, validateEmail } from "@/lib/auth-helpers";
import { parseLifeStageTags, serializeLifeStageTags } from "@/lib/constants";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { email, password, name, lifeStageTags } = body as Record<string, unknown>;

  // ── 필수 필드 검증 ──────────────────────────
  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "email, password, name은 필수입니다." },
      { status: 400 }
    );
  }
  if (typeof email !== "string" || !validateEmail(email)) {
    return NextResponse.json({ error: "유효하지 않은 이메일 형식입니다." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "비밀번호는 최소 8자 이상이어야 합니다." },
      { status: 400 }
    );
  }
  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
  }

  // ── 생애주기 태그 검증 ───────────────────────
  const tagsInput = Array.isArray(lifeStageTags) ? (lifeStageTags as string[]) : [];
  const parsedTags = parseLifeStageTags(tagsInput);
  if (parsedTags === null) {
    return NextResponse.json(
      {
        error:
          "lifeStageTags에 유효하지 않은 값이 포함되어 있습니다. " +
          "허용값: 영유아 동반, 어린이 동반, 청소년, 청년·1인, 커플·신혼, 중장년, 시니어, 반려동물 동반",
      },
      { status: 400 }
    );
  }

  // ── 중복 이메일 확인 ────────────────────────
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 });
  }

  // ── 사용자 생성 ─────────────────────────────
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name.trim(), lifeStageTags: parsedTags },
    select: { id: true, email: true, name: true, lifeStageTags: true, createdAt: true },
  });

  const koreanTags = serializeLifeStageTags(user.lifeStageTags);
  const token = await createSessionToken(user, koreanTags);

  const responseHeaders = new Headers({ "Content-Type": "application/json" });
  setSessionCookie(responseHeaders, token);

  return new NextResponse(
    JSON.stringify({ user: { ...user, lifeStageTags: koreanTags }, token }),
    { status: 201, headers: responseHeaders }
  );
}
