import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { LoadingProvider } from "@/context/LoadingContext";
import GlobalLoading from "@/components/GlobalLoading";
import RouteLoading from "@/components/RouteLoading";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Floe — Invoice & Arus Kas Bisnis",
  description:
    "Floe adalah aplikasi untuk membuat invoice, memantau pembayaran, dan mengelola arus kas bisnis dengan mudah.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`
          ${plusJakartaSans.variable}
          antialiased
          bg-[var(--bg-main)]
          text-[var(--text-primary)]
          font-[family-name:var(--font-plus-jakarta-sans)]
        `}
      >
        <LoadingProvider>
          {/* Trigger loading saat route berubah */}
          <RouteLoading />
          {children}
          {/* Global loading overlay */}
          <GlobalLoading />
        </LoadingProvider>
      </body>
    </html>
  );
}
