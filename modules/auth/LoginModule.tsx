"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthAlert from "@/components/auth/AuthAlert";
import PasswordInput from "@/components/auth/PasswordInput";

export default function LoginModule() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: any) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>

        <p className="text-sm text-[var(--text-muted)]">
          Sign in to your SIDOFA workspace
        </p>
      </div>

      {/* Error */}
      {error && <AuthAlert message={error} />}

      {/* Form */}
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-3">
          <AuthInput
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </div>

        <AuthButton loading={loading}>Sign in</AuthButton>
      </form>

      {/* Footer */}
      <div className="pt-2 text-center text-sm space-y-2">
        <a
          href="/forgot"
          className="
            block
            text-[var(--text-muted)]
            hover:text-white
            transition
          "
        >
          Forgot your password?
        </a>

        <div className="text-[var(--text-muted)]">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="
              text-[var(--brand-accent)]
              hover:underline
            "
          >
            Create one
          </a>
        </div>
      </div>
    </div>
  );
}
