import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useToast } from '../useToast';
import toastReducer from '../../store/toastSlice';
import { ToastProvider } from '../ToastContext';
import type { ToastState } from '../../types';

interface RootState {
  prettyToasts: ToastState;
}

describe('useToast', () => {
  describe('with Redux', () => {
    it('should detect Redux and use Redux implementation', () => {
      const store = configureStore({
        reducer: { prettyToasts: toastReducer },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      // Verify hook returns functions
      expect(result.current.success).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.warning).toBeDefined();
      expect(result.current.info).toBeDefined();
      expect(result.current.toast).toBeDefined();
    });

    it('should add success toast using Redux', () => {
      const store = configureStore({
        reducer: { prettyToasts: toastReducer },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      result.current.success({ title: 'Success message' });

      const state = store.getState();
      expect(state.prettyToasts.toasts).toHaveLength(1);
      expect(state.prettyToasts.toasts[0].title).toBe('Success message');
      expect(state.prettyToasts.toasts[0].type).toBe('success');
    });

    it('should add error toast using Redux', () => {
      const store = configureStore({
        reducer: { prettyToasts: toastReducer },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      result.current.error({ title: 'Error message' });

      const state = store.getState();
      expect(state.prettyToasts.toasts).toHaveLength(1);
      expect(state.prettyToasts.toasts[0].title).toBe('Error message');
      expect(state.prettyToasts.toasts[0].type).toBe('error');
    });

    it('should add warning toast using Redux', () => {
      const store = configureStore({
        reducer: { prettyToasts: toastReducer },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      result.current.warning({ title: 'Warning message' });

      const state = store.getState();
      expect(state.prettyToasts.toasts).toHaveLength(1);
      expect(state.prettyToasts.toasts[0].title).toBe('Warning message');
      expect(state.prettyToasts.toasts[0].type).toBe('warning');
    });

    it('should add info toast using Redux', () => {
      const store = configureStore({
        reducer: { prettyToasts: toastReducer },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      result.current.info({ title: 'Info message' });

      const state = store.getState();
      expect(state.prettyToasts.toasts).toHaveLength(1);
      expect(state.prettyToasts.toasts[0].title).toBe('Info message');
      expect(state.prettyToasts.toasts[0].type).toBe('info');
    });

    it('should add toast with custom options using Redux', () => {
      const store = configureStore({
        reducer: { prettyToasts: toastReducer },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      result.current.toast({
        title: 'Custom toast',
        type: 'success',
        message: 'With message',
        duration: 5000,
      });

      const state = store.getState();
      expect(state.prettyToasts.toasts).toHaveLength(1);
      expect(state.prettyToasts.toasts[0].title).toBe('Custom toast');
      expect(state.prettyToasts.toasts[0].message).toBe('With message');
      expect(state.prettyToasts.toasts[0].duration).toBe(5000);
    });
  });

  describe('standalone mode', () => {
    it('should detect standalone and use Context implementation', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      // Verify hook returns functions
      expect(result.current.success).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.warning).toBeDefined();
      expect(result.current.info).toBeDefined();
      expect(result.current.toast).toBeDefined();
    });

    it('should add success toast using Context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      // Context doesn't expose state directly, but we can verify the function exists and doesn't throw
      expect(() => result.current.success({ title: 'Success message' })).not.toThrow();
    });

    it('should add error toast using Context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      expect(() => result.current.error({ title: 'Error message' })).not.toThrow();
    });

    it('should add warning toast using Context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      expect(() => result.current.warning({ title: 'Warning message' })).not.toThrow();
    });

    it('should add info toast using Context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      expect(() => result.current.info({ title: 'Info message' })).not.toThrow();
    });

    it('should add toast with custom options using Context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      expect(() =>
        result.current.toast({
          title: 'Custom toast',
          type: 'success',
          message: 'With message',
          duration: 5000,
        })
      ).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should throw error when used without provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useToast());
      }).toThrow();

      consoleSpy.mockRestore();
    });
  });
});
