"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authFetch } from "@/lib/fetcher";
import { withLoading } from "@/lib/with-loading";
import { formatCurrencyInput, parseCurrency } from "@/lib/currency";
import { useLoading } from "@/context/LoadingContext";
import { useWallet } from "@/context/WalletContext";

import FormField from "@/components/form/FormField";
import Input from "@/components/form/Input";

import { toastCreate, toastFail } from "@/components/Toast";
import { RotateCcw } from "lucide-react";

type WalletFormData = {
  id: string;
  name: string;
  balance: number;
};

interface Props {
  wallet?: WalletFormData | null;
}

export default function WalletForm({ wallet }: Props) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const { reloadWallets } = useWallet();

  const isEdit = !!wallet;

  const [name, setName] = useState("");
  const [balance, setBalance] = useState<number>(0);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (wallet) {
      setName(wallet.name ?? "");
      setBalance(wallet.balance ?? 0);
      setDisplay(wallet.balance ? formatCurrencyInput(wallet.balance) : "");
      return;
    }

    setName("");
    setBalance(0);
    setDisplay("");
  }, [wallet]);

  const resetForm = () => {
    if (isEdit && wallet) {
      setName(wallet.name ?? "");
      setBalance(wallet.balance ?? 0);
      setDisplay(wallet.balance ? formatCurrencyInput(wallet.balance) : "");
      return;
    }

    setName("");
    setBalance(0);
    setDisplay("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await withLoading(
      async () => {
        const url = isEdit ? "/api/wallets/update" : "/api/wallets/create";

        const res = await authFetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: wallet?.id,
            name: name.trim(),
            balance: balance || 0,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toastFail(data.error || "Gagal menyimpan dompet");
          return;
        }

        toastCreate(
          isEdit ? "Dompet berhasil diperbarui" : "Dompet berhasil dibuat",
        );

        await reloadWallets();
        router.push("/dashboard/arus-kas/dompet");
      },
      {
        startLoading,
        stopLoading,
        minDuration: 600,
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-[var(--color-surface)]
        border border-[var(--color-border)]
        rounded-2xl
        p-6
        space-y-6
      "
    >
      <FormField label="Nama Dompet">
        <Input
          placeholder="Contoh: BCA / Cash / Dana"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormField>

      {/* <FormField
        label="Saldo Awal"
        hint="Opsional. Isi jika dompet sudah memiliki saldo."
      >
        <Input
          inputMode="numeric"
          autoComplete="off"
          placeholder="Rp. 0"
          value={display}
          onChange={(e) => {
            const raw = e.target.value;

            const parsed = parseCurrency(raw);

            setBalance(parsed);
            setDisplay(parsed ? formatCurrencyInput(parsed) : "");
          }}
        />
      </FormField> */}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={resetForm}
          className="btn btn-warning h-11 px-5 flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button type="submit" className="btn btn-primary h-11 px-6">
          {isEdit ? "Update Dompet" : "Simpan Dompet"}
        </button>
      </div>
    </form>
  );
}
