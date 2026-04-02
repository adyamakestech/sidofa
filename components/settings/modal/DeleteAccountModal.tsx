// DeleteAccountModal.tsx
"use client";
import { useState } from "react";
import BaseModal from "@/components/modal/BaseModal";
import { TriangleAlert } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const remove = async () => {
    setLoading(true);
    const res = await fetch("/api/user/delete", { method: "DELETE" });
    setLoading(false);
    if (res.ok) window.location.href = "/auth/login";
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Hapus Akun">
      <div className="space-y-5">
        {/* WARNING */}
        <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-100">
          <TriangleAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-600">
              Tindakan ini tidak bisa dibatalkan
            </p>
            <p className="text-xs text-red-400">
              Semua data akun, profil, dan riwayat akan dihapus permanen dan
              tidak bisa dipulihkan.
            </p>
          </div>
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
            onClick={remove}
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-all duration-150"
          >
            {loading ? "Menghapus..." : "Hapus Akun"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
