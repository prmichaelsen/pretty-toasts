# Task 3: Create StandaloneToastContainer Wrapper

**Milestone**: M1 - Core Library Implementation
**Estimated Time**: 1 hour
**Dependencies**: Task 1 (useMediaQuery hook)
**Status**: Not Started

---

## Objective

Create a wrapper component that connects the `ToastContainer` to the standalone React Context. This component will use `useToastContext` to get toasts and actions from the context provider, enabling users to use the library without Redux.

---

## Steps

### 1. Create the Component File

Create `src/components/StandaloneToastContainer.tsx`:

```typescript
import React from 'react';
import { ToastContainer } from './ToastContainer';
import { useToastContext } from '../hooks/ToastContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Standalone toast container (no Redux required)
 * Uses React Context for state management
 * Must be used within a ToastProvider
 */
export const StandaloneToastContainer: React.FC = () => {
  const { toasts, removeToast, clearAllToasts, makeToastPermanent } = useToastContext();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  return (
    <ToastContainer
      toasts={toasts}
      onRemoveToast={removeToast}
      onClearAll={clearAllToasts}
      onMakePermanent={makeToastPermanent}
      isDesktop={isDesktop}
    />
  );
};
```

### 2. Verify ToastContext Exports

Ensure `useToastContext` exports all required methods:

```typescript
// In src/hooks/ToastContext.tsx - should already have these
interface ToastContextValue extends ToastActions {
  toasts: Toast[];
  addToast: (options: ToastOptions) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  removeToast: (id: string) => void;
  pauseToast: (id: string) => void;
  resumeToast: (id: string) => void;
  makeToastPermanent: (id: string) => void;
  clearAllToasts: () => void;
}
```

---

## Verification

- [ ] File `src/components/StandaloneToastContainer.tsx` created
- [ ] Component uses `useToastContext` to get state and actions
- [ ] Component uses `useMediaQuery` for responsive behavior
- [ ] Component passes all required props to `ToastContainer`
- [ ] TypeScript compiles without errors
- [ ] Component renders without errors when inside `ToastProvider`
- [ ] Component throws error when used outside `ToastProvider`
- [ ] Toasts appear when added via context
- [ ] Remove toast works
- [ ] Clear all toasts works
- [ ] Make permanent works
- [ ] Responsive behavior works (desktop vs mobile)

---

## Usage Example

```typescript
import { ToastProvider, StandaloneToastContainer, useToast } from 'pretty-toasts';

function App() {
  return (
    <ToastProvider>
      {/* Your app content */}
      <MyComponent />
      <StandaloneToastContainer />
    </ToastProvider>
  );
}

function MyComponent() {
  const { success, error } = useToast();
  
  return (
    <div>
      <button onClick={() => success({ title: 'Success!', message: 'It worked!' })}>
        Show Toast
      </button>
    </div>
  );
}
```

---

## Notes

- This component is specifically for non-Redux users
- Must be used within a `ToastProvider`
- Automatically connects to the React Context
- No Redux dependencies required
- Handles all context integration internally
- Responsive behavior handled via `useMediaQuery`
- Component is a "smart" component (connected to context)
- Provides same API as `ReduxToastContainer` for consistency

---

## Error Handling

The component will throw a clear error if used outside `ToastProvider`:

```
Error: useToastContext must be used within a ToastProvider
```

This is already handled by the `useToastContext` hook.

---

## Files to Create

1. `src/components/StandaloneToastContainer.tsx` - New wrapper component

---

**Next Task**: Task 4 - Create Rollup Build Configuration
