"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, TrendingUp } from "lucide-react";

export default function ForgotSuccessModule() {
  return (
    <div className="w-full max-w-[360px]">
      {/* Brand */}

      <div className="fade-up d1 flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--color-primary)]">
          <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
        </div>

        <span className="text-lg font-bold tracking-tight text-[var(--color-text)]">
          floe
        </span>
      </div>

      {/* Icon */}

      <div className="fade-up d2 mb-5 flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-[var(--color-soft-green)]" />
      </div>

      {/* Heading */}

      <h2 className="fade-up d3 text-2xl font-bold mb-2 text-[var(--color-text)]">
        Email Terkirim
      </h2>

      {/* Description */}

      <p className="fade-up d4 text-sm text-[var(--color-text-muted)] mb-6 leading-relaxed">
        Jika email terdaftar, kami telah mengirimkan tautan reset kata sandi.
        Silakan cek inbox atau folder spam.
      </p>

      {/* Button */}

      <Link
        href="/auth/login"
        className="fade-up d5 btn btn-primary w-full flex items-center justify-center gap-2"
      >
        Ke Halaman Login
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
