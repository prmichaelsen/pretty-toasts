import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastContainer } from '../ToastContainer';
import type { Toast } from '../../types';
import { ThemeProvider } from '../../hooks/ThemeContext';

describe('ToastContainer', () => {
  const mockToast: Toast = {
    id: '1',
    title: 'Test Toast',
    message: 'Test message',
    type: 'success',
    duration: 10000,
    isPaused: false,
    isPermanent: false,
    progress: 100,
    createdAt: Date.now(),
  };

  const renderContainer = (toasts: Toast[] = [], isDesktop = true) => {
    const mockRemove = jest.fn();
    const result = render(
      <ThemeProvider>
        <ToastContainer
          toasts={toasts}
          onRemoveToast={mockRemove}
          isDesktop={isDesktop}
        />
      </ThemeProvider>
    );
    return { ...result, mockRemove };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render null when no toasts', () => {
      const { container } = renderContainer([]);
      expect(container.firstChild).toBeNull();
    });

    it('should render toast container with toasts', () => {
      renderContainer([mockToast]);
      expect(screen.getByText('Test Toast')).toBeTruthy();
    });

    it('should render multiple toasts', () => {
      const toasts: Toast[] = [
        { ...mockToast, id: '1', title: 'Toast 1' },
        { ...mockToast, id: '2', title: 'Toast 2' },
        { ...mockToast, id: '3', title: 'Toast 3' },
      ];
      renderContainer(toasts);
      expect(screen.getByText('Toast 1')).toBeTruthy();
      expect(screen.getByText('Toast 2')).toBeTruthy();
      expect(screen.getByText('Toast 3')).toBeTruthy();
    });

    it('should have correct container attributes', () => {
      renderContainer([mockToast]);
      const container = screen.getByLabelText('Notifications');
      expect(container.getAttribute('aria-live')).toBe('polite');
      expect(container.hasAttribute('data-toast-container')).toBe(true);
    });
  });

  describe('desktop vs mobile styling', () => {
    it('should apply desktop styles', () => {
      renderContainer([mockToast], true);
      const container = screen.getByLabelText('Notifications');
      expect(container.style.width).toBe('33vw');
      expect(container.style.left).toBe('auto');
      expect(container.style.maxWidth).toBe('33vw');
    });

    it('should apply mobile styles', () => {
      renderContainer([mockToast], false);
      const container = screen.getByLabelText('Notifications');
      expect(container.style.width).toBe('calc(100% - 1rem)');
      expect(container.style.left).toBe('0.5rem');
      expect(container.style.maxWidth).toBe('100%');
    });
  });

  describe('toast animations', () => {
    it('should add entering animation to new toasts', async () => {
      const { rerender, mockRemove } = renderContainer([]);
      
      // Add a toast
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={[mockToast]}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Toast')).toBeTruthy();
      });
    });

    it('should handle toast removal with exit animation', async () => {
      const { rerender, mockRemove } = renderContainer([mockToast]);
      
      // Remove the toast
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={[]}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      // Toast should still be visible during exit animation
      expect(screen.getByText('Test Toast')).toBeTruthy();

      // Wait for exit animation to complete (300ms)
      await waitFor(
        () => {
          expect(screen.queryByText('Test Toast')).toBeNull();
        },
        { timeout: 500 }
      );
    });

    it('should update existing toasts', async () => {
      const { rerender, mockRemove } = renderContainer([mockToast]);
      
      // Update the toast
      const updatedToast = { ...mockToast, title: 'Updated Toast' };
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={[updatedToast]}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Updated Toast')).toBeTruthy();
      });
    });
  });

  describe('toast positioning', () => {
    it('should position multiple toasts in a stack', async () => {
      const toasts: Toast[] = [
        { ...mockToast, id: '1', title: 'Toast 1' },
        { ...mockToast, id: '2', title: 'Toast 2' },
      ];
      renderContainer(toasts);

      await waitFor(() => {
        expect(screen.getByText('Toast 1')).toBeTruthy();
        expect(screen.getByText('Toast 2')).toBeTruthy();
      });
    });

    it('should recalculate positions when toasts are added', async () => {
      const { rerender, mockRemove } = renderContainer([mockToast]);
      
      // Add another toast
      const toasts: Toast[] = [
        mockToast,
        { ...mockToast, id: '2', title: 'Toast 2' },
      ];
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={toasts}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Toast 2')).toBeTruthy();
      });
    });

    it('should recalculate positions when toasts are removed', async () => {
      const toasts: Toast[] = [
        { ...mockToast, id: '1', title: 'Toast 1' },
        { ...mockToast, id: '2', title: 'Toast 2' },
      ];
      const { rerender, mockRemove } = renderContainer(toasts);
      
      // Remove first toast
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={[toasts[1]]}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText('Toast 1')).toBeTruthy(); // Still visible during exit
        expect(screen.getByText('Toast 2')).toBeTruthy();
      });
    });
  });

  describe('toast lifecycle', () => {
    it('should handle rapid toast additions', async () => {
      const { rerender, mockRemove } = renderContainer([]);
      
      // Add multiple toasts rapidly
      const toasts: Toast[] = [
        { ...mockToast, id: '1', title: 'Toast 1' },
        { ...mockToast, id: '2', title: 'Toast 2' },
        { ...mockToast, id: '3', title: 'Toast 3' },
      ];
      
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={toasts}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Toast 1')).toBeTruthy();
        expect(screen.getByText('Toast 2')).toBeTruthy();
        expect(screen.getByText('Toast 3')).toBeTruthy();
      });
    });

    it('should handle toast updates during animation', async () => {
      const { rerender, mockRemove } = renderContainer([mockToast]);
      
      // Update toast immediately
      const updatedToast = { ...mockToast, progress: 50 };
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={[updatedToast]}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Toast')).toBeTruthy();
      });
    });

    it('should clean up refs when toasts are removed', async () => {
      const { rerender, mockRemove } = renderContainer([mockToast]);
      
      // Remove toast
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={[]}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      // Wait for cleanup
      await waitFor(
        () => {
          expect(screen.queryByText('Test Toast')).toBeNull();
        },
        { timeout: 500 }
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty toast array after having toasts', async () => {
      const { rerender, mockRemove } = renderContainer([mockToast]);
      
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={[]}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      await waitFor(
        () => {
          expect(screen.queryByText('Test Toast')).toBeNull();
        },
        { timeout: 500 }
      );
    });

    it('should handle toast with missing optional fields', () => {
      const minimalToast: Toast = {
        id: '1',
        title: 'Minimal',
        type: 'info',
        duration: 5000,
        isPaused: false,
        isPermanent: false,
        progress: 100,
        createdAt: Date.now(),
      };
      renderContainer([minimalToast]);
      expect(screen.getByText('Minimal')).toBeTruthy();
    });

    it('should handle multiple simultaneous removals', async () => {
      const toasts: Toast[] = [
        { ...mockToast, id: '1', title: 'Toast 1' },
        { ...mockToast, id: '2', title: 'Toast 2' },
        { ...mockToast, id: '3', title: 'Toast 3' },
      ];
      const { rerender, mockRemove } = renderContainer(toasts);
      
      // Remove all toasts at once
      rerender(
        <ThemeProvider>
          <ToastContainer
            toasts={[]}
            onRemoveToast={mockRemove}
            isDesktop={true}
          />
        </ThemeProvider>
      );

      // All should still be visible during exit animation
      expect(screen.getByText('Toast 1')).toBeTruthy();
      expect(screen.getByText('Toast 2')).toBeTruthy();
      expect(screen.getByText('Toast 3')).toBeTruthy();

      // Wait for all to be removed
      await waitFor(
        () => {
          expect(screen.queryByText('Toast 1')).toBeNull();
          expect(screen.queryByText('Toast 2')).toBeNull();
          expect(screen.queryByText('Toast 3')).toBeNull();
        },
        { timeout: 500 }
      );
    });
  });
});
