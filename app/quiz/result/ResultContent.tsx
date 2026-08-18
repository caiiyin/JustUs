"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, RefreshCw, Clock, MapPin, Star } from "lucide-react";
import type { CourseListItem } from "@/types/shared";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const THEME_GRADIENTS: [string, string][] = [
  ["자연", "from-green-400 to-emerald-600"],
  ["힐링", "from-teal-400 to-cyan-600"],
  ["역사", "from-blue-400 to-indigo-600"],
  ["문화", "from-blue-400 to-indigo-600"],
  ["감성", "from-pink-400 to-rose-500"],
  ["해양", "from-cyan-400 to-blue-500"],
  ["음식", "from-orange-400 to-red-500"],
  ["체험", "from-violet-400 to-purple-600"],
  ["미식", "from-yellow-400 to-orange-500"],
];

function getGradient(theme: string): string {
  for (const [key, val] of THEME_GRADIENTS) {
    if (theme.includes(key)) return val;
  }
  return "from-gray-400 to-gray-600";
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
}

async function fetchCourses(params: Record<string, string>): Promise<CourseListItem[]> {
  const query = new URLSearchParams({ sort: "popular", limit: "20" });
  Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
  try {
    const res = await fetch(`${BASE_PATH}/api/courses?${query.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.courses ?? []) as CourseListItem[];
  } catch {
    return [];
  }
}

export default function ResultContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const theme = searchParams.get("theme") ?? "";
  const maxTime = searchParams.get("maxTime") ?? "";
  const region = searchParams.get("region") ?? "";
  const lifeStage = searchParams.get("lifeStage") ?? "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      let results: CourseListItem[] = [];

      results = await fetchCourses({ theme, maxTime, region, lifeStage });
      if (!results.length) results = await fetchCourses({ theme, region, lifeStage });
      if (!results.length) results = await fetchCourses({ theme, lifeStage });
      if (!results.length) results = await fetchCourses({ theme });
      if (!results.length && lifeStage) results = await fetchCourses({ lifeStage });
      if (!results.length) results = await fetchCourses({});

      setCourses(results);
      setLoading(false);
    }
    load();
  }, [theme, maxTime, region, lifeStage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF4FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1D4994] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#1D4994] font-medium">추천 코스를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="min-h-screen bg-[#EAF4FF] px-4 flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-5xl">😅</p>
        <h2 className="text-lg font-bold text-[#1D4994]">조건에 맞는 코스가 아직 없어요</h2>
        <p className="text-sm text-[#1D4994]/60">다른 조건으로 찾거나 전체 코스를 확인해 보세요</p>
        <Link href="/courses" className="mt-4 px-6 py-3 bg-[#1D4994] text-white rounded-2xl font-semibold">
          전체 코스 보기
        </Link>
        <Link href="/quiz" className="text-sm text-[#1D4994]/60 hover:underline">
          퀴즈 다시 풀기
        </Link>
      </div>
    );
  }

  const course = courses[index];
  const gradient = getGradient(course.theme);

  return (
    <div className="min-h-screen bg-[#EAF4FF] px-4 py-8 lg:flex lg:items-center lg:justify-center">
      <div className="w-full max-w-md mx-auto lg:max-w-5xl lg:bg-white lg:rounded-3xl lg:shadow-xl lg:overflow-hidden">

        {/* PC: 2단 레이아웃 / 모바일: 단일 컬럼 */}
        <div className="lg:grid lg:grid-cols-2 lg:min-h-[560px]">

          {/* 왼쪽: 코스 이미지 + 태그 (PC) / 상단 (모바일) */}
          <div className={`bg-gradient-to-br ${gradient} relative flex flex-col justify-end p-6 lg:p-10`}
            style={{ minHeight: "220px" }}
          >
            {course.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${BASE_PATH}/images/${course.thumbnail}`}
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {/* 헤더 - 모바일만 */}
            <div className="relative flex items-center mb-auto lg:hidden">
              <Link href="/quiz" className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
                <ChevronLeft size={20} className="text-white" />
              </Link>
              <span className="ml-2 text-sm font-medium text-white/70">맞춤 추천 결과</span>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <span className="text-white/90 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
                {course.theme} · {course.region}
              </span>
              <h3 className="text-base lg:text-lg font-bold text-white mt-3 leading-snug">
                {course.title}
              </h3>
            </div>
          </div>

          {/* 오른쪽: 내용 + 버튼 */}
          <div className="bg-white p-6 lg:p-10 flex flex-col">
            {/* 헤더 - PC만 */}
            <div className="hidden lg:flex items-center mb-8">
              <Link href="/quiz" className="p-2 rounded-xl hover:bg-[#EAF2FB] transition-colors">
                <ChevronLeft size={22} className="text-[#1D4994]" />
              </Link>
              <span className="ml-2 text-sm font-medium text-[#1D4994]/60">맞춤 추천 결과</span>
            </div>

            <p className="text-xs text-[#1D4994]/50 mb-1">
              {courses.length}개 중 {index + 1}번째 추천
            </p>
            <h2 className="text-lg lg:text-xl font-bold text-[#1D4994] mb-4">
              딱 맞는 코스를 찾았어요!
            </h2>

            {/* 태그 */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {course.lifeCycleTags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-[#EAF2FB] text-[#1D4994] rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* 설명 */}
            {course.description && (
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{course.description}</p>
            )}

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {formatTime(course.estimatedTime)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                장소 {course.placeCount}곳
              </span>
              {course.avgRating && (
                <span className="flex items-center gap-1">
                  <Star size={13} className="fill-amber-400 stroke-amber-400" />
                  {course.avgRating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="mt-auto space-y-2">
              {/* 이 코스로 나들이 가기 */}
              <Link
                href={`/courses/${course.id}`}
                className="block w-full text-center py-4 bg-[#1D4994] text-white font-bold rounded-2xl hover:bg-[#14356C] transition-colors"
              >
                이 코스로 나들이 가기 →
              </Link>

              {/* 다른 결과 보기 */}
              {courses.length > 1 && (
                <button
                  onClick={() => setIndex((i) => (i + 1) % courses.length)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[#1D4994] font-medium text-sm hover:bg-[#EAF2FB] rounded-2xl transition-colors"
                >
                  <RefreshCw size={15} />
                  다른 결과 보기
                </button>
              )}

              <div className="text-center pt-1">
                <Link href="/quiz" className="text-xs text-[#1D4994]/40 hover:underline">
                  퀴즈 다시 풀기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
