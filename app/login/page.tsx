import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; registered?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense>
      <LoginForm error={params.error} registered={params.registered} />
    </Suspense>
  );
}
