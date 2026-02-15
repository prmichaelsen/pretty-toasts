/**
 * Style helper functions for toast components
 * Converts Tailwind classes to inline React styles
 */

import React from 'react';
import type { ToastType } from '../types';
import type { PartialGradientConfig } from '../types/theme';
import { useTheme } from '../hooks/ThemeContext';
import { toastGradients, progressBarGradients } from './colors';

/**
 * Hook to get background gradient style for toast
 * Uses theme context for customizable colors
 */
export const useToastBackgroundStyle = (
  type: ToastType,
  override?: PartialGradientConfig
): React.CSSProperties => {
  const { theme } = useTheme();
  const gradient = override || theme.toast[type];
  
  return {
    background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
    opacity: gradient.opacity ?? 0.9,
  };
};

/**
 * Hook to get progress bar gradient style
 * Uses theme context for customizable colors
 */
export const useProgressBarStyle = (
  type: ToastType,
  progress: number
): React.CSSProperties => {
  const { theme } = useTheme();
  const gradient = theme.progressBar[type];
  
  return {
    width: `${progress}%`,
    background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
    height: '4px',
    transition: 'width 100ms linear',
  };
};

// Legacy exports for backward compatibility (deprecated)
/** @deprecated Use useToastBackgroundStyle hook instead */
export const getToastBackgroundStyle = (type: ToastType): React.CSSProperties => {
  // This will use default theme since it's called outside React context
  const gradient = toastGradients[type];
  return {
    background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
    opacity: gradient.opacity,
  };
};

/** @deprecated Use useProgressBarStyle hook instead */
export const getProgressBarStyle = (
  type: ToastType,
  progress: number
): React.CSSProperties => {
  // This will use default theme since it's called outside React context
  const gradient = progressBarGradients[type];
  return {
    width: `${progress}%`,
    background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
    height: '4px',
    transition: 'width 100ms linear',
  };
};

/**
 * Get toast container positioning style
 */
export const getToastContainerStyle = (isDesktop: boolean): React.CSSProperties => {
  return {
    position: 'fixed',
    bottom: '1rem',
    right: isDesktop ? '1rem' : '0',
    left: isDesktop ? 'auto' : '0',
    width: isDesktop ? '33vw' : '100%',
    minWidth: isDesktop ? '320px' : 'auto',
    maxWidth: isDesktop ? '500px' : 'auto',
    zIndex: 9999,
    pointerEvents: 'none',
  };
};

/**
 * Common toast card styles
 */
export const toastCardStyle: React.CSSProperties = {
  borderRadius: '0.5rem',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(4px)',
  pointerEvents: 'auto',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

/**
 * Toast content container styles
 */
export const toastContentStyle: React.CSSProperties = {
  padding: '1rem',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
};

/**
 * Toast text container styles
 */
export const toastTextStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

/**
 * Toast title styles
 */
export const toastTitleStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: 1.25,
};

/**
 * Toast message styles
 */
export const toastMessageStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '0.875rem',
  lineHeight: 1.25,
};

/**
 * Close button styles
 */
export const closeButtonStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.8)',
  background: 'transparent',
  border: 'none',
  padding: '0.25rem',
  cursor: 'pointer',
  borderRadius: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
};

/**
 * Close button hover styles
 */
export const closeButtonHoverStyle: React.CSSProperties = {
  ...closeButtonStyle,
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
};

/**
 * Progress bar container styles
 */
export const progressBarContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderBottomLeftRadius: '0.5rem',
  borderBottomRightRadius: '0.5rem',
  overflow: 'hidden',
};
