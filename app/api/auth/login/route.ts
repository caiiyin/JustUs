import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth-helpers";
import { serializeLifeStageTags } from "@/lib/constants";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { email, password } = body as Record<string, string>;

  if (!email || !password) {
    return NextResponse.json({ error: "email과 password는 필수입니다." }, { status: 400 });
  }

  const INVALID_MSG = "이메일 또는 비밀번호가 올바르지 않습니다.";

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true, name: true, lifeStageTags: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: INVALID_MSG }, { status: 401 });

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return NextResponse.json({ error: INVALID_MSG }, { status: 401 });

  const koreanTags = serializeLifeStageTags(user.lifeStageTags);
  const { passwordHash: _, ...safeUser } = user;
  const token = await createSessionToken(safeUser, koreanTags);

  const responseHeaders = new Headers({ "Content-Type": "application/json" });
  setSessionCookie(responseHeaders, token);

  return new NextResponse(
    JSON.stringify({ user: { ...safeUser, lifeStageTags: koreanTags }, token }),
    { status: 200, headers: responseHeaders }
  );
}
