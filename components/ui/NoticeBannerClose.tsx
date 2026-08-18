"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "notice_hide_until";

export default function NoticeBannerClose() {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const hideUntil = localStorage.getItem(STORAGE_KEY);
    if (hideUntil && Date.now() < Number(hideUntil)) {
      setClosed(true);
    }
  }, []);

  const hideForDay = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
    setClosed(true);
  };

  if (closed) {
    return <style>{`#notice-banner { display: none; }`}</style>;
  }

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <button
        onClick={hideForDay}
        className="text-xs text-gray-400 hover:text-white transition-colors whitespace-nowrap"
      >
        오늘 하루 안보기
      </button>
      <button
        onClick={() => setClosed(true)}
        className="text-gray-400 hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  );
}
