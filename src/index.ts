// Types
export type { Toast, ToastType, ToastOptions, ToastState, ToastActions } from './types';

// Components
export { Toast } from './components/Toast';
export { ToastContainer } from './components/ToastContainer';

// Redux (optional - only if @reduxjs/toolkit is installed)
export {
  default as toastReducer,
  addToast,
  updateToast,
  removeToast,
  pauseToast,
  resumeToast,
  makeToastPermanent,
  clearAllToasts,
  selectToasts,
  selectActiveToasts,
  selectPermanentToasts,
} from './store/toastSlice';

// Hooks
export { useToast } from './hooks/useToast';

// Standalone Context Provider (for non-Redux users)
export { ToastProvider, useToastContext } from './hooks/ToastContext';
