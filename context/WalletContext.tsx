"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { authFetch } from "@/lib/fetcher";

interface Wallet {
  id: string;
  name: string;
  balance: number;
}

interface WalletContextType {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  setActiveWallet: (wallet: Wallet) => void;
  reloadWallets: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);

  const hasLoaded = useRef(false);

  const WALLET_STORAGE_KEY = "floe_active_wallet";

  /* ================================
     LOAD WALLETS
  ================================= */

  const loadWallets = async () => {
    const res = await authFetch("/api/wallets/list", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      setWallets([]);
      setActiveWallet(null);
      return;
    }

    const data = await res.json();

    setWallets(data);

    const savedId =
      typeof window !== "undefined"
        ? localStorage.getItem(WALLET_STORAGE_KEY)
        : null;

    if (savedId) {
      const savedWallet = data.find((w: Wallet) => w.id === savedId);

      if (savedWallet) {
        setActiveWallet(savedWallet);
        return;
      }
    }

    setActiveWallet(data[0] || null);
  };

  /* ================================
     FIRST LOAD
  ================================= */

  useEffect(() => {
    if (hasLoaded.current) return;

    hasLoaded.current = true;

    loadWallets();
  }, [userId]);

  /* ================================
     STORAGE SYNC (multi tab)
  ================================= */

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === WALLET_STORAGE_KEY && e.newValue) {
        const wallet = wallets.find((w) => w.id === e.newValue);

        if (wallet) setActiveWallet(wallet);
      }
    };

    window.addEventListener("storage", handler);

    return () => window.removeEventListener("storage", handler);
  }, [wallets]);

  /* ================================
     CONTEXT VALUE
  ================================= */

  return (
    <WalletContext.Provider
      value={{
        wallets,
        activeWallet,
        setActiveWallet,
        reloadWallets: loadWallets,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

/* ================================
   HOOK
================================= */

export function useWallet() {
  const ctx = useContext(WalletContext);

  if (!ctx) {
    throw new Error("useWallet must be used inside WalletProvider");
  }

  return ctx;
}
