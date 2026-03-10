"use client";

import AvatarUploader from "@/components/settings/AvatarUploader";
import SettingRow from "@/components/settings/SettingRow";
import { useAuth } from "@/context/AuthContext";

export default function AkunTab() {
  const { user } = useAuth();

  if (!user) return null;

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* PROFILE */}
      <div className="flex items-center justify-between pb-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <AvatarUploader
            name={user.name ?? "User"}
            avatar={user.avatar ?? undefined}
          />

          <div>
            <p className="font-semibold">{user.name ?? "-"}</p>

            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-medium">
              {user.role ?? "-"}
            </span>
          </div>
        </div>

        <button className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition">
          Edit Profil
        </button>
      </div>

      {/* INFORMASI AKUN */}
      <div>
        <h4 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-3">
          Informasi Akun
        </h4>

        <div className="divide-y divide-[var(--color-border)]">
          <SettingRow label="Nama lengkap" value={user.name ?? "-"} />
          <SettingRow label="Email" value={user.email ?? "-"} />
          <SettingRow
            label="No. Telepon"
            value={user.phone ?? "Belum ditambahkan"}
          />
        </div>
      </div>

      {/* KEAMANAN */}
      <div>
        <h4 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-3">
          Keamanan
        </h4>

        <div className="divide-y divide-[var(--color-border)]">
          <SettingRow
            label="Kata sandi"
            value="Terakhir diubah 30 hari lalu"
            action={
              <button className="text-sm text-[var(--color-primary)] hover:underline">
                Reset
              </button>
            }
          />
        </div>
      </div>

      {/* AKTIVITAS */}
      <div>
        <h4 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-3">
          Aktivitas
        </h4>

        <div className="divide-y divide-[var(--color-border)]">
          <SettingRow
            label="Login terakhir"
            value={
              user.lastLogin ? formatDate(user.lastLogin) : "Belum pernah login"
            }
          />

          <SettingRow
            label="Bergabung sejak"
            value={formatDate(user.createdAt)}
          />
        </div>
      </div>

      {/* DANGER ZONE */}
      <div>
        <h4 className="text-xs font-semibold tracking-widest uppercase text-red-400 mb-3">
          Danger Zone
        </h4>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">Hapus Akun</p>
            <p className="text-xs text-red-400 mt-0.5">
              Semua data akan dihapus permanen dan tidak bisa dipulihkan.
            </p>
          </div>

          <button className="px-4 py-2 text-sm font-medium rounded-lg border border-red-300 text-red-500 hover:bg-red-100 transition">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
