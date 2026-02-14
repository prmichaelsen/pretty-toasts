import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { ToastOptions } from '../types';
import { addToast } from '../store/toastSlice';

interface UseToastReturn {
  toast: (options: ToastOptions) => void;
  success: (options: Omit<ToastOptions, 'type'>) => void;
  error: (options: Omit<ToastOptions, 'type'>) => void;
  warning: (options: Omit<ToastOptions, 'type'>) => void;
  info: (options: Omit<ToastOptions, 'type'>) => void;
}

/**
 * Redux toast hook - uses Redux Toolkit
 * Must be used within a Redux Provider with toastReducer
 */
export const useToast = (): UseToastReturn => {
  const dispatch = useDispatch();

  const toast = useCallback(
    (options: ToastOptions) => {
      dispatch(addToast(options));
    },
    [dispatch]
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
