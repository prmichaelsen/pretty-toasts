import { useCallback } from 'react';
import type { ToastOptions } from '../types';

// Try to import Redux hooks, but don't fail if they're not available
let useDispatch: any;
let addToastAction: any;

try {
  const redux = require('react-redux');
  const slice = require('../store/toastSlice');
  useDispatch = redux.useDispatch;
  addToastAction = slice.addToast;
} catch (e) {
  // Redux not available, will use context instead
}

// Try to import context, but don't fail if not available
let useToastContextImport: any;
try {
  const context = require('./ToastContext');
  useToastContextImport = context.useToastContext;
} catch (e) {
  // Context not available
}

interface UseToastReturn {
  toast: (options: ToastOptions) => void;
  success: (options: Omit<ToastOptions, 'type'>) => void;
  error: (options: Omit<ToastOptions, 'type'>) => void;
  warning: (options: Omit<ToastOptions, 'type'>) => void;
  info: (options: Omit<ToastOptions, 'type'>) => void;
}

export const useToast = (): UseToastReturn => {
  // Try Redux first
  let dispatch: any;
  if (useDispatch) {
    try {
      dispatch = useDispatch();
    } catch (e) {
      // Not in Redux context
    }
  }

  // Try standalone context if Redux not available
  let contextActions: any;
  if (!dispatch && useToastContextImport) {
    try {
      contextActions = useToastContextImport();
    } catch (e) {
      // Not in ToastProvider context
    }
  }

  // If neither is available, throw error
  if (!dispatch && !contextActions) {
    throw new Error(
      'useToast must be used within either a Redux Provider with toastReducer or a ToastProvider'
    );
  }

  const toast = useCallback(
    (options: ToastOptions) => {
      if (dispatch && addToastAction) {
        dispatch(addToastAction(options));
      } else if (contextActions) {
        contextActions.addToast(options);
      }
    },
    [dispatch, contextActions]
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
