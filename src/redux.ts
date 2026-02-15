/**
 * Pretty Toasts - Redux Mode
 * Use this entry point if you use Redux Toolkit
 *
 * @packageDocumentation
 */

// Types
export type { ToastType, ToastOptions, ToastState, ToastActions } from './types';
export type { Toast as ToastObject } from './types';

// Theme Types
/**
 * Theme types for customizing toast gradients
 */
export type {
  GradientConfig,
  PartialGradientConfig,
  ToastTheme,
  ProgressBarTheme,
  CompleteTheme,
  ResolvedTheme,
} from './types/theme';

// Core Components
export { Toast } from './components/Toast';
export { ToastContainer } from './components/ToastContainer';

/**
 * Redux-connected toast container
 * Automatically connects to Redux store - use with Redux Toolkit
 */
export { ReduxToastContainer } from './components/ReduxToastContainer';

// Redux Toolkit slice
/**
 * Redux Toolkit slice reducer for toast state
 * Add to your Redux store under the 'prettyToasts' key
 */
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
/**
 * Redux toast hook - uses Redux Toolkit
 * Must be used within Redux Provider with toastReducer
 */
export { useToast } from './hooks/useToastRedux';

/**
 * Media query hook for responsive behavior
 */
export { useMediaQuery } from './hooks/useMediaQuery';
