"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, MapPin } from "lucide-react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/lib/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#1D4994] hover:bg-[#14356C] disabled:opacity-60 text-white font-semibold py-4 rounded-2xl transition-colors shadow-md mt-2"
    >
      {pending ? "로그인 중..." : "로그인"}
    </button>
  );
}

export default function LoginForm({
  error,
  registered,
}: {
  error?: string;
  registered?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const errorMessage =
    error === "invalid" ? "이메일 또는 비밀번호가 올바르지 않습니다." : undefined;

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 lg:bg-[#EAF2FB] lg:items-center lg:justify-center">
      <div className="w-full max-w-md lg:bg-white lg:rounded-2xl lg:shadow-xl lg:px-10 lg:py-12">
        <div className="flex flex-col items-center gap-3 mb-10 mt-6">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-md">
            <MapPin size={28} className="text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">나들이 로그인</h1>
        </div>

        {registered && (
          <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
            회원가입이 완료되었습니다. 로그인해 주세요.
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일 주소 입력"
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="비밀번호 입력"
                required
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <SubmitButton />
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            아직 계정이 없으신가요?{" "}
            <Link href="/register" className="text-emerald-600 font-semibold hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
