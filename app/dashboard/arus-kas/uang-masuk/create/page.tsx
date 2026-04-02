"use client";

import { useRouter } from "next/navigation";
import { ArrowBigLeftDash } from "lucide-react";

import { withLoading } from "@/lib/with-loading";
import { useLoading } from "@/context/LoadingContext";

import WalletForm from "@/components/form/WalletForm";

export default function CreateCashInPage() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleBack = async () => {
    await withLoading(
      async () => {
        router.push("/dashboard/arus-kas/uang-masuk");
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
          <h2 className="text-xl font-semibold leading-tight">
            Tambah Uang Masuk
          </h2>

          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Tambahkan Uang baru untuk mencatat arus kas Anda.
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

      <WalletForm />
    </div>
  );
}
