import { useCallback } from 'react';
import type { ToastOptions } from '../types';
import { useToastContext } from './ToastContext';

interface UseToastReturn {
  toast: (options: ToastOptions) => void;
  success: (options: Omit<ToastOptions, 'type'>) => void;
  error: (options: Omit<ToastOptions, 'type'>) => void;
  warning: (options: Omit<ToastOptions, 'type'>) => void;
  info: (options: Omit<ToastOptions, 'type'>) => void;
}

/**
 * Standalone toast hook - uses React Context only
 * Must be used within a ToastProvider
 */
export const useToast = (): UseToastReturn => {
  const { addToast } = useToastContext();

  const toast = useCallback(
    (options: ToastOptions) => {
      addToast(options);
    },
    [addToast]
  );

  const success = useCallback(
    (options: Omit<ToastOptions, 'type'>) => {
      toast({ ...options, type: 'success' });
    },
    [toast]
  );

  const error = useCallback(
    (options: Omit<ToastOptions, 'type'>) => {
      toast({ ...options, type: 'error' });
    },
    [toast]
  );

  const warning = useCallback(
    (options: Omit<ToastOptions, 'type'>) => {
      toast({ ...options, type: 'warning' });
    },
    [toast]
  );

  const info = useCallback(
    (options: Omit<ToastOptions, 'type'>) => {
      toast({ ...options, type: 'info' });
    },
    [toast]
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
  };
};
