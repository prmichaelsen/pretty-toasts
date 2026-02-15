import { renderHook } from '@testing-library/react';
import {
  useToastBackgroundStyle,
  useProgressBarStyle,
  toastCardStyle,
  toastContentStyle,
  toastTextStyle,
  toastTitleStyle,
  toastMessageStyle,
  closeButtonStyle,
  closeButtonHoverStyle,
  progressBarContainerStyle,
} from '../helpers';
import { ThemeProvider } from '../../hooks/ThemeContext';

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

    it('should use override gradient when provided', () => {
      const override = { from: 'rgb(255, 0, 0)', to: 'rgb(0, 0, 255)', opacity: 0.8 };
      const { result } = renderHook(() => useToastBackgroundStyle('success', override), { wrapper });
      
      expect(result.current.background).toContain('rgb(255, 0, 0)');
      expect(result.current.background).toContain('rgb(0, 0, 255)');
      expect(result.current.opacity).toBe(0.8);
    });

    it('should use default opacity when not specified in override', () => {
      const override = { from: 'rgb(255, 0, 0)', to: 'rgb(0, 0, 255)' };
      const { result } = renderHook(() => useToastBackgroundStyle('success', override), { wrapper });
      
      expect(result.current.opacity).toBe(0.9);
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

  describe('constant style exports', () => {
    it('should export toastCardStyle', () => {
      expect(toastCardStyle.borderRadius).toBe('0.5rem');
      expect(toastCardStyle.boxShadow).toBeDefined();
      expect(toastCardStyle.backdropFilter).toBe('blur(4px)');
      expect(toastCardStyle.pointerEvents).toBe('auto');
      expect(toastCardStyle.cursor).toBe('pointer');
    });

    it('should export toastContentStyle', () => {
      expect(toastContentStyle.padding).toBe('1rem');
      expect(toastContentStyle.display).toBe('flex');
      expect(toastContentStyle.alignItems).toBe('flex-start');
      expect(toastContentStyle.gap).toBe('0.75rem');
    });

    it('should export toastTextStyle', () => {
      expect(toastTextStyle.flex).toBe(1);
      expect(toastTextStyle.display).toBe('flex');
      expect(toastTextStyle.flexDirection).toBe('column');
      expect(toastTextStyle.gap).toBe('0.25rem');
    });

    it('should export toastTitleStyle', () => {
      expect(toastTitleStyle.color).toBe('#ffffff');
      expect(toastTitleStyle.fontSize).toBe('0.875rem');
      expect(toastTitleStyle.fontWeight).toBe(600);
      expect(toastTitleStyle.lineHeight).toBe(1.25);
    });

    it('should export toastMessageStyle', () => {
      expect(toastMessageStyle.color).toBe('rgba(255, 255, 255, 0.9)');
      expect(toastMessageStyle.fontSize).toBe('0.875rem');
      expect(toastMessageStyle.lineHeight).toBe(1.25);
    });

    it('should export closeButtonStyle', () => {
      expect(closeButtonStyle.color).toBe('rgba(255, 255, 255, 0.8)');
      expect(closeButtonStyle.background).toBe('transparent');
      expect(closeButtonStyle.border).toBe('none');
      expect(closeButtonStyle.cursor).toBe('pointer');
      expect(closeButtonStyle.display).toBe('flex');
    });

    it('should export closeButtonHoverStyle', () => {
      expect(closeButtonHoverStyle.color).toBe('#ffffff');
      expect(closeButtonHoverStyle.backgroundColor).toBe('rgba(255, 255, 255, 0.1)');
      expect(closeButtonHoverStyle.cursor).toBe('pointer');
    });

    it('should export progressBarContainerStyle', () => {
      expect(progressBarContainerStyle.position).toBe('absolute');
      expect(progressBarContainerStyle.bottom).toBe(0);
      expect(progressBarContainerStyle.left).toBe(0);
      expect(progressBarContainerStyle.right).toBe(0);
      expect(progressBarContainerStyle.height).toBe('4px');
      expect(progressBarContainerStyle.backgroundColor).toBe('rgba(255, 255, 255, 0.2)');
      expect(progressBarContainerStyle.overflow).toBe('hidden');
    });
  });
});
