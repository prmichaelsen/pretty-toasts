import { configureStore } from '@reduxjs/toolkit';
import toastReducer, {
  addToast,
  removeToast,
  updateToast,
  pauseToast,
  resumeToast,
  makeToastPermanent,
  clearAllToasts,
  selectToasts,
  selectActiveToasts
} from '../toastSlice';
import type { ToastState } from '../../types';

interface RootState {
  prettyToasts: ToastState;
}

describe('toastSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  beforeEach(() => {
    store = configureStore({
      reducer: { prettyToasts: toastReducer },
    });
  });

  describe('addToast', () => {
    it('should add a toast with default values', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));

      const state = store.getState().prettyToasts;
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].title).toBe('Test');
      expect(state.toasts[0].type).toBe('success');
      expect(state.toasts[0].id).toBeDefined();
      expect(state.toasts[0].duration).toBe(10000); // Default duration is 10000ms
      expect(state.toasts[0].isPaused).toBe(false);
      expect(state.toasts[0].isPermanent).toBe(false);
    });

    it('should add a toast with custom duration', () => {
      store.dispatch(addToast({ title: 'Test', type: 'error', duration: 10000 }));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].duration).toBe(10000);
    });

    it('should add multiple toasts', () => {
      store.dispatch(addToast({ title: 'First', type: 'success' }));
      store.dispatch(addToast({ title: 'Second', type: 'error' }));
      store.dispatch(addToast({ title: 'Third', type: 'warning' }));

      const state = store.getState().prettyToasts;
      expect(state.toasts).toHaveLength(3);
      expect(state.toasts[0].title).toBe('First');
      expect(state.toasts[1].title).toBe('Second');
      expect(state.toasts[2].title).toBe('Third');
    });

    it('should generate unique IDs for each toast', () => {
      store.dispatch(addToast({ title: 'First', type: 'success' }));
      store.dispatch(addToast({ title: 'Second', type: 'success' }));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].id).not.toBe(state.toasts[1].id);
    });
  });

  describe('removeToast', () => {
    it('should remove a toast by ID', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      const toastId = store.getState().prettyToasts.toasts[0].id;

      store.dispatch(removeToast(toastId));

      const state = store.getState().prettyToasts;
      expect(state.toasts).toHaveLength(0);
    });

    it('should only remove the specified toast', () => {
      store.dispatch(addToast({ title: 'First', type: 'success' }));
      store.dispatch(addToast({ title: 'Second', type: 'error' }));
      store.dispatch(addToast({ title: 'Third', type: 'warning' }));

      const toastId = store.getState().prettyToasts.toasts[1].id;
      store.dispatch(removeToast(toastId));

      const state = store.getState().prettyToasts;
      expect(state.toasts).toHaveLength(2);
      expect(state.toasts[0].title).toBe('First');
      expect(state.toasts[1].title).toBe('Third');
    });

    it('should do nothing if toast ID does not exist', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      
      store.dispatch(removeToast('non-existent-id'));

      const state = store.getState().prettyToasts;
      expect(state.toasts).toHaveLength(1);
    });
  });

  describe('updateToast', () => {
    it('should update toast progress', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      const toastId = store.getState().prettyToasts.toasts[0].id;

      store.dispatch(updateToast({ id: toastId, updates: { progress: 50 } }));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].progress).toBe(50);
    });

    it('should update toast message', () => {
      store.dispatch(addToast({ title: 'Original', type: 'success' }));
      const toastId = store.getState().prettyToasts.toasts[0].id;

      store.dispatch(updateToast({ id: toastId, updates: { title: 'Updated' } }));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].title).toBe('Updated');
    });

    it('should update multiple properties at once', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      const toastId = store.getState().prettyToasts.toasts[0].id;

      store.dispatch(updateToast({
        id: toastId,
        updates: {
          title: 'Updated',
          progress: 75,
          isPaused: true
        }
      }));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].title).toBe('Updated');
      expect(state.toasts[0].progress).toBe(75);
      expect(state.toasts[0].isPaused).toBe(true);
    });

    it('should do nothing if toast ID does not exist', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      
      store.dispatch(updateToast({ id: 'non-existent-id', updates: { progress: 50 } }));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].progress).toBeUndefined();
    });
  });

  describe('pauseToast', () => {
    it('should pause a toast', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      const toastId = store.getState().prettyToasts.toasts[0].id;

      store.dispatch(pauseToast(toastId));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].isPaused).toBe(true);
    });

    it('should do nothing if toast ID does not exist', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      
      store.dispatch(pauseToast('non-existent-id'));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].isPaused).toBe(false);
    });
  });

  describe('resumeToast', () => {
    it('should resume a paused toast', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      const toastId = store.getState().prettyToasts.toasts[0].id;

      store.dispatch(pauseToast(toastId));
      expect(store.getState().prettyToasts.toasts[0].isPaused).toBe(true);

      store.dispatch(resumeToast(toastId));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].isPaused).toBe(false);
    });

    it('should do nothing if toast ID does not exist', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      store.dispatch(pauseToast(store.getState().prettyToasts.toasts[0].id));
      
      store.dispatch(resumeToast('non-existent-id'));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].isPaused).toBe(true);
    });
  });

  describe('makeToastPermanent', () => {
    it('should make a toast permanent', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      const toastId = store.getState().prettyToasts.toasts[0].id;

      store.dispatch(makeToastPermanent(toastId));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].isPermanent).toBe(true);
    });

    it('should do nothing if toast ID does not exist', () => {
      store.dispatch(addToast({ title: 'Test', type: 'success' }));
      
      store.dispatch(makeToastPermanent('non-existent-id'));

      const state = store.getState().prettyToasts;
      expect(state.toasts[0].isPermanent).toBe(false);
    });
  });

  describe('clearAllToasts', () => {
    it('should clear all toasts', () => {
      store.dispatch(addToast({ title: 'First', type: 'success' }));
      store.dispatch(addToast({ title: 'Second', type: 'error' }));
      store.dispatch(addToast({ title: 'Third', type: 'warning' }));

      expect(store.getState().prettyToasts.toasts).toHaveLength(3);

      store.dispatch(clearAllToasts());

      const state = store.getState().prettyToasts;
      expect(state.toasts).toEqual([]);
    });

    it('should work on empty state', () => {
      store.dispatch(clearAllToasts());

      const state = store.getState().prettyToasts;
      expect(state.toasts).toEqual([]);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.dispatch(addToast({ title: 'Regular 1', type: 'success' }));
      store.dispatch(addToast({ title: 'Regular 2', type: 'error' }));
      store.dispatch(addToast({ title: 'Permanent', type: 'info' }));
      
      const state = store.getState().prettyToasts;
      const permanentToastId = state.toasts[2].id;
      store.dispatch(makeToastPermanent(permanentToastId));
    });

    it('selectToasts should return all toasts', () => {
      const toasts = selectToasts(store.getState());
      expect(toasts).toHaveLength(3);
      expect(toasts[0].title).toBe('Regular 1');
      expect(toasts[1].title).toBe('Regular 2');
      expect(toasts[2].title).toBe('Permanent');
    });

    it('selectActiveToasts should return only non-permanent toasts', () => {
      const activeToasts = selectActiveToasts(store.getState());
      expect(activeToasts).toHaveLength(2);
      expect(activeToasts[0].title).toBe('Regular 1');
      expect(activeToasts[1].title).toBe('Regular 2');
      expect(activeToasts.every(t => !t.isPermanent)).toBe(true);
    });

    it('selectActiveToasts should return all toasts when none are permanent', () => {
      // Create a fresh store
      const freshStore = configureStore({
        reducer: { prettyToasts: toastReducer },
      });
      
      freshStore.dispatch(addToast({ title: 'Toast 1', type: 'success' }));
      freshStore.dispatch(addToast({ title: 'Toast 2', type: 'error' }));

      const activeToasts = selectActiveToasts(freshStore.getState());
      expect(activeToasts).toHaveLength(2);
    });
  });

  describe('initial state', () => {
    it('should have empty toasts array initially', () => {
      const state = store.getState().prettyToasts;
      expect(state.toasts).toEqual([]);
    });
  });
});
