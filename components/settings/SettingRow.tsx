interface Props {
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}

export default function SettingRow({ label, value, action }: Props) {
  return (
    <div className="flex items-center justify-between py-5">
      <div>
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
        <p className="font-medium mt-0.5">{value}</p>
      </div>

      {action && <div className="ml-6">{action}</div>}
    </div>
  );
}
