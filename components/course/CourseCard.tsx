import Link from "next/link";
import { Star, Clock, MapPin } from "lucide-react";
import { CourseListItem } from "@/types/shared";
import LifecycleBadge from "@/components/ui/LifecycleBadge";

interface CourseCardProps {
  course: CourseListItem;
  compact?: boolean;
}

const THEME_COLORS: Record<string, string> = {
  자연: "from-green-400 to-emerald-600",
  문화: "from-blue-400 to-indigo-600",
  음식: "from-orange-400 to-red-500",
  체험: "from-violet-400 to-purple-600",
  휴식: "from-teal-400 to-cyan-600",
};

export default function CourseCard({ course, compact = false }: CourseCardProps) {
  const hours = Math.floor(course.estimatedTime / 60);
  const mins = course.estimatedTime % 60;
  const gradient = THEME_COLORS[course.theme] ?? "from-gray-400 to-gray-600";

  return (
    <Link href={`/courses/${course.id}`} className="block">
      <div
        className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${
          compact ? "w-52 lg:w-full" : "w-full"
        }`}
      >
        {/* 이미지 대신 테마 그라디언트 배너 */}
        <div
          className={`relative ${compact ? "h-28" : "h-36"} bg-gradient-to-br ${gradient} flex items-end p-3`}
        >
          <span className="text-white/90 text-xs font-medium bg-black/20 px-2 py-0.5 rounded-full">
            {course.theme} · {course.region}
          </span>
        </div>

        <div className="p-3">
          <div className="flex flex-wrap gap-1 mb-1.5">
            {course.lifeCycleTags.slice(0, 2).map((tag) => (
              <LifecycleBadge key={tag} tag={tag} />
            ))}
          </div>

          <h3
            className={`font-semibold text-gray-900 line-clamp-2 ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {course.title}
          </h3>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-0.5">
              <Star size={11} className="fill-amber-400 stroke-amber-400" />
              <span className="font-medium text-gray-700">
                {course.avgRating ? course.avgRating.toFixed(1) : "—"}
              </span>
              <span>({course.reviewCount})</span>
            </span>
            <span className="flex items-center gap-0.5">
              <Clock size={11} />
              {hours > 0 ? `${hours}시간` : ""}
              {mins > 0 ? ` ${mins}분` : ""}
            </span>
          </div>

          {!compact && (
            <p className="flex items-center gap-0.5 mt-1 text-xs text-gray-400">
              <MapPin size={11} />
              {course.region} · 장소 {course.placeCount}곳
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
