"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Heart } from "lucide-react";

interface BackHeaderProps {
  title?: string;
  showShare?: boolean;
  showFavorite?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

export default function BackHeader({
  title,
  showShare = false,
  showFavorite = false,
  isFavorited = false,
  onFavoriteToggle,
}: BackHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 sticky top-0 lg:top-16 z-40">
      <button onClick={() => router.back()} className="p-1 -ml-1 text-gray-700">
        <ArrowLeft size={24} />
      </button>

      {title && (
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-900 truncate max-w-[60%]">
          {title}
        </h1>
      )}

      <div className="flex items-center gap-2">
        {showShare && (
          <button className="p-1 text-gray-700">
            <Share2 size={22} />
          </button>
        )}
        {showFavorite && (
          <button onClick={onFavoriteToggle} className="p-1">
            <Heart
              size={22}
              className={isFavorited ? "fill-red-500 stroke-red-500" : "text-gray-700"}
            />
          </button>
        )}
      </div>
    </header>
  );
}
