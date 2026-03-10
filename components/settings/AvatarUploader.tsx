"use client";

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
    <div className="flex items-center gap-4">
      {avatar ? (
        <img
          src={avatar}
          className="w-14 h-14 rounded-full object-cover border border-[var(--color-border)]"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
      )}

      <label className="text-sm text-[var(--color-primary)] cursor-pointer hover:underline">
        Ubah
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            if (!e.target.files) return;
            onUpload?.(e.target.files[0]);
          }}
        />
      </label>
    </div>
  );
}
