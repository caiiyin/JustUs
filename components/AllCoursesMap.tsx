"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface MapCourse {
  id: number;
  title: string;
  theme: string;
  region: string;
  lifeCycleTags: string[];
  places: { id: number; name: string; lat: number; lng: number; address: string }[];
}

interface Props {
  courses: MapCourse[];
}

const THEME_COLORS: Record<string, string> = {
  자연: "#22c55e",
  문화: "#3b82f6",
  음식: "#f97316",
  체험: "#a855f7",
  휴식: "#14b8a6",
};

function themeColor(theme: string) {
  return THEME_COLORS[theme] ?? "#6b7280";
}

function makeSvgMarker(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0 C6.268 0 0 6.268 0 14 C0 24.5 14 36 14 36 C14 36 28 24.5 28 14 C28 6.268 21.732 0 14 0Z"
      fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
  </svg>`;
}

export default function AllCoursesMap({ courses }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<MapCourse | null>(null);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
    if (!appKey) return;

    if (window.kakao?.maps) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    window.kakao.maps.load(() => {
      const container = containerRef.current!;
      const center = new window.kakao.maps.LatLng(37.1994, 126.8319);
      const map = new window.kakao.maps.Map(container, { center, level: 9 });

      let openInfoWindow: KakaoInfoWindow | null = null;

      courses.forEach((course) => {
        const color = themeColor(course.theme);
        const svg = makeSvgMarker(color);
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        course.places.forEach((place) => {
          const latlng = new window.kakao.maps.LatLng(place.lat, place.lng);
          const markerImage = new window.kakao.maps.MarkerImage(
            url,
            new window.kakao.maps.Size(28, 36),
            { offset: new window.kakao.maps.Point(14, 36) }
          );
          const marker = new window.kakao.maps.Marker({ position: latlng, image: markerImage });
          marker.setMap(map);

          const infoWindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:8px 12px;min-width:160px;">
              <p style="font-size:13px;font-weight:700;margin:0 0 2px;">${place.name}</p>
              <p style="font-size:11px;color:#6b7280;margin:0 0 6px;">${place.address}</p>
              <a href="/courses/${course.id}" style="font-size:12px;color:#1D4994;font-weight:600;">${course.title} →</a>
            </div>`,
            removable: true,
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            if (openInfoWindow) openInfoWindow.close();
            infoWindow.open(map, marker);
            openInfoWindow = infoWindow;
            setSelectedCourse(course);
          });
        });
      });
    });
  }, [loaded, courses]);

  return (
    <div className="relative w-full" style={{ height: "100%" }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">지도 불러오는 중...</span>
          </div>
        </div>
      )}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* 범례 */}
      <div className="absolute top-3 right-3 bg-white rounded-xl shadow-md px-3 py-2.5 z-10 text-xs space-y-1">
        {Object.entries(THEME_COLORS).map(([theme, color]) => (
          <div key={theme} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-gray-700">{theme}</span>
          </div>
        ))}
      </div>

      {/* 선택된 코스 미니 카드 (모바일) */}
      {selectedCourse && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-4 z-10 lg:hidden">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-sm text-gray-900">{selectedCourse.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{selectedCourse.region} · {selectedCourse.theme}</p>
            </div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-gray-400 text-lg leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>
          <Link
            href={`/courses/${selectedCourse.id}`}
            className="mt-3 block text-center text-sm font-semibold text-white bg-[#1D4994] py-2 rounded-xl"
          >
            코스 상세 보기
          </Link>
        </div>
      )}
    </div>
  );
}
