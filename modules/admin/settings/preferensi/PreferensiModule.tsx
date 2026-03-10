"use client";
import { useState } from "react";
import AkunTab from "./tabs/AkunTab";
import { useAuth } from "@/context/AuthContext";

const TABS = [
  { id: "akun", label: "Akun" },
  { id: "perusahaan", label: "Perusahaan" },
  { id: "pembayaran", label: "Pembayaran" },
  { id: "wilayah", label: "Waktu & Wilayah" },
  { id: "custom", label: "Custom Field" },
];
export default function PreferensiModule() {
  const { user } = useAuth();
  const [tab, setTab] = useState("akun");

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="relative pl-4 pt-2 pb-4 border-b border-white/60">
        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[var(--color-primary)]" />

        <h2 className="text-xl font-semibold leading-tight">Preferensi</h2>

        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Kelola pengaturan akun dan bisnis Anda.
        </p>
      </div>

      {/* TABS + CONTENT */}
      <div className="rounded-xl overflow-hidden shadow-sm shadow-black/5 border border-white/70">
        {/* TABS */}
        <div className="flex gap-1 px-2 pt-2 overflow-x-auto bg-white/40 backdrop-blur-sm border-b border-white/60">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
              px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap
              border border-transparent transition-colors duration-200
              ${
                tab === t.id
                  ? "bg-white text-[var(--color-primary)] border-white/70 border-b-white -mb-px shadow-sm"
                  : "text-[var(--color-text-muted)] hover:bg-white/60 hover:text-[var(--color-primary)]"
              }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="bg-white/80 backdrop-blur-sm p-6 shadow-sm">
          {tab === "akun" && <AkunTab />}
          {tab === "perusahaan" && <div>Perusahaan settings</div>}
          {tab === "pembayaran" && <div>Pembayaran settings</div>}
          {tab === "wilayah" && <div>Waktu & wilayah settings</div>}
          {tab === "custom" && <div>Custom field settings</div>}
        </div>
      </div>
    </div>
  );
}
