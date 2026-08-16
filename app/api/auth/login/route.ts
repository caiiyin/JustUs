import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { email, password } = body as Record<string, string>;

  if (!email || !password) {
    return NextResponse.json(
      { error: "email과 password는 필수입니다." },
      { status: 400 }
    );
  }

  // ── 사용자 조회 ─────────────────────────────
  const user = await prisma.user.findUnique({ where: { email } });

  // 보안: 사용자 미존재 / 비밀번호 불일치를 같은 메시지로 응답
  const INVALID_MSG = "이메일 또는 비밀번호가 올바르지 않습니다.";

  if (!user) {
    return NextResponse.json({ error: INVALID_MSG }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return NextResponse.json({ error: INVALID_MSG }, { status: 401 });
  }

  // ── 세션 토큰 발급 ───────────────────────────
  const { password_hash: _, ...safeUser } = user;
  const token = await createSessionToken(safeUser);

  const responseHeaders = new Headers({ "Content-Type": "application/json" });
  setSessionCookie(responseHeaders, token);

  return new NextResponse(JSON.stringify({ user: safeUser, token }), {
    status: 200,
    headers: responseHeaders,
  });
}
