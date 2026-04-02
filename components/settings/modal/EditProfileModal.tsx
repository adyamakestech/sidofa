// EditProfileModal.tsx
"use client";
import { useState } from "react";
import BaseModal from "@/components/modal/BaseModal";
import { useAuth } from "@/context/AuthContext";
import { User, Phone } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ open, onClose }: Props) {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    const res = await fetch("/api/user/update", {
      method: "PATCH",
      body: JSON.stringify({ name, phone }),
    });
    setLoading(false);
    if (res.ok) {
      refreshUser?.();
      onClose();
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Edit Profil">
      <div className="space-y-5">
        {/* NAMA */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Nama Lengkap
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              className="w-full border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* NO. TELEPON */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            No. Telepon
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              className="w-full border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition"
              placeholder="Masukkan nomor telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 py-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] transition-all duration-150"
          >
            Batal
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="flex-2 w-full py-2.5 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50 transition-all duration-150"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
