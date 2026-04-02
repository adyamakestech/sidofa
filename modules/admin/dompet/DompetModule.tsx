"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Plus, Pencil, Trash2, Wallet2 } from "lucide-react";

import { authFetch } from "@/lib/fetcher";
import { formatCurrency } from "@/lib/currency";
import { withLoading } from "@/lib/with-loading";
import { toastDelete, toastFail, confirmToast } from "@/components/Toast";

import { useLoading } from "@/context/LoadingContext";
import { useWallet } from "@/context/WalletContext";

export default function DompetModule() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const { wallets, reloadWallets } = useWallet();

  const [loading, setLoading] = useState(false);

  /* ================================
     COMPUTED
  ================================= */

  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);
  }, [wallets]);

  /* ================================
     ACTIONS
  ================================= */

  const handleCreateWallet = async () => {
    await withLoading(
      async () => {
        router.push("/dashboard/arus-kas/dompet/create");
      },
      { startLoading, stopLoading, minDuration: 600 },
    );
  };

  const handleEdit = async (id: string) => {
    await withLoading(
      async () => {
        router.push(`/dashboard/arus-kas/dompet/${id}/edit`);
      },
      { startLoading, stopLoading, minDuration: 600 },
    );
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmToast({
      title: "Yakin ingin menghapus dompet ini?",
    });

    if (!confirmed) return;

    await withLoading(
      async () => {
        setLoading(true);

        const res = await authFetch("/api/wallets/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          toastFail("Gagal menghapus dompet");
          setLoading(false);
          return;
        }

        toastDelete("Dompet berhasil dihapus");

        await reloadWallets();

        setLoading(false);
      },
      { startLoading, stopLoading, minDuration: 600 },
    );
  };

  /* ================================
     RENDER
  ================================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="relative pl-4 pt-2 pb-4 border-b border-white/60 flex items-start justify-between gap-4">
        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[var(--color-primary)]" />

        <div className="flex flex-col">
          <h2 className="text-xl font-semibold leading-tight">Dompet</h2>

          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Kelola semua dompet keuangan Anda.
          </p>
        </div>

        <button
          onClick={handleCreateWallet}
          className="btn btn-primary px-3 py-1.5 text-sm flex items-center gap-1.5"
        >
          <Plus size={14} />
          Tambah
        </button>
      </div>

      {/* SUMMARY */}
      {!loading && wallets.length > 0 && (
        <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[#56b8f0] rounded-2xl p-6 text-white flex items-center justify-between shadow-lg overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 left-[-20px] w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute bottom-[-30px] right-[30%] w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute top-[20%] right-[10%] w-10 h-10 bg-white/20 rounded-full" />
          <div className="absolute bottom-[10%] left-[40%] w-6 h-6 bg-white/20 rounded-full" />

          <div>
            <p className="text-sm opacity-80 font-medium">Total Saldo</p>

            <p className="text-3xl font-bold mt-1 tabular-nums">
              {formatCurrency(totalBalance)}
            </p>

            <p className="text-xs opacity-70 mt-1">
              Dari {wallets.length} dompet
            </p>
          </div>

          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur">
            <Wallet2 size={22} />
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && wallets.length === 0 && (
        <div className="border border-dashed border-[var(--color-border)] rounded-2xl p-14 text-center bg-[var(--color-surface)]">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-4">
            <Wallet2 size={22} className="text-[var(--color-primary)]" />
          </div>

          <p className="font-semibold text-[var(--color-text)]">
            Belum ada dompet
          </p>

          <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-5">
            Tambahkan dompet pertama Anda untuk mulai mencatat keuangan.
          </p>

          <button
            onClick={handleCreateWallet}
            className="btn btn-primary btn-circle"
          >
            <Plus size={20} />
          </button>
        </div>
      )}

      {/* WALLET LIST */}
      {!loading && wallets.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col justify-between hover:border-[var(--color-primary)] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center">
                    <Wallet2
                      size={18}
                      className="text-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-[var(--color-text)]">
                      {wallet.name}
                    </p>

                    <p className="text-xs text-[var(--color-text-muted)]">
                      Dompet
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(wallet.id)}
                    className="btn btn-warning btn-circle"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(wallet.id)}
                    className="btn btn-danger btn-circle"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-[var(--color-text-muted)]">Saldo</p>

                <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums mt-1">
                  {formatCurrency(wallet.balance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
