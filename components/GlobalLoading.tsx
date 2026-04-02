"use client";
import { useLoading } from "@/context/LoadingContext";

export default function GlobalLoading() {
  const { loading } = useLoading();
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4">
      {/* background blur */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      {/* bouncing dots */}
      <div className="loading-dots">
        <span className="loading-dot dot-1"></span>
        <span className="loading-dot dot-2"></span>
        <span className="loading-dot dot-3"></span>
        <span className="loading-dot dot-4"></span>
      </div>

      {/* text */}
      <div className="loading-label">Memproses...</div>
    </div>
  );
}
