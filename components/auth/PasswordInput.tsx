"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordInput(props: any) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className="
          w-full rounded-lg
          bg-transparent

          border border-[var(--border-soft)]
          px-4 py-3 pr-11

          text-sm text-[var(--text-primary)]
          placeholder:text-[var(--text-muted)]

          focus:border-[var(--brand-accent)]
          focus:ring-2 focus:ring-[var(--brand-accent)]/20

          outline-none
        "
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-[var(--text-muted)]
          hover:text-white
          transition
        "
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
