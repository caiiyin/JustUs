import { Suspense } from "react";
import ResultContent from "./ResultContent";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#EAF4FF] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1D4994] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#1D4994] font-medium">코스를 찾고 있어요...</p>
      </div>
    </div>
  );
}

export default function QuizResultPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultContent />
    </Suspense>
  );
}
