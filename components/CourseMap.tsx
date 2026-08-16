"use client";

import { useEffect, useRef, useState } from "react";

export interface CoursePlace {
  order: number;
  name: string;
  lat: number;
  lng: number;
}

interface CourseMapProps {
  places: CoursePlace[];
}

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        LatLngBounds: new () => KakaoLatLngBounds;
        Marker: new (options: { position: KakaoLatLng; image?: KakaoMarkerImage }) => KakaoMarker;
        MarkerImage: new (src: string, size: KakaoSize, options?: { offset?: KakaoPoint }) => KakaoMarkerImage;
        Size: new (width: number, height: number) => KakaoSize;
        Point: new (x: number, y: number) => KakaoPoint;
        Polyline: new (options: {
          path: KakaoLatLng[];
          strokeWeight: number;
          strokeColor: string;
          strokeOpacity: number;
          strokeStyle: string;
        }) => KakaoPolyline;
        InfoWindow: new (options: { content: string; removable?: boolean }) => KakaoInfoWindow;
        event: {
          addListener: (target: KakaoMarker, type: string, handler: () => void) => void;
        };
      };
    };
  }
  interface KakaoLatLng {
    getLat(): number;
    getLng(): number;
  }
  interface KakaoLatLngBounds {
    extend(latlng: KakaoLatLng): void;
  }
  interface KakaoMap {
    setBounds(bounds: KakaoLatLngBounds): void;
  }
  interface KakaoMarker {
    setMap(map: KakaoMap | null): void;
  }
  interface KakaoMarkerImage {}
  interface KakaoSize {}
  interface KakaoPoint {}
  interface KakaoPolyline {
    setMap(map: KakaoMap | null): void;
  }
  interface KakaoInfoWindow {
    open(map: KakaoMap, marker: KakaoMarker): void;
    close(): void;
  }
}

export default function CourseMap({ places }: CourseMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
    if (!appKey) {
      setError("NEXT_PUBLIC_KAKAO_MAP_APP_KEY가 설정되지 않았습니다.");
      return;
    }
    if (places.length === 0) return;

    // 이미 스크립트가 로드된 경우
    if (window.kakao?.maps) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError("카카오맵 스크립트 로드에 실패했습니다.");
    document.head.appendChild(script);

    return () => {
      // 스크립트는 한 번만 로드하므로 정리하지 않음
    };
  }, [places.length]);

  useEffect(() => {
    if (!loaded || !containerRef.current || places.length === 0) return;

    window.kakao.maps.load(() => {
      const container = containerRef.current!;
      const center = new window.kakao.maps.LatLng(places[0].lat, places[0].lng);
      const map = new window.kakao.maps.Map(container, { center, level: 7 });

      const bounds = new window.kakao.maps.LatLngBounds();
      const polylinePath: KakaoLatLng[] = [];
      let openInfoWindow: KakaoInfoWindow | null = null;

      const sorted = [...places].sort((a, b) => a.order - b.order);

      sorted.forEach((place) => {
        const latlng = new window.kakao.maps.LatLng(place.lat, place.lng);
        bounds.extend(latlng);
        polylinePath.push(latlng);

        // 순번 마커 이미지 (SVG 인라인)
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
            <ellipse cx="16" cy="37" rx="6" ry="3" fill="rgba(0,0,0,0.2)"/>
            <path d="M16 0 C7.163 0 0 7.163 0 16 C0 28 16 40 16 40 C16 40 32 28 32 16 C32 7.163 24.837 0 16 0Z"
              fill="#4F86F7" stroke="#2563EB" stroke-width="1.5"/>
            <text x="16" y="20" text-anchor="middle" dominant-baseline="middle"
              font-family="sans-serif" font-size="14" font-weight="bold" fill="white">${place.order}</text>
          </svg>`;
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        const markerImage = new window.kakao.maps.MarkerImage(
          url,
          new window.kakao.maps.Size(32, 40),
          { offset: new window.kakao.maps.Point(16, 40) }
        );
        const marker = new window.kakao.maps.Marker({ position: latlng, image: markerImage });
        marker.setMap(map);

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:6px 10px;font-size:13px;font-weight:600;white-space:nowrap;">${place.order}. ${place.name}</div>`,
          removable: true,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          if (openInfoWindow) openInfoWindow.close();
          infoWindow.open(map, marker);
          openInfoWindow = infoWindow;
        });
      });

      // 이동 동선 (polyline)
      if (polylinePath.length > 1) {
        const polyline = new window.kakao.maps.Polyline({
          path: polylinePath,
          strokeWeight: 4,
          strokeColor: "#4F86F7",
          strokeOpacity: 0.85,
          strokeStyle: "solid",
        });
        polyline.setMap(map);
      }

      // 모든 마커가 보이도록 bounds 조정
      map.setBounds(bounds);
    });
  }, [loaded, places]);

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500"
        style={{ minHeight: 280 }}>
        {error}
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ minHeight: 280, height: "clamp(280px, 40vw, 480px)" }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">지도 불러오는 중...</span>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
