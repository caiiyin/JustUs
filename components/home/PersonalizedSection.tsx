"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Map, MapPin, Sparkles } from "lucide-react";
import CourseCard from "@/components/course/CourseCard";
import EventTicker from "@/components/ui/EventTicker";
import type { CourseListItem, LifecycleTag } from "@/types/shared";


interface Props {
  courses: CourseListItem[];
  userName?: string | null;
}

function TwoBanners() {
  return (
    <div>
    <EventTicker />
    <div className="grid grid-cols-2 gap-3">
      {/* 지도 배너 */}
      <Link
        href="/map"
        className="flex flex-col gap-3 bg-[#1D4994] text-white rounded-2xl px-4 py-5 shadow-sm"
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <MapPin size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-snug">지도에서 코스 확인</p>
          <p className="text-xs opacity-70 mt-0.5">내 주변 나들이 코스 찾기</p>
        </div>
      </Link>

      {/* 퀴즈 배너 */}
      <Link
        href="/quiz"
        className="flex flex-col gap-3 bg-white text-[#1D4994] rounded-2xl px-4 py-5 shadow-sm border border-[#1D4994]/15"
      >
        <div className="w-10 h-10 rounded-xl bg-[#EAF2FB] flex items-center justify-center">
          <Sparkles size={20} className="text-[#1D4994]" />
        </div>
        <div>
          <p className="font-bold text-sm leading-snug">맞춤형 코스 퀴즈</p>
          <p className="text-xs text-[#1D4994]/60 mt-0.5">나에게 맞는 코스 찾기</p>
        </div>
      </Link>
    </div>
    </div>
  );
}

export default function PersonalizedSection({ courses, userName }: Props) {
  const [lifeStage, setLifeStage] = useState<string | null>(null);
  const [companionTags, setCompanionTags] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const ls = localStorage.getItem("lifeStage");
    const raw = localStorage.getItem("companionTags");
    setLifeStage(ls);
    try {
      setCompanionTags(raw ? JSON.parse(raw) : []);
    } catch {
      setCompanionTags([]);
    }
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-20" />;

  // 온보딩 미완료 → 두 개 배너
  if (!lifeStage) return <TwoBanners />;

  const allTags = [lifeStage, ...companionTags].filter(Boolean);
  const matched = courses
    .filter((c) => c.lifeCycleTags.includes(lifeStage as LifecycleTag))
    .slice(0, 3);

  const displayName = userName ? `${userName}님을 위한` : "회원님을 위한";

  return (
    <section>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="font-bold text-gray-900 text-base">{displayName} 맞춤 코스</h2>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-[#EAF2FB] text-[#1D4994] rounded-full font-medium"
              >
                # {tag}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/map"
          className="flex items-center gap-1.5 text-xs font-medium text-[#1D4994] bg-[#EAF2FB] px-3 py-2 rounded-xl hover:bg-[#1D4994] hover:text-white transition-all flex-shrink-0 mt-0.5"
        >
          <Map size={14} />
          지도에서 확인
        </Link>
      </div>

      {matched.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {matched.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 py-6 text-center">조건에 맞는 코스가 없어요.</p>
      )}
    </section>
  );
}
