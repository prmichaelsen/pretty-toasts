import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToastContext } from '../ToastContext';

describe('ToastContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  describe('addToast', () => {
    it('should add a toast', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'Test', type: 'success' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Test');
      expect(result.current.toasts[0].type).toBe('success');
    });

    it('should add multiple toasts', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'First', type: 'success' });
        result.current.addToast({ title: 'Second', type: 'error' });
        result.current.addToast({ title: 'Third', type: 'warning' });
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].title).toBe('First');
      expect(result.current.toasts[1].title).toBe('Second');
      expect(result.current.toasts[2].title).toBe('Third');
    });

    it('should generate unique IDs', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'First', type: 'success' });
        result.current.addToast({ title: 'Second', type: 'success' });
      });

      expect(result.current.toasts[0].id).not.toBe(result.current.toasts[1].id);
    });

    it('should set default duration', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'Test', type: 'success' });
      });

      expect(result.current.toasts[0].duration).toBe(10000);
    });

    it('should use custom duration', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'Test', type: 'success', duration: 5000 });
      });

      expect(result.current.toasts[0].duration).toBe(5000);
    });
  });

  describe('removeToast', () => {
    it('should remove a toast by ID', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'Test', type: 'success' });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should only remove the specified toast', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'First', type: 'success' });
        result.current.addToast({ title: 'Second', type: 'error' });
        result.current.addToast({ title: 'Third', type: 'warning' });
      });

      const toastId = result.current.toasts[1].id;

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].title).toBe('First');
      expect(result.current.toasts[1].title).toBe('Third');
    });
  });

  describe('updateToast', () => {
    it('should update toast properties', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'Test', type: 'success' });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.updateToast(toastId, { progress: 50 });
      });

      expect(result.current.toasts[0].progress).toBe(50);
    });

    it('should update multiple properties', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'Test', type: 'success' });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.updateToast(toastId, {
          title: 'Updated',
          progress: 75,
          isPaused: true,
        });
      });

      expect(result.current.toasts[0].title).toBe('Updated');
      expect(result.current.toasts[0].progress).toBe(75);
      expect(result.current.toasts[0].isPaused).toBe(true);
    });
  });

  describe('pauseToast', () => {
    it('should pause a toast', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'Test', type: 'success' });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.pauseToast(toastId);
      });

      expect(result.current.toasts[0].isPaused).toBe(true);
    });
  });

  describe('resumeToast', () => {
    it('should resume a paused toast', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'Test', type: 'success' });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.pauseToast(toastId);
      });

      expect(result.current.toasts[0].isPaused).toBe(true);

      act(() => {
        result.current.resumeToast(toastId);
      });

      expect(result.current.toasts[0].isPaused).toBe(false);
    });
  });

  describe('makeToastPermanent', () => {
    it('should make a toast permanent', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'Test', type: 'success' });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.makeToastPermanent(toastId);
      });

      expect(result.current.toasts[0].isPermanent).toBe(true);
    });
  });

  describe('clearAllToasts', () => {
    it('should clear all toasts', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.addToast({ title: 'First', type: 'success' });
        result.current.addToast({ title: 'Second', type: 'error' });
        result.current.addToast({ title: 'Third', type: 'warning' });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.clearAllToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('initial state', () => {
    it('should have empty toasts array initially', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      expect(result.current.toasts).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useToastContext());
      }).toThrow('useToastContext must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });
  });
});
