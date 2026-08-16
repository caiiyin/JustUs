import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/**
 * GET /api/auth/me
 * 현재 세션 사용자 정보를 반환합니다.
 * 세션 쿠키(authjs.session-token) 또는
 * Authorization: Bearer <token> 헤더를 통해 인증합니다.
 */
export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json(
      { error: "인증되지 않은 요청입니다." },
      { status: 401 }
    );
  }

  return NextResponse.json({ user: session.user });
}
