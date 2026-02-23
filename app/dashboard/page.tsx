export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--sidofa-bg)] text-white">
      <aside
        className="
        w-64
        bg-white/5
        border-r border-white/10
        p-6
      "
      >
        <div className="text-xl font-bold mb-10">SIDOFA</div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header
          className="
          h-16
          flex items-center justify-between
          px-8
          border-b border-white/10
          bg-white/5
        "
        >
          <div className="text-sm text-gray-400">Dashboard Overview</div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
