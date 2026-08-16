"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface FavoriteButtonProps {
  courseId: number;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}

export default function FavoriteButton({
  courseId,
  initialFavorited,
  isLoggedIn,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!isLoggedIn) {
      window.location.href = `${BASE_PATH}/login`;
      return;
    }
    setLoading(true);
    try {
      if (isFavorited) {
        await fetch(`${BASE_PATH}/api/favorites?courseId=${courseId}`, { method: "DELETE" });
        setIsFavorited(false);
      } else {
        await fetch(`${BASE_PATH}/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        setIsFavorited(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="p-1 disabled:opacity-50"
      title={isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
    >
      <Heart
        size={22}
        className={isFavorited ? "fill-red-500 stroke-red-500" : "text-gray-700"}
      />
    </button>
  );
}
