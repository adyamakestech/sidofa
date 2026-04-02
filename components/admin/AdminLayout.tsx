"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Wallet,
  LogOut,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  Check,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";

import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/currency";
import { useLoading } from "@/context/LoadingContext";
import { withLoading } from "@/lib/with-loading";
import { MENU_ITEMS } from "@/components/admin/Menu";

interface Props {
  children: React.ReactNode;
}

interface Wallet {
  id: string;
  name: string;
  balance: number;
}

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const currentPath = pathname;

  const { user } = useAuth();
  const { wallets, activeWallet, setActiveWallet } = useWallet();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [walletDropdown, setWalletDropdown] = useState(false);

  const walletRef = useRef<HTMLDivElement | null>(null);

  const { startLoading, stopLoading } = useLoading();

  const WALLET_STORAGE_KEY = "floe_active_wallet";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (walletRef.current && !walletRef.current.contains(e.target as Node)) {
        setWalletDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  const handleWalletChange = async (wallet: Wallet) => {
    if (wallet.id === activeWallet?.id) {
      setWalletDropdown(false);
      return;
    }

    await withLoading(
      async () => {
        setActiveWallet(wallet);

        if (typeof window !== "undefined") {
          localStorage.setItem(WALLET_STORAGE_KEY, wallet.id);
        }
      },
      {
        startLoading,
        stopLoading,
        minDuration: 600,
      },
    );

    setWalletDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/auth/login";
    }
  };

  const visibleMenus = useMemo(() => {
    return MENU_ITEMS.map((item) => {
      if (item.roles) {
        if (!user?.role || !item.roles.includes(user.role)) {
          return null;
        }
      }

      if (!item.children) return item;

      const visibleChildren = item.children.filter((sub) => {
        if (!sub.roles) return true;
        return user?.role && sub.roles.includes(user.role);
      });

      if (visibleChildren.length === 0) return null;

      return {
        ...item,
        children: visibleChildren,
      };
    }).filter(Boolean);
  }, [user]);

  const navigateWithLoading = async (href: string) => {
    if (pathname === href) return;

    await withLoading(
      async () => {
        router.push(href);

        if (window.innerWidth < 768) {
          setSidebarOpen(false);
        }
      },
      {
        startLoading,
        stopLoading,
        minDuration: 600,
      },
    );
  };

  const getBreadcrumb = () => {
    return pathname
      .split("/")
      .filter(Boolean)
      .filter((seg) => !/^[0-9a-fA-F-]{36}$/.test(seg)) // skip uuid
      .slice(0, 3) // maksimal 3 level
      .map((seg) =>
        seg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      );
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed left-0 top-0 z-40
        h-screen w-72 md:w-64
        bg-[var(--color-surface)]
        border-r border-[var(--color-border)]
        shadow-[4px_0_24px_rgba(59,158,218,0.08)]
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* LOGO */}
          <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color-primary)] shadow-sm">
                <TrendingUp size={18} className="text-white" />
              </div>

              <span className="text-lg font-bold tracking-tight text-[var(--color-text)]">
                floe
              </span>
            </div>
          </div>

          {/* MENU */}
          <nav className="flex-1 px-4 py-6 md:py-8 space-y-2 overflow-y-auto">
            {visibleMenus.map((item: any) => {
              const Icon = item.icon;

              if (!item.children) {
                const active =
                  item.href === "/dashboard"
                    ? currentPath === "/dashboard"
                    : currentPath.startsWith(item.href);

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => navigateWithLoading(item.href)}
                    className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                    ${
                      active
                        ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-subtle)]"
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              }

              const isChildActive = item.children.some((sub: any) =>
                currentPath.startsWith(sub.href),
              );

              const isOpen = openMenu === item.label || isChildActive;

              return (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${
                      isOpen
                        ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-subtle)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={20} />
                      {item.label}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-6 mt-2 space-y-1 border-l border-[var(--color-border)] pl-3">
                      {item.children.map((sub: any) => {
                        const active = currentPath.startsWith(sub.href);

                        return (
                          <button
                            key={sub.label}
                            type="button"
                            onClick={() => navigateWithLoading(sub.href)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                            ${
                              active
                                ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium"
                                : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-subtle)]"
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* USER */}
          <div className="px-5 py-4 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center font-semibold text-[var(--color-primary)]">
                  {user?.name?.charAt(0) || "U"}
                </div>

                <div className="leading-tight">
                  <p className="text-sm font-semibold">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {user?.role || "User"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-ghost text-red-500"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN COLUMN */}
      <div className="flex flex-col flex-1 md:ml-64 min-h-screen">
        {/* HEADER */}
        <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4 md:px-6 z-30 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="block md:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="btn btn-ghost"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
            <h1 className="text-sm md:text-base text-[var(--color-text-muted)] font-medium">
              {getBreadcrumb().join(" / ")}
            </h1>
          </div>

          {/* WALLET SWITCHER */}
          <div ref={walletRef} className="relative">
            <button
              onClick={() => setWalletDropdown(!walletDropdown)}
              className="btn btn-soft flex items-center gap-3 w-44 justify-between h-11"
            >
              <div className="flex items-center gap-3">
                <Wallet size={18} />

                <div className="flex flex-col leading-tight text-left">
                  <span className="text-sm font-semibold truncate max-w-[120px] md:max-w-[140px]">
                    {activeWallet?.name || "Pilih Dompet"}
                  </span>

                  <span className="text-xs text-[var(--color-text-muted)]">
                    {activeWallet ? formatCurrency(activeWallet.balance) : "-"}
                  </span>
                </div>
              </div>

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  walletDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {walletDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-[0_12px_30px_rgba(59,158,218,0.15)] overflow-hidden z-50">
                {wallets.map((w) => {
                  const isActive = w.id === activeWallet?.id;

                  return (
                    <button
                      key={w.id}
                      onClick={() => handleWalletChange(w)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition
                      ${
                        isActive
                          ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                          : "hover:bg-[var(--color-primary-subtle)]"
                      }`}
                    >
                      <Check
                        size={14}
                        className={`${isActive ? "opacity-100" : "opacity-0"}`}
                      />

                      <span className="font-medium">{w.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 mt-16 overflow-y-auto">
          <div className="px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
