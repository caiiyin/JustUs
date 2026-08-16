"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function NoticeBannerClose() {
  const [closed, setClosed] = useState(false);

  if (closed) {
    return (
      <style>{`#notice-banner { display: none; }`}</style>
    );
  }

  return (
    <button
      onClick={() => setClosed(true)}
      className="text-gray-400 hover:text-white flex-shrink-0"
    >
      <X size={18} />
    </button>
  );
}
