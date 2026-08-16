import { notFound } from "next/navigation";
import CourseMap, { type CoursePlace } from "@/components/CourseMap";

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
  tags: string[];
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
  const data = await getCourse(id);
  if (!data) notFound();

  const { course } = data;

  const mapPlaces: CoursePlace[] = course.places.map(({ order, place }) => ({
    order,
    name: place.name,
    lat: place.lat,
    lng: place.lng,
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* 헤더 */}
        <section>
          <div className="flex flex-wrap gap-2 mb-2">
            {course.lifeCycleTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{course.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {course.region} · {course.duration}
            {" "}({Math.floor(course.estimatedTime / 60)}시간{course.estimatedTime % 60 > 0 ? ` ${course.estimatedTime % 60}분` : ""})
          </p>
          {course.description && (
            <p className="mt-3 text-gray-700 leading-relaxed">{course.description}</p>
          )}
        </section>

        {/* 카카오맵 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">이동 동선</h2>
          <CourseMap places={mapPlaces} />
        </section>

        {/* 장소 목록 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">포함 장소</h2>
          <ol className="space-y-3">
            {course.places
              .slice()
              .sort((a, b) => a.order - b.order)
              .map(({ order, place }) => (
                <li key={place.id} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
                    {order}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{place.name}</p>
                    <p className="text-sm text-gray-500">{place.address}</p>
                    {place.hours && (
                      <p className="text-xs text-gray-400 mt-0.5">⏰ {place.hours}</p>
                    )}
                    {place.phone && (
                      <p className="text-xs text-gray-400">📞 {place.phone}</p>
                    )}
                    {place.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {place.tags.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
          </ol>
        </section>

        {/* 리뷰 요약 */}
        <section className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {course.avgRating ? course.avgRating.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-gray-400">평균 평점</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div>
            <p className="font-semibold text-gray-700">{course.reviewCount}개의 리뷰</p>
            <p className="text-sm text-gray-400">로그인 후 리뷰를 남겨보세요</p>
          </div>
        </section>
      </div>
    </main>
  );
}
