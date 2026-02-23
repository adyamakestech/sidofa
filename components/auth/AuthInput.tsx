interface Props {
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: any) => void;
  name?: string;
}

export default function AuthInput({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}: Props) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="
        w-full rounded-lg

        bg-transparent
        border border-[var(--border-soft)]

        px-4 py-3

        text-sm text-[var(--text-primary)]
        placeholder:text-[var(--text-muted)]

        focus:border-[var(--brand-accent)]
        focus:ring-2
        focus:ring-[var(--brand-accent)]/20

        outline-none transition
      "
    />
  );
}
