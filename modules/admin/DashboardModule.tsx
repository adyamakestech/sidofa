"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardModule() {
  const router = useRouter();

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Welcome Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Saldo" value="Rp 12.500.000" />
        <Card title="Transaksi" value="124" />
        <Card title="Invoice" value="18" />
      </div>
    </>
  );
}

function Card({ title, value }: any) {
  return (
    <div
      className="
      bg-[var(--color-surface)]
      border border-[var(--color-border)]
      rounded-xl p-6
    "
    >
      <p className="text-sm text-[var(--color-text-muted)]">{title}</p>

      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}
