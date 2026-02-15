import React from 'react';
import { ToastContainer } from './ToastContainer';
import { useToastContext } from '../hooks/ToastContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Standalone toast container (no Redux required)
 * Uses React Context for state management
 * Must be used within a ToastProvider
 */
export const StandaloneToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastContext();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  return (
    <ToastContainer
      toasts={toasts}
      onRemoveToast={removeToast}
      isDesktop={isDesktop}
    />
  );
};
