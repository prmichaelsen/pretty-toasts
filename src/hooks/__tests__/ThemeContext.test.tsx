import { renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { defaultTheme } from '../../styles/defaultTheme';

describe('ThemeContext', () => {
  it('should provide default theme', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toEqual(defaultTheme);
  });

  it('should provide custom theme', () => {
    const customTheme = {
      toast: {
        success: {
          from: '#10b981',
          to: '#3b82f6',
          opacity: 0.95,
        },
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.toast.success.from).toBe('#10b981');
    expect(result.current.theme.toast.success.to).toBe('#3b82f6');
  });

  it('should merge custom theme with defaults', () => {
    const partialTheme = {
      toast: {
        success: {
          from: '#custom',
          to: '#color',
        },
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider theme={partialTheme}>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Custom values
    expect(result.current.theme.toast.success.from).toBe('#custom');
    expect(result.current.theme.toast.success.to).toBe('#color');
    
    // Default values for other types
    expect(result.current.theme.toast.error).toEqual(defaultTheme.toast.error);
    expect(result.current.theme.toast.warning).toEqual(defaultTheme.toast.warning);
    expect(result.current.theme.toast.info).toEqual(defaultTheme.toast.info);
  });
});
