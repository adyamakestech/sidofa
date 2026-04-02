"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, Lock, Mail, User, TrendingUp } from "lucide-react";

import { useLoading } from "@/context/LoadingContext";
import { withLoading } from "@/lib/with-loading";

import { toastFail, toastInfo } from "@/components/Toast";

import Link from "next/link";

export default function RegisterModule() {
  const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoading();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);

  function checkPasswordStrength(value: string) {
    let score = 0;

    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    return score;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    if (password !== confirmPassword) {
      toastFail("Konfirmasi kata sandi tidak cocok");
      return;
    }

    if (passwordStrength < 2) {
      toastFail("Kata sandi terlalu lemah");
      return;
    }

    await withLoading(
      async () => {
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          });

          const data = await res.json().catch(() => null);

          if (!res.ok) {
            toastFail(data?.error || "Gagal mendaftar");
            return;
          }

          toastInfo("Akun berhasil dibuat");

          router.push("/auth/login");
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
          Daftar Akun Baru
        </h2>

        <p className="text-sm font-normal text-[var(--color-text-muted)]">
          Mulai kelola keuanganmu sekarang.
        </p>
      </div>

      {/* Form */}

      <form onSubmit={submit} className="space-y-3.5">
        {/* Name */}

        <div className="fade-up d3">
          <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-muted)]">
            Nama Lengkap
          </label>

          <div className="input-wrap">
            <span className="input-icon">
              <User className="w-4 h-4" />
            </span>

            <input
              type="text"
              className="input-field"
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}

        <div className="fade-up d4">
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

        <div className="fade-up d5">
          <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-muted)]">
            Kata Sandi
          </label>

          <div className="input-wrap relative">
            <span className="input-icon">
              <Lock className="w-4 h-4" />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              className="input-field pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                const v = e.target.value;
                setPassword(v);
                setPasswordStrength(checkPasswordStrength(v));
              }}
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

          {/* Strength */}

          <div className="mt-2">
            <div className="h-1.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  passwordStrength <= 1
                    ? "w-1/4 bg-[var(--color-soft-red)]"
                    : passwordStrength === 2
                      ? "w-2/4 bg-[var(--color-soft-yellow)]"
                      : passwordStrength === 3
                        ? "w-3/4 bg-[var(--color-soft-blue)]"
                        : "w-full bg-[var(--color-soft-green)]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Confirm Password */}

        <div className="fade-up d6">
          <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-muted)]">
            Konfirmasi Kata Sandi
          </label>

          <div className="input-wrap relative">
            <span className="input-icon">
              <Lock className="w-4 h-4" />
            </span>

            <input
              type={showConfirm ? "text" : "password"}
              className="input-field pr-10"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Button */}

        <div className="fade-up d7 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}

            {loading ? "Memproses..." : "Daftar"}
          </button>
        </div>
      </form>

      {/* Footer */}

      <p className="fade-up d8 text-center text-sm mt-7 text-[var(--color-text-muted)]">
        Sudah punya akun?
        <Link
          href="/auth/login"
          className="font-semibold ml-1 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}
