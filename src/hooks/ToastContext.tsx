import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Toast, ToastOptions, ToastActions } from '../types';
import type { CompleteTheme } from '../types/theme';
import { ThemeProvider } from './ThemeContext';

interface ToastContextValue extends ToastActions {
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
  theme?: CompleteTheme;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, theme }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    const { id, type, title, message, duration = 10000, progress } = options;
    const toastId = id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    setToasts((prev) => {
      const existingIndex = prev.findIndex((t) => t.id === toastId);
      if (existingIndex === -1) {
        const toast: Toast = {
          id: toastId,
          type,
          title,
          message,
          duration,
          progress,
          isPaused: false,
          isPermanent: false,
          createdAt: Date.now(),
        };
        return [...prev, toast];
      }
      return prev;
    });
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast))
    );
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pauseToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, isPaused: true } : toast))
    );
  }, []);

  const resumeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, isPaused: false } : toast))
    );
  }, []);

  const makeToastPermanent = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isPermanent: true, isPaused: true } : toast
      )
    );
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextValue = useMemo(() => ({
    toasts,
    addToast,
    updateToast,
    removeToast,
    pauseToast,
    resumeToast,
    makeToastPermanent,
    clearAllToasts,
  }), [toasts, addToast, updateToast, removeToast, pauseToast, resumeToast, makeToastPermanent, clearAllToasts]);

  return (
    <ThemeProvider theme={theme}>
      <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
    </ThemeProvider>
  );
};

export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
