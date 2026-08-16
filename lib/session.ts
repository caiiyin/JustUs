import { auth } from "@/auth";

/**
 * 서버 컴포넌트 / Server Action / API Route에서 현재 세션을 가져옵니다.
 * 미인증 상태면 null을 반환합니다.
 *
 * 사용 예:
 *   const session = await getSession();
 *   if (!session) redirect("/login");
 *   console.log(session.user.id);
 */
export async function getSession() {
  return auth();
}

/**
 * 인증된 세션을 요구합니다. 미인증이면 에러를 throw합니다.
 * 보호된 Server Action이나 Route Handler에서 사용합니다.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
