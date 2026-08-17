import { notFound } from "next/navigation";
import { MapPin, Clock, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CourseMap, { type CoursePlace } from "@/components/CourseMap";
import LifecycleBadge from "@/components/ui/LifecycleBadge";
import FavoriteButton from "@/components/course/FavoriteButton";
import { getSession } from "@/lib/session";

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

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-8 lg:max-w-5xl">
      {/* 헤더 */}
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

      {/* 테마 배너 (이미지 대체) */}
      <div className="relative h-48 lg:h-72 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-end px-5 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {course.lifeCycleTags.map((tag) => (
            <LifecycleBadge key={tag} tag={tag} size="md" />
          ))}
          <span className="px-3 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
            {course.theme}
          </span>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5 lg:px-8">
        {/* 코스명 + 기본 정보 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
          <p className="flex items-center gap-1 mt-1 text-sm text-gray-500">
            <MapPin size={14} />
            {course.region}
          </p>
          {course.description && (
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{course.description}</p>
          )}
        </div>

        {/* 정보 요약 */}
        <div className="flex gap-4 py-4 border-y border-gray-100">
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

        {/* 카카오맵 */}
        <section>
          <h3 className="text-base font-semibold text-gray-800 mb-3">이동 동선</h3>
          <CourseMap places={mapPlaces} />
        </section>

        {/* 장소 목록 */}
        <section>
          <h3 className="text-base font-semibold text-gray-800 mb-3">포함 장소</h3>
          <ol className="space-y-3">
            {course.places
              .slice()
              .sort((a, b) => a.order - b.order)
              .map(({ order, place }) => (
                <li key={place.id} className="flex gap-4 bg-gray-50 rounded-2xl p-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1D4994] text-white text-sm font-bold flex items-center justify-center">
                    {order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{place.name}</p>
                    <p className="text-sm text-gray-500 truncate">{place.address}</p>
                    {place.hours && (
                      <p className="text-xs text-gray-400 mt-0.5">⏰ {place.hours}</p>
                    )}
                    {place.phone && (
                      <p className="text-xs text-gray-400">📞 {place.phone}</p>
                    )}
                    {place.lifetags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {place.lifetags.map((t) => (
                          <LifecycleBadge key={t} tag={t} size="sm" />
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
