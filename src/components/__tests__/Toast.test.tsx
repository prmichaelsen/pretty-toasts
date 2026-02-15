import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from '../Toast';
import { ThemeProvider } from '../../hooks/ThemeContext';
import type { Toast as ToastType } from '../../types';

describe('Toast', () => {
  const mockToast: ToastType = {
    id: '1',
    title: 'Test Title',
    message: 'Test message',
    type: 'success',
    duration: 5000,
    isPaused: false,
    isPermanent: false,
    createdAt: Date.now(),
  };

  const mockOnRemove = jest.fn();
  const mockOnMakePermanent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderToast = (toast: ToastType = mockToast, isExiting = false) => {
    return render(
      <ThemeProvider>
        <Toast
          toast={toast}
          isExiting={isExiting}
          onRemove={mockOnRemove}
          onMakePermanent={mockOnMakePermanent}
        />
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('should render toast title', () => {
      renderToast();
      expect(screen.getByText('Test Title')).toBeTruthy();
    });

    it('should render toast message', () => {
      renderToast();
      expect(screen.getByText('Test message')).toBeTruthy();
    });

    it('should render without message', () => {
      const toastWithoutMessage = { ...mockToast, message: undefined };
      renderToast(toastWithoutMessage);
      expect(screen.getByText('Test Title')).toBeTruthy();
      expect(screen.queryByText('Test message')).toBeNull();
    });

    it('should render close button', () => {
      renderToast();
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeTruthy();
    });
  });

  describe('toast types', () => {
    it('should render success toast', () => {
      const { container } = renderToast({ ...mockToast, type: 'success' });
      expect(container.firstChild).toBeTruthy();
    });

    it('should render error toast', () => {
      const { container } = renderToast({ ...mockToast, type: 'error' });
      expect(container.firstChild).toBeTruthy();
    });

    it('should render warning toast', () => {
      const { container } = renderToast({ ...mockToast, type: 'warning' });
      expect(container.firstChild).toBeTruthy();
    });

    it('should render info toast', () => {
      const { container } = renderToast({ ...mockToast, type: 'info' });
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('should call onRemove when close button is clicked', () => {
      renderToast();
      const closeButton = screen.getByRole('button');
      fireEvent.click(closeButton);
      expect(mockOnRemove).toHaveBeenCalled();
    });

    it('should handle mouse enter', () => {
      const { container } = renderToast();
      const toastElement = container.querySelector('div[role="alert"]') as HTMLElement;
      fireEvent.mouseEnter(toastElement);
      // Toast should pause on hover
      expect(toastElement).toBeTruthy();
    });

    it('should handle mouse leave', () => {
      const { container } = renderToast();
      const toastElement = container.querySelector('div[role="alert"]') as HTMLElement;
      fireEvent.mouseLeave(toastElement);
      // Toast should resume on mouse leave
      expect(toastElement).toBeTruthy();
    });

    it('should handle touch start', () => {
      const { container } = renderToast();
      const toastElement = container.querySelector('div[role="alert"]') as HTMLElement;
      fireEvent.touchStart(toastElement, {
        touches: [{ clientY: 100 }],
      });
      expect(toastElement).toBeTruthy();
    });

    it('should handle mouse down', () => {
      const { container } = renderToast();
      const toastElement = container.querySelector('div[role="alert"]') as HTMLElement;
      fireEvent.mouseDown(toastElement, { clientY: 100 });
      expect(toastElement).toBeTruthy();
    });
  });

  describe('permanent toast', () => {
    it('should render permanent toast', () => {
      const permanentToast = { ...mockToast, isPermanent: true };
      renderToast(permanentToast);
      expect(screen.getByText('Test Title')).toBeTruthy();
    });
  });

  describe('exiting state', () => {
    it('should render exiting toast', () => {
      renderToast(mockToast, true);
      expect(screen.getByText('Test Title')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have role="alert"', () => {
      const { container } = renderToast();
      const alertDiv = container.querySelector('div[role="alert"]');
      expect(alertDiv).toBeTruthy();
    });

    it('should have aria-live="polite"', () => {
      const { container } = renderToast();
      const politeDiv = container.querySelector('[aria-live="polite"]');
      expect(politeDiv).toBeTruthy();
    });

    it('should have close button with aria-label', () => {
      renderToast();
      const closeButton = screen.getByLabelText('Dismiss notification');
      expect(closeButton).toBeTruthy();
    });
  });
});
