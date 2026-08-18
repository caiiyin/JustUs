"use client";

import { useState } from "react";
import { Search, Bot } from "lucide-react";

const TAGS = ["영유아 동반", "커플·신혼", "청년·1인", "시니어", "반려동물 동반"];

export default function HeroSearch() {
  const [selected, setSelected] = useState<string | null>(null);

  const toggle = (tag: string) =>
    setSelected((prev) => (prev === tag ? null : tag));

  return (
    <div>
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="코스, 지역, 생애주기로 검색하세요"
          className="w-full pl-11 pr-14 py-3.5 bg-white rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm"
          readOnly
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1D4994] rounded-xl flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selected === tag
                ? "bg-[#1D4994] text-white border-[#1D4994]"
                : "bg-white text-[#1D4994] border-[#1D4994] hover:bg-[#EAF2FB]"
            }`}
          >
            # {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
