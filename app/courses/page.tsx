"use client";

import { useState, useEffect, useCallback } from "react";
import BackHeader from "@/components/layout/BackHeader";
import CourseCard from "@/components/course/CourseCard";
import BottomNav from "@/components/layout/BottomNav";
import { CourseListItem, CoursesResponse, LifecycleTag } from "@/types/shared";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const LIFECYCLE_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "전체" },
  { value: "영유아 동반", label: "영유아" },
  { value: "어린이 동반", label: "어린이" },
  { value: "청소년", label: "청소년" },
  { value: "청년·1인", label: "청년·1인" },
  { value: "커플·신혼", label: "커플·신혼" },
  { value: "중장년", label: "중장년" },
  { value: "시니어", label: "시니어" },
  { value: "반려동물 동반", label: "반려동물" },
];

const SORTS = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "rating", label: "평점순" },
];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("");
  const [activeSort, setActiveSort] = useState("latest");
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async (lifeStage: string, sort: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ sort, page: String(p), limit: "9" });
    if (lifeStage) params.set("lifeStage", lifeStage);

    try {
      const res = await fetch(`${BASE_PATH}/api/courses?${params}`);
      if (!res.ok) return;
      const data: CoursesResponse = await res.json();
      setCourses(data.courses);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(activeFilter, activeSort, 1);
  }, [activeFilter, activeSort, fetchCourses]);

  function handleFilterChange(value: string) {
    setActiveFilter(value);
  }

  function handleSortChange(value: string) {
    setActiveSort(value);
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-24 lg:max-w-7xl lg:pb-8">
      <BackHeader title="코스 목록" />

      {/* 필터 탭 */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 bg-white border-b border-gray-100 lg:flex-wrap lg:overflow-visible lg:sticky lg:top-16 lg:z-30">
        {LIFECYCLE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter.value
                ? "bg-[#1D4994] text-white"
                : "bg-[#EAF2FB] text-[#14356C]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* 정렬 + 총 개수 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-50">
        <span className="text-xs text-gray-400">총 {total}개 코스</span>
        <div className="flex gap-1">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => handleSortChange(s.value)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeSort === s.value
                  ? "text-[#1D4994] font-semibold"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 코스 목록 */}
      <div className="px-4 py-4 flex flex-col gap-4 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />
          ))
        ) : courses.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-gray-400">
            해당하는 코스가 없습니다.
          </div>
        ) : (
          courses.map((course) => <CourseCard key={course.id} course={course} />)
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-6">
          <button
            onClick={() => fetchCourses(activeFilter, activeSort, page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-30 hover:bg-gray-50"
          >
            이전
          </button>
          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => fetchCourses(activeFilter, activeSort, page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-30 hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
