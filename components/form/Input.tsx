"use client";

import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = "", ...props }: Props) {
  return (
    <input
      {...props}
      className={`
        w-full h-11 px-3 rounded-lg
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        text-sm
        outline-none
        transition-all
        focus:border-[var(--color-primary)]
        focus:ring-2 focus:ring-[var(--color-primary-light)]
        ${className}
      `}
    />
  );
}
