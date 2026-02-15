/**
 * Default theme for toast notifications
 * These match the original Tailwind colors
 */

import type { ToastTheme, ProgressBarTheme, ResolvedTheme } from '../types/theme';

/**
 * Default toast background gradients
 */
export const defaultToastTheme: Record<'success' | 'error' | 'warning' | 'info', Required<import('../types/theme').GradientConfig>> = {
  success: {
    from: 'rgb(168, 85, 247)',  // purple-500
    to: 'rgb(99, 102, 241)',    // indigo-500
    opacity: 0.9,
  },
  error: {
    from: 'rgb(168, 85, 247)',  // purple-500
    to: 'rgb(244, 63, 94)',     // rose-500
    opacity: 0.9,
  },
  warning: {
    from: 'rgb(168, 85, 247)',  // purple-500
    to: 'rgb(249, 115, 22)',    // orange-500
    opacity: 0.9,
  },
  info: {
    from: 'rgb(59, 130, 246)',  // blue-500
    to: 'rgb(168, 85, 247)',    // purple-500
    opacity: 0.9,
  },
};

/**
 * Default progress bar gradients
 */
export const defaultProgressBarTheme: Record<'success' | 'error' | 'warning' | 'info', Omit<import('../types/theme').GradientConfig, 'opacity'>> = {
  success: {
    from: 'rgb(192, 132, 252)',  // purple-400
    to: 'rgb(129, 140, 248)',    // indigo-400
  },
  error: {
    from: 'rgb(192, 132, 252)',  // purple-400
    to: 'rgb(251, 113, 133)',    // rose-400
  },
  warning: {
    from: 'rgb(192, 132, 252)',  // purple-400
    to: 'rgb(251, 146, 60)',     // orange-400
  },
  info: {
    from: 'rgb(96, 165, 250)',   // blue-400
    to: 'rgb(192, 132, 252)',    // purple-400
  },
};

/**
 * Complete default theme with all values resolved
 */
export const defaultTheme: ResolvedTheme = {
  toast: defaultToastTheme,
  progressBar: defaultProgressBarTheme,
};
