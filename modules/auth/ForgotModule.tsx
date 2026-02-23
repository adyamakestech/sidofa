"use client";

import { useState } from "react";

import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthAlert from "@/components/auth/AuthAlert";

export default function ForgotModule() {
  const [done, setDone] = useState(false);

  async function submit(e: any) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    await fetch("/api/auth/forgot", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
      }),
    });

    setDone(true);
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight mb-1">
        {" "}
        Reset Password
      </h1>

      {done && (
        <AuthAlert type="success" message="If account exists, email sent." />
      )}

      <form onSubmit={submit} className="space-y-4">
        <AuthInput name="email" type="email" placeholder="Email" />

        <AuthButton>Send Link</AuthButton>
      </form>
    </>
  );
}
