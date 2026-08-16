import { encode } from "next-auth/jwt";
import { LifeStageTag } from "@/app/generated/prisma/client";

const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

const TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30일

export type SafeUser = {
  id: number;
  email: string;
  name: string;
  lifeStageTags: LifeStageTag[];
  createdAt: Date;
};

/** NextAuth JWT와 호환되는 세션 토큰을 발급합니다. */
export async function createSessionToken(
  user: SafeUser,
  koreanTags: string[]
): Promise<string> {
  return encode({
    token: {
      sub: String(user.id),
      id: String(user.id),
      email: user.email,
      name: user.name,
      lifeStageTags: koreanTags,
    },
    secret: process.env.AUTH_SECRET!,
    salt: SESSION_COOKIE,
    maxAge: TOKEN_MAX_AGE,
  });
}

/** Response에 NextAuth 세션 쿠키를 설정합니다. */
export function setSessionCookie(headers: Headers, token: string): void {
  const secure = process.env.NODE_ENV === "production";
  const cookieValue = [
    `${SESSION_COOKIE}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${TOKEN_MAX_AGE}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
  headers.append("Set-Cookie", cookieValue);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
