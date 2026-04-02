"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, Lock, Mail, TrendingUp } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";
import { withLoading } from "@/lib/with-loading";
import { toastFail, toastInfo } from "@/components/Toast";

import Link from "next/link";

export default function LoginModule() {
  const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoading();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    await withLoading(
      async () => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json().catch(() => null);

          if (!res.ok) {
            toastFail(data?.error || "Gagal masuk ke akun");
            return;
          }

          toastInfo("Login berhasil");
          router.replace("/dashboard");
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
          Masuk ke Floe
        </h2>

        <p className="text-sm font-normal text-[var(--color-text-muted)]">
          Kelola keuanganmu dengan mudah dan aman.
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

        {/* Password */}
        <div className="fade-up d4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-[var(--color-text-muted)]">
              Kata Sandi
            </label>

            <Link
              href="/auth/forgot"
              className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            >
              Lupa kata sandi?
            </Link>
          </div>

          <div className="input-wrap relative">
            <span className="input-icon">
              <Lock className="w-4 h-4" />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              className="input-field pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Button */}
        <div className="fade-up d5 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}

            {loading ? "Memproses..." : "Masuk"}
          </button>
        </div>
      </form>

      {/* Footer */}
      <p className="fade-up d6 text-center text-sm mt-7 text-[var(--color-text-muted)]">
        Belum punya akun?
        <Link
          href="/auth/register"
          className="font-semibold ml-1 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
        >
          Daftar gratis
        </Link>
      </p>
    </div>
  );
}
