"use client";
import { Camera } from "lucide-react";

interface Props {
  name: string;
  avatar?: string | null;
  onUpload?: (file: File) => void;
}

export default function AvatarUploader({ name, avatar, onUpload }: Props) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <label className="relative cursor-pointer group">
      {avatar ? (
        <img
          src={avatar}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-[var(--color-border)] group-hover:ring-[var(--color-primary)] transition-all duration-200"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary-subtle)] to-gray-200 flex items-center justify-center font-semibold text-sm text-[var(--color-primary)] ring-2 ring-[var(--color-border)] group-hover:ring-[var(--color-primary)] transition-all duration-200">
          {initials}
        </div>
      )}

      <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <Camera className="w-5 h-5 text-white" />
      </div>

      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (!e.target.files) return;
          onUpload?.(e.target.files[0]);
        }}
      />
    </label>
  );
}
