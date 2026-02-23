export default function AuthButton({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      disabled={loading}
      className="
        w-full rounded-lg py-3

        bg-[var(--brand-primary)]

        text-sm font-medium text-black

        hover:brightness-95
        active:scale-[0.99]

        transition
        disabled:opacity-60
      "
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
