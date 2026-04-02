import { LayoutDashboard, Wallet, FileText, Settings } from "lucide-react";

export const MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["development"],
  },
  {
    label: "Arus Kas",
    icon: Wallet,
    children: [
      {
        label: "Dompet",
        href: "/dashboard/arus-kas/dompet",
        roles: ["admin", "development"],
      },
      {
        label: "Uang Masuk",
        href: "/dashboard/arus-kas/uang-masuk",
        roles: ["development"],
      },
      {
        label: "Uang Keluar",
        href: "/dashboard/arus-kas/uang-keluar",
        roles: ["development"],
      },
    ],
  },
  {
    label: "Faktur",
    href: "/dashboard/faktur",
    icon: FileText,
    roles: ["development"],
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
