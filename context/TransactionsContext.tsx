"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "@/lib/fetcher";
import { useWallet } from "@/context/WalletContext";

interface Transaction {
  id: string;
  wallet_id: string;
  type: "income" | "expense";
  amount: number;
  created_at: string;
}

interface TransactionsContextType {
  transactions: Transaction[];
  status: "income" | "expense";
  setStatus: (status: "income" | "expense") => void;
  reload: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsProvider = ({ children }: any) => {
  const { activeWallet } = useWallet();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<"income" | "expense">("income");

  const fetchTransactions = async () => {
    if (!activeWallet) return;

    const res = await authFetch("/api/transactions/list", {
      method: "POST",
      body: JSON.stringify({
        wallet_id: activeWallet.id,
        status,
      }),
    });

    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeWallet, status]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        status,
        setStatus,
        reload: fetchTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used inside provider");
  return ctx;
};
