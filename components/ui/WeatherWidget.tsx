"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  current: { temperature_2m: number; weathercode: number };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

function wmoToEmoji(code: number): { emoji: string; label: string } {
  if (code === 0)                       return { emoji: "☀️", label: "맑음" };
  if (code === 1)                       return { emoji: "🌤️", label: "대체로 맑음" };
  if (code === 2)                       return { emoji: "⛅", label: "구름 조금" };
  if (code === 3)                       return { emoji: "☁️", label: "흐림" };
  if (code === 45 || code === 48)       return { emoji: "🌫️", label: "안개" };
  if (code >= 51 && code <= 55)         return { emoji: "🌦️", label: "이슬비" };
  if (code >= 61 && code <= 65)         return { emoji: "🌧️", label: "비" };
  if (code >= 71 && code <= 77)         return { emoji: "❄️", label: "눈" };
  if (code >= 80 && code <= 82)         return { emoji: "🌧️", label: "소나기" };
  if (code === 95)                      return { emoji: "⛈️", label: "천둥번개" };
  return { emoji: "🌡️", label: "날씨 정보" };
}

function dayLabel(dateStr: string, idx: number): string {
  if (idx === 1) return "내일";
  if (idx === 2) return "모레";
  const d = new Date(dateStr);
  return ["일", "월", "화", "수", "목", "금", "토"][d.getDay()] + "요일";
}

export default function WeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=37.1995&longitude=126.8317" +
      "&current=temperature_2m,weathercode" +
      "&daily=weathercode,temperature_2m_max,temperature_2m_min" +
      "&timezone=Asia/Seoul&forecast_days=4"
    )
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return null;

  const cur = wmoToEmoji(data.current.weathercode);
  const forecast = data.daily.time.slice(1, 4).map((t, i) => {
    const w = wmoToEmoji(data.daily.weathercode[i + 1]);
    return {
      day: dayLabel(t, i + 1),
      emoji: w.emoji,
      max: Math.round(data.daily.temperature_2m_max[i + 1]),
      min: Math.round(data.daily.temperature_2m_min[i + 1]),
    };
  });

  return (
    <div className="hidden lg:flex flex-col fixed left-6 top-1/2 -translate-y-1/2 z-30 w-36 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 현재 날씨 */}
      <div className="bg-[#1D4994] px-4 py-3 text-white text-center">
        <p className="text-[10px] font-medium opacity-70 mb-1">화성시 날씨</p>
        <div className="text-3xl mb-1">{cur.emoji}</div>
        <p className="text-2xl font-bold">{Math.round(data.current.temperature_2m)}°</p>
        <p className="text-[10px] opacity-80 mt-0.5">{cur.label}</p>
      </div>

      {/* 3일 예보 */}
      <div className="divide-y divide-gray-100">
        {forecast.map((f, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2">
            <span className="text-[10px] text-gray-500 w-10">{f.day}</span>
            <span className="text-sm">{f.emoji}</span>
            <span className="text-[10px] text-gray-400">{f.min}°</span>
            <span className="text-[10px] font-semibold text-gray-700">{f.max}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
