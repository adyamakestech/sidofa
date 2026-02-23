"use client";

import { useState } from "react";

import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthAlert from "@/components/auth/AuthAlert";
import PasswordInput from "@/components/auth/PasswordInput";
import StrengthMeter from "@/components/auth/StrengthMeter";

export default function RegisterModule() {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess("Check your email to verify.");
    }
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight mb-1">
        {" "}
        Create Account
      </h1>

      {success && <AuthAlert message={success} type="success" />}

      <form onSubmit={submit} className="space-y-4">
        <AuthInput name="name" placeholder="Full Name" />

        <AuthInput name="email" type="email" placeholder="Email" />

        <PasswordInput
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />

        <StrengthMeter password={password} />

        <AuthButton loading={loading}>Register</AuthButton>
      </form>
    </>
  );
}
