"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const LIFECYCLE_OPTIONS = [
  { value: "영유아 동반", label: "영유아 동반", emoji: "🍼", desc: "영유아 자녀 동반 가족" },
  { value: "어린이 동반", label: "어린이 동반", emoji: "🎠", desc: "초등학생 자녀 동반" },
  { value: "청소년", label: "청소년", emoji: "🎒", desc: "중·고등학생" },
  { value: "청년·1인", label: "청년·1인", emoji: "✨", desc: "2030 청년, 혼자 떠나는 여행" },
  { value: "커플·신혼", label: "커플·신혼", emoji: "💑", desc: "연인·신혼부부" },
  { value: "중장년", label: "중장년", emoji: "👨‍👩‍👧‍👦", desc: "4050 부부·가족" },
  { value: "시니어", label: "시니어", emoji: "🌿", desc: "60대 이상 어르신" },
  { value: "반려동물 동반", label: "반려동물 동반", emoji: "🐾", desc: "반려동물과 함께" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [lifecycle, setLifecycle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!lifecycle) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_PATH}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "회원가입에 실패했습니다.");
        return;
      }

      localStorage.setItem("lifeStage", lifecycle);
      router.push("/login?registered=1");
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 lg:bg-[#EAF2FB] lg:items-center lg:justify-center">
      <div className="w-full max-w-md lg:bg-white lg:rounded-2xl lg:shadow-xl lg:px-10 lg:py-12">
        <div className="flex flex-col items-center gap-3 mb-8 mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE_PATH}/logo_round.png`} alt="로고" className="w-24 h-24 object-contain" />
          <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름 입력"
                required
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상 입력"
                  minLength={8}
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

            <button
              type="submit"
              className="w-full bg-[#1D4994] hover:bg-[#14356C] text-white font-semibold py-4 rounded-2xl transition-colors shadow-md mt-2"
            >
              다음
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-4">생애주기를 선택해주세요</p>
            <div className="space-y-2.5">
              {LIFECYCLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLifecycle(opt.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                    lifecycle === opt.value
                      ? "border-[#1D4994] bg-[#EAF2FB]"
                      : "border-gray-100 bg-gray-50 hover:border-[#1D4994]"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                  {lifecycle === opt.value && (
                    <div className="w-5 h-5 rounded-full bg-[#1D4994] flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!lifecycle || loading}
              className={`w-full mt-6 py-4 rounded-2xl font-semibold transition-all ${
                lifecycle && !loading
                  ? "bg-[#1D4994] text-white shadow-md hover:bg-[#14356C]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "가입 중..." : "가입 완료"}
            </button>
          </div>
        )}

        {step === 1 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
              로그인
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
