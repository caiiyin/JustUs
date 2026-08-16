import type { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "나들이 — 생애주기 맞춤 나들이 코스 추천",
  description: "내 생애주기에 맞는 여가 나들이 코스를 추천받으세요",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-gray-100">
        <Providers>
          <TopNav />
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
