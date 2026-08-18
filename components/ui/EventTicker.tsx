"use client";

import { useEffect, useState } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface TickerEvent {
  name: string;
  emoji: string;
  startDate: string;
  dateLabel: string;
  location: string;
}

const ALL_EVENTS: TickerEvent[] = [
  { name: "화성 효 마라톤 대회",             emoji: "🏃", startDate: "2026-05-05", dateLabel: "5월 5일",       location: "화성종합경기타운" },
  { name: "화성시 연등 음악축제",             emoji: "🏮", startDate: "2026-05-16", dateLabel: "5월 16일",      location: "정조효공원·용주사" },
  { name: "화성 뱃놀이 축제",                emoji: "⛵", startDate: "2026-05-22", dateLabel: "5월 22~25일",   location: "전곡항·제부도·궁평항" },
  { name: "화성송산포도축제",                 emoji: "🍇", startDate: "2026-09-05", dateLabel: "9월 5~6일",    location: "궁평항" },
  { name: "화성클래식음악제 in 남양성모성지", emoji: "🎻", startDate: "2026-09-11", dateLabel: "9월 11~13일",  location: "남양성모성지 대성당" },
  { name: "정조효문화제·정조대왕능행차",      emoji: "👑", startDate: "2026-10-03", dateLabel: "10월 3~4일",   location: "정조효공원·융건릉" },
  { name: "화성 학생동아리축제",              emoji: "🎭", startDate: "2026-10-24", dateLabel: "10월 24일",    location: "동탄센트럴파크" },
  { name: "화성시 평생학습축제",              emoji: "📚", startDate: "2026-10-30", dateLabel: "10월 30~31일", location: "화성시민대학" },
  { name: "화성 루나빛축제",                  emoji: "🌕", startDate: "2026-10-31", dateLabel: "10월 31일",    location: "동탄호수공원" },
  { name: "서해안 황금해안길 개통식",         emoji: "🌊", startDate: "2026-10-31", dateLabel: "10월 말 예정", location: "백미항 일원" },
];

const EVENT_URL = "https://tour.hscity.go.kr/NEW/6festival/festival5.jsp";

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUpcomingEvents(): TickerEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = ALL_EVENTS.filter((e) => new Date(e.startDate) >= today);
  return upcoming.length > 0 ? upcoming : ALL_EVENTS;
}

export default function EventTicker() {
  const events = getUpcomingEvents();
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (events.length <= 1) return;
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % events.length);
        setAnimate(false);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [events.length]);

  const current = events[index];
  const days = daysUntil(current.startDate);

  return (
    <div className="relative flex items-center mb-3 rounded-full overflow-visible" style={{ height: "48px" }}>
      {/* 라벨 */}
      <div className="flex items-center justify-center bg-[#2a9d8f] text-white px-5 self-stretch rounded-l-full flex-shrink-0 z-10">
        <span className="text-sm font-bold whitespace-nowrap">화성시 행사</span>
      </div>

      {/* 텍스트 영역 */}
      <div
        className="flex flex-1 items-center gap-2 bg-[#e0f5f2] self-stretch overflow-hidden min-w-0 rounded-r-full pr-14"
      >
        <div
          className="flex-1 overflow-hidden px-4"
          style={{
            transition: "opacity 0.3s, transform 0.3s",
            opacity: animate ? 0 : 1,
            transform: animate ? "translateY(-6px)" : "translateY(0)",
          }}
        >
          <a
            href={EVENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-700 truncate block hover:text-[#2a9d8f] hover:underline"
          >
            {current.emoji} {current.name}
            <span className="text-gray-400 text-xs ml-2">{current.dateLabel} · {current.location}</span>
          </a>
        </div>

        {/* D-day 배지 */}
        {days > 0 && (
          <span className="text-[10px] font-bold bg-[#2a9d8f] text-white px-2 py-0.5 rounded-full flex-shrink-0 mr-2">
            D-{days}
          </span>
        )}
        {days === 0 && (
          <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full flex-shrink-0 mr-2">
            오늘
          </span>
        )}
      </div>

      {/* 오른쪽 캐릭터 이미지 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE_PATH}/images/icon.png`}
        alt=""
        className="absolute right-1 object-contain pointer-events-none"
        style={{ height: "60px", bottom: "-6px" }}
      />
    </div>
  );
}
