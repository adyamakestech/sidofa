export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-[var(--bg-main)]
        text-[var(--text-primary)]
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-xl
          bg-[var(--bg-card)]
          border border-[var(--border-soft)]
          backdrop-blur-xl

          px-8 py-10

          shadow-[0_0_40px_rgba(0,0,0,0.6)]
        "
      >
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">SIDOFA</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Digital Financial Platform
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
