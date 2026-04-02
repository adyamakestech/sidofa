// SettingRow.tsx
"use client";

interface Props {
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}

export default function SettingRow({ label, value, action }: Props) {
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-[var(--color-text)]">{value}</p>
      </div>
      {action && (
        <div className="ml-6 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
          {action}
        </div>
      )}
    </div>
  );
}
