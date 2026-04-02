"use client";

import React from "react";

interface Props {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}

export default function FormField({ label, children, hint, error }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[var(--color-text)]">
        {label}
      </label>

      {children}

      {hint && !error && (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
