import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

type ToastType = "success" | "warning" | "error" | "info";

interface ToastOptions {
  title: string;
  type?: ToastType;
  timer?: number;
}

const colors: Record<ToastType, { icon: string; accent: string }> = {
  success: {
    icon: "var(--color-soft-green)",
    accent: "#2e6f5b",
  },
  warning: {
    icon: "var(--color-soft-yellow)",
    accent: "#7a5b22",
  },
  error: {
    icon: "var(--color-soft-red)",
    accent: "#8a3d3d",
  },
  info: {
    icon: "var(--color-soft-blue)",
    accent: "#2c5a9e",
  },
};

export const showToast = ({
  title,
  type = "success",
  timer = 2200,
}: ToastOptions) => {
  const { icon, accent } = colors[type];

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: type,
    title,
    timer,
    showConfirmButton: false,
    timerProgressBar: true,

    background: "var(--color-surface)",
    color: "var(--color-text)",

    iconColor: accent,

    customClass: {
      popup: "soft-toast",
      title: "soft-toast-title",
      timerProgressBar: "soft-toast-progress",
    },
  });
};

interface ConfirmOptions {
  title: string;
  confirmText?: string;
  cancelText?: string;
}

export const confirmToast = async ({
  title,
  confirmText = "Ya",
  cancelText = "Batal",
}: ConfirmOptions) => {
  const result = await Swal.fire({
    title,
    icon: "warning",

    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,

    reverseButtons: true,
    focusCancel: true,

    background: "var(--color-surface)",
    color: "var(--color-text)",

    confirmButtonColor: "#f47c7c",
    cancelButtonColor: "#6e8fa8",

    customClass: {
      popup: "soft-toast",
    },
  });

  return result.isConfirmed;
};

export const toastCreate = (title = "Data berhasil dibuat") =>
  showToast({ title, type: "success" });

export const toastUpdate = (title = "Data berhasil diperbarui") =>
  showToast({ title, type: "success" });

export const toastDelete = (title = "Data berhasil dihapus") =>
  showToast({ title, type: "success" });

export const toastFail = (title = "Terjadi kesalahan") =>
  showToast({ title, type: "error" });

export const toastInfo = (title: string) => showToast({ title, type: "info" });

export const toastWarning = (title: string) =>
  showToast({ title, type: "warning" });
