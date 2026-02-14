/**
 * Pretty Toasts - Standalone Mode (No Redux)
 * Use this entry point if you don't use Redux
 * 
 * @packageDocumentation
 */

// Types
export type { ToastType, ToastOptions, ToastState, ToastActions } from './types';
export type { Toast as ToastObject } from './types';

// Core Components
export { Toast } from './components/Toast';
export { ToastContainer } from './components/ToastContainer';

/**
 * Standalone toast container (no Redux required)
 * Must be used within ToastProvider
 */
export { StandaloneToastContainer } from './components/StandaloneToastContainer';

// Hooks
/**
 * Universal toast hook - auto-detects standalone mode
 */
export { useToast } from './hooks/useToast';

/**
 * Media query hook for responsive behavior
 */
export { useMediaQuery } from './hooks/useMediaQuery';

// Standalone Context Provider
/**
 * Context provider for standalone mode (no Redux)
 * Wrap your app with this to use toasts without Redux
 */
export { ToastProvider, useToastContext } from './hooks/ToastContext';
