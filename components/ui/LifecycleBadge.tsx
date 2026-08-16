import { LifecycleTag } from "@/types/shared";

const BADGE_CONFIG: Record<LifecycleTag, string> = {
  "영유아 동반": "bg-pink-100 text-pink-700",
  "어린이 동반": "bg-violet-100 text-violet-700",
  "청소년":      "bg-blue-100 text-blue-700",
  "청년·1인":    "bg-emerald-100 text-emerald-700",
  "커플·신혼":   "bg-rose-100 text-rose-700",
  "중장년":      "bg-amber-100 text-amber-700",
  "시니어":      "bg-teal-100 text-teal-700",
  "반려동물 동반": "bg-green-100 text-green-700",
};

interface LifecycleBadgeProps {
  tag: LifecycleTag | string;
  size?: "sm" | "md";
}

export default function LifecycleBadge({ tag, size = "sm" }: LifecycleBadgeProps) {
  const className = BADGE_CONFIG[tag as LifecycleTag] ?? "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${className} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      }`}
    >
      {tag}
    </span>
  );
}
