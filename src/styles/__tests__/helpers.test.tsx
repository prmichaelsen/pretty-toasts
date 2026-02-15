import { renderHook } from '@testing-library/react';
import { useToastBackgroundStyle, useProgressBarStyle } from '../helpers';
import { ThemeProvider } from '../../hooks/ThemeContext';
import type { ToastType } from '../../types';

describe('Style Helpers', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  describe('useToastBackgroundStyle', () => {
    it('should return success gradient style', () => {
      const { result } = renderHook(() => useToastBackgroundStyle('success'), { wrapper });
      
      expect(result.current.background).toContain('linear-gradient');
      expect(result.current.background).toContain('rgb');
    });

    it('should return error gradient style', () => {
      const { result } = renderHook(() => useToastBackgroundStyle('error'), { wrapper });
      
      expect(result.current.background).toContain('linear-gradient');
      expect(result.current.background).toContain('rgb');
    });

    it('should return warning gradient style', () => {
      const { result } = renderHook(() => useToastBackgroundStyle('warning'), { wrapper });
      
      expect(result.current.background).toContain('linear-gradient');
      expect(result.current.background).toContain('rgb');
    });

    it('should return info gradient style', () => {
      const { result } = renderHook(() => useToastBackgroundStyle('info'), { wrapper });
      
      expect(result.current.background).toContain('linear-gradient');
      expect(result.current.background).toContain('rgb');
    });
  });

  describe('useProgressBarStyle', () => {
    it('should return success progress bar style', () => {
      const { result } = renderHook(() => useProgressBarStyle('success', 50), { wrapper });
      
      expect(result.current.width).toBe('50%');
      expect(result.current.background).toContain('linear-gradient');
    });

    it('should return error progress bar style', () => {
      const { result } = renderHook(() => useProgressBarStyle('error', 75), { wrapper });
      
      expect(result.current.width).toBe('75%');
      expect(result.current.background).toContain('linear-gradient');
    });

    it('should return warning progress bar style', () => {
      const { result } = renderHook(() => useProgressBarStyle('warning', 25), { wrapper });
      
      expect(result.current.width).toBe('25%');
      expect(result.current.background).toContain('linear-gradient');
    });

    it('should return info progress bar style', () => {
      const { result } = renderHook(() => useProgressBarStyle('info', 100), { wrapper });
      
      expect(result.current.width).toBe('100%');
      expect(result.current.background).toContain('linear-gradient');
    });

    it('should handle 0% progress', () => {
      const { result } = renderHook(() => useProgressBarStyle('success', 0), { wrapper });
      
      expect(result.current.width).toBe('0%');
    });

    it('should handle 100% progress', () => {
      const { result } = renderHook(() => useProgressBarStyle('success', 100), { wrapper });
      
      expect(result.current.width).toBe('100%');
    });
  });
});
