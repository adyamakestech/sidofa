"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Mail, TrendingUp, ArrowLeft } from "lucide-react";

import { useLoading } from "@/context/LoadingContext";
import { withLoading } from "@/lib/with-loading";

import { toastFail, toastInfo } from "@/components/Toast";

import Link from "next/link";

export default function ForgotModule() {
  const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoading();

  const [email, setEmail] = useState("");

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    if (!isValidEmail(email)) {
      toastFail("Format email tidak valid");
      return;
    }

    await withLoading(
      async () => {
        try {
          const res = await fetch("/api/auth/forgot", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          const data = await res.json().catch(() => null);

          if (!res.ok) {
            toastFail(data?.error || "Gagal mengirim email reset");
            return;
          }

          toastInfo("Tautan reset berhasil dikirim");

          router.push("/auth/forgot/success");
        } catch {
          toastFail("Terjadi kesalahan jaringan");
        }
      },
      {
        startLoading,
        stopLoading,
        minDuration: 600,
      },
    );
  }

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

      {/* Heading */}

      <div className="fade-up d2 mb-8">
        <h2 className="text-2xl font-bold mb-1 tracking-tight text-[var(--color-text)]">
          Lupa Kata Sandi
        </h2>

        <p className="text-sm font-normal text-[var(--color-text-muted)]">
          Masukkan email untuk menerima link reset password.
        </p>
      </div>

      {/* Form */}

      <form onSubmit={submit} className="space-y-3.5">
        {/* Email */}

        <div className="fade-up d3">
          <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-muted)]">
            Email
          </label>

          <div className="input-wrap">
            <span className="input-icon">
              <Mail className="w-4 h-4" />
            </span>

            <input
              type="email"
              className="input-field"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Button */}
        <div className="fade-up d4 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}

            {loading ? "Mengirim..." : "Kirim Tautan"}
          </button>
        </div>
      </form>

      {/* Footer */}

      <p className="fade-up d5 text-center text-sm mt-7 text-[var(--color-text-muted)]">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Login
        </Link>
      </p>
    </div>
  );
}
