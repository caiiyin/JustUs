import { notFound } from "next/navigation";
import { MapPin, Clock, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CourseMap, { type CoursePlace } from "@/components/CourseMap";
import LifecycleBadge from "@/components/ui/LifecycleBadge";
import FavoriteButton from "@/components/course/FavoriteButton";
import { getSession } from "@/lib/session";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface PlaceDetail {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  phone: string | null;
  hours: string | null;
  image: string | null;
  lifetags: string[];
}

interface CourseDetailResponse {
  course: {
    id: number;
    title: string;
    description: string | null;
    region: string;
    theme: string;
    lifeCycleTags: string[];
    duration: string;
    estimatedTime: number;
    createdAt: string;
    places: { order: number; place: PlaceDetail }[];
    reviewCount: number;
    avgRating: number | null;
    isFavorited: boolean;
  };
}

async function getCourse(id: string): Promise<CourseDetailResponse | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/courses/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json() as Promise<CourseDetailResponse>;
}

const THEME_GRADIENTS: Record<string, string> = {
  자연: "from-green-400 to-emerald-600",
  문화: "from-blue-400 to-indigo-600",
  음식: "from-orange-400 to-red-500",
  체험: "from-violet-400 to-purple-600",
  휴식: "from-teal-400 to-cyan-600",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [data, session] = await Promise.all([getCourse(id), getSession()]);
  if (!data) notFound();

  const { course } = data;

  const mapPlaces: CoursePlace[] = course.places.map(({ order, place }) => ({
    order,
    name: place.name,
    lat: place.lat,
    lng: place.lng,
  }));

  const hours = Math.floor(course.estimatedTime / 60);
  const mins = course.estimatedTime % 60;
  const timeStr = hours > 0 ? `${hours}시간${mins > 0 ? ` ${mins}분` : ""}` : `${mins}분`;

  const sortedPlaces = course.places.slice().sort((a, b) => a.order - b.order);
  const headerImage = sortedPlaces[0]?.place.image;
  const headerImgSrc = headerImage ? `${BASE_PATH}/images/${headerImage}` : null;
  const gradient = THEME_GRADIENTS[course.theme] ?? "from-blue-400 to-indigo-600";

  return (
    <div className="min-h-screen bg-white lg:bg-gray-50">

      {/* ── 헤더 (공통) ── */}
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 sticky top-0 lg:top-16 z-40">
        <Link href="/courses" className="p-1 -ml-1 text-gray-700">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-900 truncate max-w-[60%]">
          {course.title}
        </h1>
        <FavoriteButton
          courseId={course.id}
          initialFavorited={course.isFavorited}
          isLoggedIn={!!session}
        />
      </header>

      {/* ── 대표 이미지 배너 ── */}
      <div className="relative h-52 lg:h-80 flex items-end px-5 lg:px-10 pb-5">
        {headerImgSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={headerImgSrc}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative flex flex-wrap gap-1.5">
          {course.lifeCycleTags.map((tag) => (
            <LifecycleBadge key={tag} tag={tag} size="md" />
          ))}
          <span className="px-3 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
            {course.theme}
          </span>
        </div>
      </div>

      {/* ── 본문: 모바일=단일컬럼 / PC=2컬럼 ── */}
      <div className="lg:max-w-6xl lg:mx-auto lg:px-8 lg:py-8 lg:grid lg:grid-cols-[1fr_420px] lg:gap-8 lg:items-start">

        {/* ── 왼쪽: 제목 · 설명 · 장소 목록 ── */}
        <div className="space-y-5 lg:bg-white lg:rounded-2xl lg:shadow-sm lg:p-6">

          {/* 코스 제목 + 지역 + 설명 */}
          <div className="px-4 pt-5 lg:px-0 lg:pt-0">
            <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
            <p className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <MapPin size={14} />
              {course.region}
            </p>
            {course.description && (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{course.description}</p>
            )}
          </div>

          {/* 정보 요약 — 모바일 전용 */}
          <div className="px-4 lg:hidden flex gap-4 py-4 border-y border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <Star size={16} className="fill-amber-400 stroke-amber-400" />
              <span className="font-semibold">
                {course.avgRating ? course.avgRating.toFixed(1) : "—"}
              </span>
              <span className="text-gray-400">({course.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <Clock size={16} className="text-gray-400" />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* 지도 — 모바일 전용 */}
          <section className="px-4 lg:hidden">
            <h3 className="text-base font-semibold text-gray-800 mb-3">이동 동선</h3>
            <CourseMap places={mapPlaces} />
          </section>

          {/* 장소 목록 */}
          <section className="px-4 pb-8 lg:px-0 lg:pb-0">
            <h3 className="text-base font-semibold text-gray-800 mb-3">포함 장소</h3>
            <ol className="space-y-3">
              {sortedPlaces.map(({ order, place }) => {
                const placeImgSrc = place.image ? `${BASE_PATH}/images/${place.image}` : null;
                return (
                  <li key={place.id} className="flex gap-3 bg-gray-50 rounded-2xl overflow-hidden">
                    {/* 장소 이미지 */}
                    <div className="flex-shrink-0 w-24 h-24 relative bg-gray-200">
                      {placeImgSrc ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={placeImgSrc}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                      <span className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-[#1D4994] text-white text-xs font-bold flex items-center justify-center">
                        {order}
                      </span>
                    </div>

                    {/* 장소 정보 */}
                    <div className="flex-1 min-w-0 py-3 pr-3">
                      <p className="font-semibold text-gray-900 text-sm">{place.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{place.address}</p>
                      {place.hours && (
                        <p className="text-xs text-gray-400 mt-0.5">⏰ {place.hours}</p>
                      )}
                      {place.phone && (
                        <p className="text-xs text-gray-400">📞 {place.phone}</p>
                      )}
                      {place.lifetags.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {place.lifetags.map((t) => (
                            <LifecycleBadge key={t} tag={t} size="sm" />
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        {/* ── 오른쪽 (PC 전용): 정보 요약 + 지도 ── */}
        <div className="hidden lg:flex flex-col gap-4 sticky top-[122px]">

          {/* 정보 카드 */}
          <div className="bg-white rounded-2xl shadow-sm p-5 flex gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Star size={16} className="fill-amber-400 stroke-amber-400" />
              <span className="font-semibold">
                {course.avgRating ? course.avgRating.toFixed(1) : "—"}
              </span>
              <span className="text-gray-400">({course.reviewCount})</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock size={16} className="text-gray-400" />
              <span>{timeStr}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={16} className="text-gray-400" />
              <span>장소 {course.places.length}곳</span>
            </div>
          </div>

          {/* 지도 */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-3">이동 동선</h3>
            <CourseMap places={mapPlaces} />
          </div>
        </div>
      </div>
    </div>
  );
}
