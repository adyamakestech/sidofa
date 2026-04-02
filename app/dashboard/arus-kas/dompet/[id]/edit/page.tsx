"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowBigLeftDash } from "lucide-react";

import WalletForm from "@/components/form/WalletForm";
import { authFetch } from "@/lib/fetcher";
import { withLoading } from "@/lib/with-loading";
import { useLoading } from "@/context/LoadingContext";
import { toastFail } from "@/components/Toast";

type Wallet = {
  id: string;
  name: string;
  balance: number;
};

export default function EditWalletPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { startLoading, stopLoading } = useLoading();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        setIsFetching(true);

        const res = await authFetch("/api/wallets/detail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();

        if (!res.ok) {
          toastFail(data.error || "Gagal mengambil data dompet");
          router.push("/dashboard/arus-kas/dompet");
          return;
        }

        setWallet(data);
      } catch {
        toastFail("Terjadi kesalahan saat mengambil data dompet");
        router.push("/dashboard/arus-kas/dompet");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      loadWallet();
    }
  }, [id, router]);

  const handleBack = async () => {
    await withLoading(
      async () => {
        router.push("/dashboard/arus-kas/dompet");
      },
      {
        startLoading,
        stopLoading,
        minDuration: 400,
      },
    );
  };

  return (
    <div className="space-y-8">
      <div className="relative pl-4 pt-2 pb-4 border-b border-white/60 flex items-start justify-between gap-4">
        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[var(--color-primary)]" />

        <div className="flex flex-col">
          <h2 className="text-xl font-semibold leading-tight">Edit Dompet</h2>

          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Perbarui data dompet untuk menjaga catatan keuangan tetap akurat.
          </p>
        </div>

        <button
          onClick={handleBack}
          className="btn btn-secondary px-3 py-1.5 text-sm flex items-center gap-1.5"
        >
          <ArrowBigLeftDash size={14} />
          Kembali
        </button>
      </div>

      {isFetching ? (
        <div
          className="
            bg-[var(--color-surface)]
            border border-[var(--color-border)]
            rounded-2xl
            p-6
          "
        >
          <p className="text-sm text-[var(--color-text-muted)]">
            Memuat data dompet...
          </p>
        </div>
      ) : wallet ? (
        <WalletForm wallet={wallet} />
      ) : null}
    </div>
  );
}
