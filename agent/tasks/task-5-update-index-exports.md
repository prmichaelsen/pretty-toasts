# Task 5: Update Index Exports

**Milestone**: M1 - Core Library Implementation
**Estimated Time**: 0.5 hours
**Dependencies**: Tasks 1-4 (all components and build config created)
**Status**: Not Started

---

## Objective

Update the main `src/index.ts` file to export all new components and hooks, ensuring the library provides a complete public API for both Redux and standalone usage modes.

---

## Steps

### 1. Update src/index.ts

Replace the current exports with the complete set:

```typescript
// Types
export type { Toast, ToastType, ToastOptions, ToastState, ToastActions } from './types';

// Core Components
export { Toast } from './components/Toast';
export { ToastContainer } from './components/ToastContainer';

// Wrapper Components (NEW)
export { ReduxToastContainer } from './components/ReduxToastContainer';
export { StandaloneToastContainer } from './components/StandaloneToastContainer';

// Redux (optional - only if @reduxjs/toolkit is installed)
export {
  default as toastReducer,
  addToast,
  updateToast,
  removeToast,
  pauseToast,
  resumeToast,
  makeToastPermanent,
  clearAllToasts,
  selectToasts,
  selectActiveToasts,
  selectPermanentToasts,
} from './store/toastSlice';

// Hooks
export { useToast } from './hooks/useToast';
export { useMediaQuery } from './hooks/useMediaQuery'; // NEW

// Standalone Context Provider (for non-Redux users)
export { ToastProvider, useToastContext } from './hooks/ToastContext';
```

### 2. Verify All Exports Exist

Check that each exported item exists:

- [x] `Toast` - [`src/components/Toast.tsx`](../src/components/Toast.tsx:1)
- [x] `ToastContainer` - [`src/components/ToastContainer.tsx`](../src/components/ToastContainer.tsx:1)
- [ ] `ReduxToastContainer` - [`src/components/ReduxToastContainer.tsx`](../src/components/ReduxToastContainer.tsx:1) (to be created)
- [ ] `StandaloneToastContainer` - [`src/components/StandaloneToastContainer.tsx`](../src/components/StandaloneToastContainer.tsx:1) (to be created)
- [x] `toastReducer` and actions - [`src/store/toastSlice.ts`](../src/store/toastSlice.ts:1)
- [x] `useToast` - [`src/hooks/useToast.ts`](../src/hooks/useToast.ts:1)
- [ ] `useMediaQuery` - [`src/hooks/useMediaQuery.ts`](../src/hooks/useMediaQuery.ts:1) (to be created)
- [x] `ToastProvider`, `useToastContext` - [`src/hooks/ToastContext.tsx`](../src/hooks/ToastContext.tsx:1)
- [x] Types - [`src/types/index.ts`](../src/types/index.ts:1)

### 3. Add JSDoc Comments

Add documentation comments for better IntelliSense:

```typescript
/**
 * Pretty Toasts - Beautiful gradient toast notifications for React
 * 
 * @packageDocumentation
 */

// Types
/**
 * Toast notification object
 */
export type { Toast, ToastType, ToastOptions, ToastState, ToastActions } from './types';

// Core Components
/**
 * Individual toast component with gradient styling and interactions
 */
export { Toast } from './components/Toast';

/**
 * Container component that manages toast positioning and animations
 * Use ReduxToastContainer or StandaloneToastContainer instead for automatic integration
 */
export { ToastContainer } from './components/ToastContainer';

/**
 * Redux-connected toast container
 * Automatically connects to Redux store - use with Redux Toolkit
 * @example
 * ```tsx
 * import { ReduxToastContainer } from 'pretty-toasts';
 * 
 * function App() {
 *   return (
 *     <Provider store={store}>
 *       <ReduxToastContainer />
 *     </Provider>
 *   );
 * }
 * ```
 */
export { ReduxToastContainer } from './components/ReduxToastContainer';

/**
 * Standalone toast container (no Redux required)
 * Must be used within ToastProvider
 * @example
 * ```tsx
 * import { ToastProvider, StandaloneToastContainer } from 'pretty-toasts';
 * 
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <StandaloneToastContainer />
 *     </ToastProvider>
 *   );
 * }
 * ```
 */
export { StandaloneToastContainer } from './components/StandaloneToastContainer';

// Redux (optional)
/**
 * Redux Toolkit slice reducer for toast state
 * Add to your Redux store under the 'prettyToasts' key
 */
export {
  default as toastReducer,
  addToast,
  updateToast,
  removeToast,
  pauseToast,
  resumeToast,
  makeToastPermanent,
  clearAllToasts,
  selectToasts,
  selectActiveToasts,
  selectPermanentToasts,
} from './store/toastSlice';

// Hooks
/**
 * Universal toast hook - works with both Redux and standalone modes
 * Automatically detects which mode is available
 * @example
 * ```tsx
 * const { success, error, warning, info } = useToast();
 * 
 * success({ title: 'Success!', message: 'It worked!' });
 * ```
 */
export { useToast } from './hooks/useToast';

/**
 * Media query hook for responsive behavior
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery('(min-width: 640px)');
 * ```
 */
export { useMediaQuery } from './hooks/useMediaQuery';

// Standalone Context Provider
/**
 * Context provider for standalone mode (no Redux)
 * Wrap your app with this to use toasts without Redux
 */
export { ToastProvider, useToastContext } from './hooks/ToastContext';
```

---

## Verification

- [ ] `src/index.ts` updated with all exports
- [ ] TypeScript compiles without errors
- [ ] No circular dependency warnings
- [ ] All exports are accessible after build
- [ ] JSDoc comments added for IntelliSense
- [ ] Types are properly exported
- [ ] Both Redux and standalone exports available
- [ ] Build succeeds with updated exports
- [ ] Test import in a sample file:

```typescript
import {
  // Types
  Toast,
  ToastType,
  ToastOptions,
  
  // Components
  ReduxToastContainer,
  StandaloneToastContainer,
  
  // Redux
  toastReducer,
  addToast,
  
  // Hooks
  useToast,
  useMediaQuery,
  
  // Context
  ToastProvider,
  useToastContext,
} from 'pretty-toasts';
```

---

## Public API Summary

After this update, the library will export:

### Components
- `Toast` - Individual toast component
- `ToastContainer` - Base container (usually not used directly)
- `ReduxToastContainer` - Redux-connected container
- `StandaloneToastContainer` - Context-connected container

### Redux Integration
- `toastReducer` - Redux slice reducer
- `addToast`, `updateToast`, `removeToast` - Actions
- `pauseToast`, `resumeToast`, `makeToastPermanent` - Actions
- `clearAllToasts` - Action
- `selectToasts`, `selectActiveToasts`, `selectPermanentToasts` - Selectors

### Hooks
- `useToast` - Universal toast hook (auto-detects mode)
- `useMediaQuery` - Media query hook
- `useToastContext` - Direct context access (advanced)

### Context
- `ToastProvider` - Context provider for standalone mode

### Types
- `Toast` - Toast object type
- `ToastType` - Toast type enum
- `ToastOptions` - Options for creating toasts
- `ToastState` - Redux state type
- `ToastActions` - Action types

---

## Notes

- All exports are tree-shakeable
- Redux exports are optional (peer dependency)
- Types are exported for TypeScript users
- JSDoc comments improve developer experience
- Wrapper components simplify integration
- Hook auto-detection makes API consistent
- Both modes use the same hook API

---

## Files to Modify

1. `src/index.ts` - Update with all exports and JSDoc comments

---

**Next Task**: Task 6 - Build and Test
