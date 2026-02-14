export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // in milliseconds, default 10000
  progress?: number; // 0-100
  isPaused?: boolean;
  isPermanent?: boolean;
  createdAt: number;
}

export interface ToastOptions {
  id?: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  progress?: number;
}

export interface ToastState {
  toasts: Toast[];
}

export interface ToastActions {
  addToast: (options: ToastOptions) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  removeToast: (id: string) => void;
  pauseToast: (id: string) => void;
  resumeToast: (id: string) => void;
  makeToastPermanent: (id: string) => void;
  clearAllToasts: () => void;
}
