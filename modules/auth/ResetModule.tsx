"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthAlert from "@/components/auth/AuthAlert";
import StrengthMeter from "@/components/auth/StrengthMeter";

export default function ResetModule() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      body: JSON.stringify({
        token,
        password,
      }),
    });

    if (!res.ok) {
      setError("Invalid or expired token");
      return;
    }

    router.push("/login");
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight mb-1">
        {" "}
        Set New Password
      </h1>

      {error && <AuthAlert message={error} />}

      <form onSubmit={submit} className="space-y-4">
        <PasswordInput
          placeholder="New Password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />

        <StrengthMeter password={password} />

        <AuthButton>Reset</AuthButton>
      </form>
    </>
  );
}
