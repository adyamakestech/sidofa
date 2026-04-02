"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/fetcher";
import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { TransactionsProvider } from "@/context/TransactionsContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const res = await authFetch("/api/auth/me");

      if (!res.ok) {
        window.location.href = "/auth/login";
        return;
      }

      const data = await res.json();

      setUser(data);
      setReady(true);
    };

    init();
  }, []);

  if (!ready) return null;

  return (
    <AuthProvider user={user}>
      <WalletProvider userId={user.id}>
        <TransactionsProvider>
          <AdminLayout>{children}</AdminLayout>
        </TransactionsProvider>
      </WalletProvider>
    </AuthProvider>
  );
}
