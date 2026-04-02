export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none opacity-20" />
        {children}
      </div>
    </>
  );
}
