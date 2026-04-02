// ChangeEmailModal.tsx
"use client";
import { useState } from "react";
import BaseModal from "@/components/modal/BaseModal";
import { Mail } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangeEmailModal({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const res = await fetch("/api/user/change-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) onClose();
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Ubah Email">
      <div className="space-y-5">
        {/* EMAIL BARU */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Email Baru
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="email"
              className="w-full border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition"
              placeholder="Masukkan email baru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Link verifikasi akan dikirim ke email baru kamu.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-[var(--color-border)]" />

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] transition-all duration-150"
          >
            Batal
          </button>
          <button
            onClick={submit}
            disabled={loading || !email}
            className="w-full py-2.5 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50 transition-all duration-150"
          >
            {loading ? "Mengirim..." : "Kirim Verifikasi"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
