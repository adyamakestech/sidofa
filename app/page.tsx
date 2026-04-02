"use client";

import { useLoading } from "@/context/LoadingContext";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { startLoading } = useLoading();

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="relative w-full max-w-[420px] text-center">
          {/* Brand */}
          {/* <div className="flex items-center justify-center gap-2 mb-10 fade-up d1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-primary)] shadow-sm">
              <TrendingUp size={18} className="text-white" strokeWidth={2.5} />
            </div>

            <span className="text-xl font-bold tracking-tight text-[var(--color-text)]">
              floe
            </span>
          </div> */}

          {/* Title */}
          <h1 className="fade-up d2 text-4xl font-bold tracking-tight text-[var(--color-text)] mb-4">
            Kelola Invoice
            <br />& Arus Kas
          </h1>

          <p className="fade-up d3 text-sm text-[var(--color-text-muted)] mb-10 leading-relaxed max-w-[320px] mx-auto">
            Buat invoice, pantau pembayaran, dan kelola arus kas bisnis dalam
            satu aplikasi sederhana.
          </p>

          {/* Buttons */}
          <div className="fade-up d4 flex justify-center gap-3">
            <Link
              href="/auth/login"
              onClick={startLoading}
              className="btn btn-primary w-[140px] text-center"
            >
              Masuk
            </Link>

            <Link
              href="/auth/register"
              onClick={startLoading}
              className="btn btn-secondary w-[140px] text-center"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Footer */}
          <p className="fade-up d6 text-xs mt-10 text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} floe
          </p>
        </div>
      </div>
    </>
  );
}
