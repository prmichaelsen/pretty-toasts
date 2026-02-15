/**
 * Theme context for customizing toast gradients
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { CompleteTheme, ResolvedTheme } from '../types/theme';
import type { ToastType } from '../types';
import { defaultTheme } from '../styles/defaultTheme';

interface ThemeContextValue {
  theme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
});

/**
 * Hook to access the current theme
 */
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  theme?: CompleteTheme;
  children: React.ReactNode;
}

/**
 * Theme provider for customizing toast gradients
 * 
 * @example
 * ```tsx
 * const customTheme = {
 *   toast: {
 *     success: {
 *       from: '#10b981',
 *       to: '#3b82f6',
 *       opacity: 0.95,
 *     },
 *   },
 * };
 * 
 * <ThemeProvider theme={customTheme}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  theme: userTheme = {}, 
  children 
}) => {
  const resolvedTheme = useMemo((): ResolvedTheme => {
    return {
      toast: {
        success: {
          from: userTheme.toast?.success?.from ?? defaultTheme.toast.success.from,
          to: userTheme.toast?.success?.to ?? defaultTheme.toast.success.to,
          opacity: userTheme.toast?.success?.opacity ?? defaultTheme.toast.success.opacity,
        },
        error: {
          from: userTheme.toast?.error?.from ?? defaultTheme.toast.error.from,
          to: userTheme.toast?.error?.to ?? defaultTheme.toast.error.to,
          opacity: userTheme.toast?.error?.opacity ?? defaultTheme.toast.error.opacity,
        },
        warning: {
          from: userTheme.toast?.warning?.from ?? defaultTheme.toast.warning.from,
          to: userTheme.toast?.warning?.to ?? defaultTheme.toast.warning.to,
          opacity: userTheme.toast?.warning?.opacity ?? defaultTheme.toast.warning.opacity,
        },
        info: {
          from: userTheme.toast?.info?.from ?? defaultTheme.toast.info.from,
          to: userTheme.toast?.info?.to ?? defaultTheme.toast.info.to,
          opacity: userTheme.toast?.info?.opacity ?? defaultTheme.toast.info.opacity,
        },
      },
      progressBar: {
        success: {
          from: userTheme.progressBar?.success?.from ?? defaultTheme.progressBar.success.from,
          to: userTheme.progressBar?.success?.to ?? defaultTheme.progressBar.success.to,
        },
        error: {
          from: userTheme.progressBar?.error?.from ?? defaultTheme.progressBar.error.from,
          to: userTheme.progressBar?.error?.to ?? defaultTheme.progressBar.error.to,
        },
        warning: {
          from: userTheme.progressBar?.warning?.from ?? defaultTheme.progressBar.warning.from,
          to: userTheme.progressBar?.warning?.to ?? defaultTheme.progressBar.warning.to,
        },
        info: {
          from: userTheme.progressBar?.info?.from ?? defaultTheme.progressBar.info.from,
          to: userTheme.progressBar?.info?.to ?? defaultTheme.progressBar.info.to,
        },
      },
    };
  }, [userTheme]);

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
