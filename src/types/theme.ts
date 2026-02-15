/**
 * Theme types for customizing toast gradients
 */

import type { ToastType } from './index';

/**
 * Gradient configuration for a toast or progress bar
 */
export interface GradientConfig {
  /** Starting color (CSS color: hex, rgb, hsl) */
  from: string;
  /** Ending color (CSS color: hex, rgb, hsl) */
  to: string;
  /** Opacity (0-1), default 0.9 */
  opacity: number;
}

/**
 * Partial gradient configuration (for user input)
 */
export interface PartialGradientConfig {
  /** Starting color (CSS color: hex, rgb, hsl) */
  from: string;
  /** Ending color (CSS color: hex, rgb, hsl) */
  to: string;
  /** Opacity (0-1), default 0.9 */
  opacity?: number;
}

/**
 * Theme configuration for toast backgrounds (user input)
 */
export interface ToastTheme {
  success?: PartialGradientConfig;
  error?: PartialGradientConfig;
  warning?: PartialGradientConfig;
  info?: PartialGradientConfig;
}

/**
 * Theme configuration for progress bars (user input)
 */
export interface ProgressBarTheme {
  success?: Omit<PartialGradientConfig, 'opacity'>;
  error?: Omit<PartialGradientConfig, 'opacity'>;
  warning?: Omit<PartialGradientConfig, 'opacity'>;
  info?: Omit<PartialGradientConfig, 'opacity'>;
}

/**
 * Complete theme configuration
 */
export interface CompleteTheme {
  /** Toast background gradients */
  toast?: ToastTheme;
  /** Progress bar gradients */
  progressBar?: ProgressBarTheme;
}

/**
 * Internal theme with all values resolved
 */
export type ResolvedTheme = {
  toast: Record<ToastType, Required<GradientConfig>>;
  progressBar: Record<ToastType, Omit<GradientConfig, 'opacity'>>;
};
