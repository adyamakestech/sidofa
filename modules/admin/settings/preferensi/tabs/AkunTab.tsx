"use client";

import AvatarUploader from "@/components/settings/AvatarUploader";
import SettingRow from "@/components/settings/SettingRow";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import EditProfileModal from "@/components/settings/modal/EditProfileModal";
import ChangePasswordModal from "@/components/settings/modal/ChangePasswordModal";
import DeleteAccountModal from "@/components/settings/modal/DeleteAccountModal";
import ChangeEmailModal from "@/components/settings/modal/ChangeEmailModal";

import { Pencil } from "lucide-react";

export default function AkunTab() {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editEmailOpen, setEditEmailOpen] = useState(false);

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
      {/*  ProfileHeader section */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-5">
          <AvatarUploader
            name={user.name ?? "User"}
            avatar={user.avatar ?? undefined}
          />
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-[var(--color-text)] leading-tight">
              {user.name ?? "-"}
            </p>
            <span className="inline-flex items-center gap-1 w-fit text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-70" />
              {user.role ?? "-"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setEditOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] transition-all duration-150"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Profil
        </button>
      </div>

      {/* INFORMASI AKUN */}
      <div className="px-5">
        <h4 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] py-3 border-b border-[var(--color-border)]">
          Informasi Akun
        </h4>
        <div className="divide-y divide-[var(--color-border)]">
          <SettingRow label="Nama Lengkap" value={user.name ?? "-"} />
          <SettingRow
            label="Email"
            value={user.email ?? "-"}
            action={
              <button
                onClick={() => setEditEmailOpen(true)}
                className="text-xs font-medium text-[var(--color-primary)] hover:underline transition"
              >
                Ubah
              </button>
            }
          />
          <SettingRow
            label="No. Telepon"
            value={
              user.phone ?? (
                <span className="text-[var(--color-text-muted)] italic font-normal">
                  Belum ditambahkan
                </span>
              )
            }
          />
        </div>
      </div>

      {/* KEAMANAN */}
      <div className="px-5">
        <h4 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] py-3 border-b border-[var(--color-border)]">
          Keamanan
        </h4>
        <div className="divide-y divide-[var(--color-border)]">
          <SettingRow
            label="Kata Sandi"
            value={
              user.passwordUpdatedAt ? (
                `Terakhir diubah ${formatDate(user.passwordUpdatedAt)}`
              ) : (
                <span className="text-[var(--color-text-muted)] italic font-normal">
                  Belum pernah diubah
                </span>
              )
            }
            action={
              <button
                onClick={() => setPasswordOpen(true)}
                className="text-xs font-medium text-[var(--color-primary)] hover:underline transition"
              >
                Ubah
              </button>
            }
          />
        </div>
      </div>

      {/* AKTIVITAS */}
      <div className="px-5">
        <h4 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] py-3 border-b border-[var(--color-border)]">
          Aktivitas
        </h4>
        <div className="divide-y divide-[var(--color-border)]">
          <SettingRow
            label="Login Terakhir"
            value={
              user.lastLogin ? (
                formatDate(user.lastLogin)
              ) : (
                <span className="text-[var(--color-text-muted)] italic font-normal">
                  Belum pernah login
                </span>
              )
            }
          />
          <SettingRow
            label="Bergabung Sejak"
            value={formatDate(user.createdAt)}
          />
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="px-5">
        <h4 className="text-xs font-semibold tracking-widest uppercase text-red-400 mb-1">
          Danger Zone
        </h4>
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            {/* Title */}
            <p className="text-xs font-medium text-red-400 uppercase tracking-wide">
              Hapus Akun
            </p>
            {/* Description */}
            <p className="text-sm font-medium text-red-600">
              Semua data akan dihapus permanen dan tidak bisa dipulihkan.
            </p>
          </div>

          {/* Action */}
          <button
            onClick={() => setDeleteOpen(true)}
            className="ml-6 shrink-0 px-4 py-2 text-xs font-medium rounded-lg border border-red-300 text-red-500 hover:bg-red-100 hover:border-red-400 transition-all duration-150"
          >
            Hapus Akun
          </button>
        </div>
      </div>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
      <DeleteAccountModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
      <ChangeEmailModal
        open={editEmailOpen}
        onClose={() => setEditEmailOpen(false)}
      />
    </div>
  );
}
