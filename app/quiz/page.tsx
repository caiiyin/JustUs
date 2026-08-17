"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    id: "theme",
    question: "오늘은 어떤 분위기를 원하세요?",
    options: [
      { label: "자연·힐링", value: "자연", emoji: "🌿" },
      { label: "역사·문화", value: "역사", emoji: "🏛️" },
      { label: "감성·예술", value: "감성", emoji: "🎨" },
      { label: "해양·체험", value: "해양", emoji: "🌊" },
    ],
    pcCols: "lg:grid-cols-4",
  },
  {
    id: "time",
    question: "이동 가능한 시간은 얼마나 되나요?",
    options: [
      { label: "2시간 이내", value: "120", emoji: "⚡" },
      { label: "반나절 (4시간)", value: "240", emoji: "🌤️" },
      { label: "하루 종일", value: "480", emoji: "🌞" },
    ],
    pcCols: "lg:grid-cols-3",
  },
  {
    id: "region",
    question: "선호하는 지역이 있나요?",
    options: [
      { label: "동탄 일대", value: "동탄", emoji: "🏙️" },
      { label: "남양·향남", value: "향남", emoji: "🌾" },
      { label: "서신·제부도", value: "서신", emoji: "🏖️" },
      { label: "상관없음", value: "", emoji: "📍" },
    ],
    pcCols: "lg:grid-cols-4",
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const handleSelect = (value: string) => {
    setSelected(value);
    if (!isLast) {
      setTimeout(() => {
        setAnswers((prev) => ({ ...prev, [current.id]: value }));
        setSelected(null);
        setStep((s) => s + 1);
      }, 350);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    setSelected(answers[STEPS[step - 1].id] ?? null);
  };

  const handleResult = () => {
    if (selected === null) return;
    const finalAnswers = { ...answers, [current.id]: selected };
    setLoading(true);

    const lifeStage =
      typeof window !== "undefined" ? (localStorage.getItem("lifeStage") ?? "") : "";

    const params = new URLSearchParams({
      theme: finalAnswers.theme ?? "",
      maxTime: finalAnswers.time ?? "",
      region: finalAnswers.region ?? "",
      lifeStage,
    });

    setTimeout(() => {
      router.push(`/quiz/result?${params.toString()}`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF4FF] flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="text-[#1D4994] animate-spin" />
        <p className="text-[#1D4994] font-bold text-lg">코스를 찾고 있어요...</p>
        <p className="text-[#1D4994]/60 text-sm">잠시만 기다려 주세요</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF4FF] px-4 py-8 lg:flex lg:items-center lg:justify-center">
      <div className="w-full max-w-md mx-auto lg:max-w-3xl lg:bg-white lg:rounded-3xl lg:shadow-xl lg:px-16 lg:py-14">

        {/* 상단 네비 */}
        <div className="flex items-center mb-8">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="p-2 rounded-xl hover:bg-[#EAF2FB] transition-colors"
            >
              <ChevronLeft size={22} className="text-[#1D4994]" />
            </button>
          ) : (
            <Link href="/" className="p-2 rounded-xl hover:bg-[#EAF2FB] transition-colors">
              <ChevronLeft size={22} className="text-[#1D4994]" />
            </Link>
          )}
          <span className="ml-2 text-sm font-medium text-[#1D4994]/60">맞춤 코스 퀴즈</span>
        </div>

        {/* 진행 바 */}
        <div className="mb-10">
          <div className="flex justify-between text-xs text-[#1D4994]/60 mb-2">
            <span>{step + 1} / {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-[#EAF2FB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1D4994] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 */}
        <h2 className="text-xl lg:text-2xl font-bold text-[#1D4994] mb-8 leading-snug">
          {current.question}
        </h2>

        {/* 선택지 */}
        <div className={`grid grid-cols-2 ${current.pcCols} gap-3 mb-10`}>
          {current.options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value + opt.label}
                onClick={() => handleSelect(opt.value)}
                className={`flex flex-col items-center justify-center gap-3 py-7 lg:py-10 rounded-2xl border-2 transition-all text-sm font-medium ${
                  isSelected
                    ? "bg-[#1D4994] text-white border-[#1D4994] scale-[0.97]"
                    : "bg-[#F8FBFF] text-[#1D4994] border-[#1D4994]/15 hover:border-[#1D4994] hover:bg-[#EAF2FB]"
                }`}
              >
                <span className="text-3xl lg:text-4xl">{opt.emoji}</span>
                <span className="lg:text-base">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* 마지막 단계 결과 보기 버튼 */}
        {isLast && (
          <button
            onClick={handleResult}
            disabled={selected === null}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
              selected !== null
                ? "bg-[#1D4994] text-white hover:bg-[#14356C] shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            결과 보기 ✨
          </button>
        )}
      </div>
    </div>
  );
}
