# Task 2: Create ReduxToastContainer Wrapper

**Milestone**: M1 - Core Library Implementation
**Estimated Time**: 1 hour
**Dependencies**: Task 1 (useMediaQuery hook)
**Status**: Not Started

---

## Objective

Create a wrapper component that connects the `ToastContainer` to the Redux store. This component will use `useSelector` to get toasts from the Redux state and `useDispatch` to dispatch actions, providing a seamless integration for Redux users.

---

## Steps

### 1. Create the Component File

Create `src/components/ReduxToastContainer.tsx`:

```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from './ToastContainer';
import { 
  selectToasts, 
  removeToast, 
  clearAllToasts,
  makeToastPermanent 
} from '../store/toastSlice';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Redux-connected toast container
 * Automatically connects to Redux store and manages toast state
 */
export const ReduxToastContainer: React.FC = () => {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  return (
    <ToastContainer
      toasts={toasts}
      onRemoveToast={(id) => dispatch(removeToast(id))}
      onClearAll={() => dispatch(clearAllToasts())}
      onMakePermanent={(id) => dispatch(makeToastPermanent(id))}
      isDesktop={isDesktop}
    />
  );
};
```

### 2. Update ToastContainer Props (if needed)

Verify that `ToastContainer` accepts the `onMakePermanent` prop. If not, add it:

```typescript
// In src/components/ToastContainer.tsx
interface ToastContainerProps {
  toasts: ToastType[];
  onRemoveToast: (id: string) => void;
  onClearAll: () => void;
  onMakePermanent?: (id: string) => void; // Add this if missing
  isDesktop?: boolean;
}
```

And pass it to the Toast component:

```typescript
<Toast
  toast={toast}
  isExiting={toast.isExiting}
  onRemove={() => onRemoveToast(toast.id)}
  onMakePermanent={onMakePermanent}
/>
```

### 3. Add TypeScript Types

All types are already defined in existing files, so no additional type definitions needed.

---

## Verification

- [ ] File `src/components/ReduxToastContainer.tsx` created
- [ ] Component uses `useSelector` to get toasts from Redux
- [ ] Component uses `useDispatch` to dispatch actions
- [ ] Component uses `useMediaQuery` for responsive behavior
- [ ] Component passes all required props to `ToastContainer`
- [ ] TypeScript compiles without errors
- [ ] Component renders without errors
- [ ] Toasts appear when dispatched via Redux
- [ ] Remove toast action works
- [ ] Clear all toasts action works
- [ ] Make permanent action works
- [ ] Responsive behavior works (desktop vs mobile)

---

## Usage Example

```typescript
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ReduxToastContainer } from 'pretty-toasts';
import toastReducer from 'pretty-toasts/store/toastSlice';

// Setup store
const store = configureStore({
  reducer: {
    prettyToasts: toastReducer,
  },
});

// In your app
function App() {
  return (
    <Provider store={store}>
      {/* Your app content */}
      <ReduxToastContainer />
    </Provider>
  );
}
```

---

## Notes

- This component is specifically for Redux users
- It automatically connects to the Redux store
- No manual prop passing needed by the user
- Handles all Redux integration internally
- Uses the `selectToasts` selector from the slice
- Dispatches actions directly to Redux
- Responsive behavior handled via `useMediaQuery`
- Component is a "smart" component (connected to state)

---

## Files to Create/Modify

1. `src/components/ReduxToastContainer.tsx` - New wrapper component
2. `src/components/ToastContainer.tsx` - May need to add `onMakePermanent` prop

---

**Next Task**: Task 3 - Create StandaloneToastContainer Wrapper
