"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Wallet,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./admin.css";
import { AuthProvider } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
}

/* ================= MENU CONFIG ================= */
const MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Arus Kas",
    icon: Wallet,
    children: [
      {
        label: "Dompet",
        href: "/dashboard/dompet",
        roles: ["development"],
      },
      {
        label: "Uang Masuk",
        href: "/dashboard/uang-masuk",
        roles: ["development"],
      },
      {
        label: "Uang Keluar",
        href: "/dashboard/uang-keluar",
        roles: ["development"],
      },
    ],
  },

  {
    label: "Faktur",
    href: "/dashboard/faktur",
    icon: FileText,
  },

  {
    label: "Pengaturan",
    icon: Settings,
    children: [
      {
        label: "Preferensi",
        href: "/dashboard/settings/preferensi",
        roles: ["development"],
      },
      {
        label: "Layanan",
        href: "/dashboard/settings/layanan",
        roles: ["development"],
      },
    ],
  },
];

export default function AdminLayout({ children }: Props) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [walletDropdown, setWalletDropdown] = useState(false);
  const [wallet, setWallet] = useState("Dompet Utama");
  const [user, setUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);

  /* ================= WALLET ================= */

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) setWallet(savedWallet);
  }, []);

  /* ================= AUTH ================= */

  useEffect(() => {
    const initAuth = async () => {
      const me = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (me.ok) {
        const data = await me.json();
        setUser(data);
        setAuthReady(true);
        return;
      }

      const refresh = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refresh.ok) {
        window.location.href = "/login";
        return;
      }

      const meRetry = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!meRetry.ok) {
        window.location.href = "/login";
        return;
      }

      const data = await meRetry.json();
      setUser(data);
      setAuthReady(true);
    };

    initAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/login";
    }
  };

  /* ================= FILTER MENU ================= */
  const visibleMenus = MENU_ITEMS.map((item) => {
    if (!item.children) return item;

    const visibleChildren = item.children.filter((sub) => {
      // jika tidak ada roles → publish ke semua
      if (!sub.roles) return true;

      // jika ada roles → cek role user
      return user?.role && sub.roles.includes(user.role);
    });

    if (visibleChildren.length === 0) return null;

    return {
      ...item,
      children: visibleChildren,
    };
  }).filter(Boolean);

  if (!authReady) return null;

  return (
    <div className="min-h-screen overflow-hidden flex">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
        fixed left-0 top-0 z-40
        h-screen w-64
        bg-[var(--color-surface)]
        transition-all duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* LOGO */}

          <div className="h-16 flex items-center justify-center border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color-primary)]">
                <TrendingUp size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold">floe</span>
            </div>
          </div>

          {/* MENU */}

          <nav className="flex-1 px-4 py-8 space-y-4 overflow-y-auto">
            {visibleMenus.map((item: any) => {
              const Icon = item.icon;

              if (!item.children) {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    ${
                      active
                        ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-subtle)]"
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              }

              const isOpen =
                openMenu === item.label ||
                item.children.some((sub: any) => pathname.startsWith(sub.href));

              return (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
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
                    <div className="ml-6 mt-2 space-y-2">
                      {item.children.map((sub: any) => {
                        const active = pathname === sub.href;

                        return (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className={`block px-4 py-2 rounded-lg text-sm
                            ${
                              active
                                ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium"
                                : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-subtle)]"
                            }`}
                          >
                            {sub.label}
                          </Link>
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
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                {user?.name || "Loading..."}
              </span>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 h-screen">
        {/* HEADER */}
        <header
          className="
      fixed top-0 right-0
      h-16
      bg-[var(--color-surface)]
      border-b border-[var(--color-border)]
      flex items-center justify-between
      px-4 md:px-6 
      z-30
      left-0 md:left-64
    "
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-[var(--color-text-muted)]"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <h1 className="font-semibold text-base md:text-lg">Dashboard</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setWalletDropdown(!walletDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg
        border border-[var(--color-border)] text-sm font-medium
        transition-all duration-200 hover:border-[var(--color-primary)]
        hover:shadow-sm active:scale-[0.98]"
            >
              <Wallet size={18} />
              {wallet}
              <ChevronDown size={16} />
            </button>

            {walletDropdown && (
              <div
                className="absolute right-0 mt-2 w-44
          bg-[var(--color-surface)] border border-[var(--color-border)]
          rounded-xl shadow-lg overflow-hidden z-50"
              >
                {["Dompet Utama", "BCA", "Mandiri"].map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setWallet(w);
                      localStorage.setItem("wallet", w);
                      setWalletDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm
              transition hover:bg-[var(--color-primary-subtle)]
              hover:pl-5"
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <AuthProvider user={user}>
          <main className="flex-1 mt-16 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </AuthProvider>
      </div>
    </div>
  );
}
