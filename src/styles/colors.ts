/**
 * Color definitions for toast gradients
 * These match the exact Tailwind colors used previously
 */

import type { ToastType } from '../types';

export interface GradientColors {
  from: string;
  to: string;
  opacity: number;
}

export const toastGradients: Record<ToastType, GradientColors> = {
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
    from: 'rgb(245, 158, 11)',  // amber-500
    to: 'rgb(249, 115, 22)',    // orange-500
    opacity: 0.9,
  },
  info: {
    from: 'rgb(59, 130, 246)',  // blue-500
    to: 'rgb(168, 85, 247)',    // purple-500
    opacity: 0.9,
  },
};

export const progressBarGradients: Record<ToastType, Omit<GradientColors, 'opacity'>> = {
  success: {
    from: 'rgb(192, 132, 252)',  // purple-400
    to: 'rgb(129, 140, 248)',    // indigo-400
  },
  error: {
    from: 'rgb(192, 132, 252)',  // purple-400
    to: 'rgb(251, 113, 133)',    // rose-400
  },
  warning: {
    from: 'rgb(251, 191, 36)',   // amber-400
    to: 'rgb(251, 146, 60)',     // orange-400
  },
  info: {
    from: 'rgb(96, 165, 250)',   // blue-400
    to: 'rgb(192, 132, 252)',    // purple-400
  },
};
