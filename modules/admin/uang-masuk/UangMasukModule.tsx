"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { useTransactions } from "@/context/TransactionsContext";
import { authFetch } from "@/lib/fetcher";
import { formatCurrency } from "@/lib/currency";
import { toastDelete, toastFail, confirmToast } from "@/components/Toast";

import { withLoading } from "@/lib/with-loading";
import { useLoading } from "@/context/LoadingContext";

export default function UangMasukModule() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const { transactions, setStatus, reload } = useTransactions();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus("income");
  }, [setStatus]);

  /* ================================
       ACTIONS
    ================================= */

  const handleCreateCashIn = async () => {
    await withLoading(
      async () => {
        router.push("/dashboard/arus-kas/uang-masuk/create");
      },
      { startLoading, stopLoading, minDuration: 600 },
    );
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="relative pl-4 pt-2 pb-4 border-b border-white/60 flex items-start justify-between gap-4">
        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[var(--color-primary)]" />

        <div className="flex flex-col">
          <h2 className="text-xl font-semibold leading-tight">Uang Masuk</h2>

          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Kelola semua transaksi pemasukan Anda.
          </p>
        </div>

        <button
          onClick={handleCreateCashIn}
          className="btn btn-primary px-3 py-1.5 text-sm flex items-center gap-1.5"
        >
          <Plus size={14} />
          Tambah
        </button>
      </div>

      {/* CONTENT */}
      {!loading && transactions.length === 0 && (
        <div className="border border-dashed border-[var(--color-border)] rounded-2xl p-14 text-center bg-[var(--color-surface)]">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-4">
            <Plus size={22} className="text-[var(--color-primary)]" />
          </div>

          <p className="font-semibold text-[var(--color-text)]">
            Belum ada pemasukan
          </p>

          <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-5">
            Tambahkan transaksi pemasukan pertama Anda untuk mulai mencatat
            keuangan.
          </p>

          <button
            onClick={handleCreateCashIn}
            className="btn btn-primary btn-circle"
          >
            <Plus size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
