"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Eye, EyeOff, Lock, TrendingUp, Check } from "lucide-react";

export default function ResetModule() {
  const router = useRouter();
  const params = useSearchParams();

  // Ambil token dari URL ?token=xxxx
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Strength checker
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

    if (!token) {
      setError("Token reset tidak valid");
      return;
    }

    if (passwordStrength < 2) {
      setError("Kata sandi terlalu lemah");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data?.error || "Token tidak valid atau sudah kedaluwarsa");
      return;
    }

    setSuccess(true);
    router.push("/login?reset=success");
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
          Reset Kata Sandi
        </h2>

        <p className="text-sm font-normal text-[var(--color-text-muted)]">
          Buat kata sandi baru untuk akunmu.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="fade-up d2 mb-4 rounded-lg border border-[var(--color-soft-red)] bg-[var(--color-soft-red)]/10 px-3 py-2 text-sm text-[var(--color-soft-red)]">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={submit} className="space-y-3.5">
        {/* Password */}
        <div className="fade-up d3">
          <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-muted)]">
            Kata Sandi Baru
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

        {/* Confirm */}
        <div className="fade-up d4">
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

          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs mt-1 text-[var(--color-soft-red)]">
              Kata sandi tidak cocok
            </p>
          )}
        </div>

        {/* Button */}
        <div className="fade-up d5 pt-1">
          <button
            type="submit"
            disabled={loading || success}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {success ? (
              <>
                <Check className="w-4 h-4" />
                Berhasil
              </>
            ) : loading ? (
              "Menyimpan..."
            ) : (
              "Simpan Kata Sandi"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
