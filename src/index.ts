/**
 * Pretty Toasts - Beautiful gradient toast notifications for React
 *
 * @packageDocumentation
 */

// Types
/**
 * Toast notification object type
 */
export type { ToastType, ToastOptions, ToastState, ToastActions } from './types';
export type { Toast as ToastObject } from './types';

// Core Components
/**
 * Individual toast component with gradient styling and interactions
 */
export { Toast } from './components/Toast';

/**
 * Container component that manages toast positioning and animations
 * Use ReduxToastContainer or StandaloneToastContainer instead for automatic integration
 */
export { ToastContainer } from './components/ToastContainer';

/**
 * Redux-connected toast container
 * Automatically connects to Redux store - use with Redux Toolkit
 * @example
 * ```tsx
 * import { ReduxToastContainer } from 'pretty-toasts';
 *
 * function App() {
 *   return (
 *     <Provider store={store}>
 *       <ReduxToastContainer />
 *     </Provider>
 *   );
 * }
 * ```
 */
export { ReduxToastContainer } from './components/ReduxToastContainer';

/**
 * Standalone toast container (no Redux required)
 * Must be used within ToastProvider
 * @example
 * ```tsx
 * import { ToastProvider, StandaloneToastContainer } from 'pretty-toasts';
 *
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <StandaloneToastContainer />
 *     </ToastProvider>
 *   );
 * }
 * ```
 */
export { StandaloneToastContainer } from './components/StandaloneToastContainer';

// Redux (optional - only if @reduxjs/toolkit is installed)
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
 * Universal toast hook - works with both Redux and standalone modes
 * Automatically detects which mode is available
 * @example
 * ```tsx
 * const { success, error, warning, info } = useToast();
 *
 * success({ title: 'Success!', message: 'It worked!' });
 * ```
 */
export { useToast } from './hooks/useToast';

/**
 * Media query hook for responsive behavior
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery('(min-width: 640px)');
 * ```
 */
export { useMediaQuery } from './hooks/useMediaQuery';

// Standalone Context Provider (for non-Redux users)
/**
 * Context provider for standalone mode (no Redux)
 * Wrap your app with this to use toasts without Redux
 */
export { ToastProvider, useToastContext } from './hooks/ToastContext';
