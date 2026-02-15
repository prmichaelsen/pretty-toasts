# Task 13: Fix Toast Stacking Bug

**Milestone**: M2 - Testing & Documentation  
**Estimated Time**: 2-3 hours  
**Dependencies**: None  
**Priority**: High  
**Status**: Not Started

---

## Objective

Investigate and fix the toast stacking bug where multiple toasts dismiss/replace each other instead of stacking vertically. Ensure multiple toasts can be displayed simultaneously as intended.

---

## Problem Statement

**Issue**: Toast Stacking Not Working in v3.0.0

When clicking buttons to show multiple toasts in quick succession, new toasts dismiss/replace old toasts instead of stacking them. This behavior persists even when providing unique IDs to each toast.

**Expected Behavior**:
- Multiple toasts should stack vertically (like notification drawers)
- Each toast should appear below the previous one
- Multiple toasts should be visible simultaneously

**Actual Behavior**:
- Clicking a new toast button dismisses the currently visible toast
- Only one toast is visible at a time
- Toasts do not stack or queue

**Reproduction Steps**:
1. Navigate to `/toast-test` page
2. Click "Success Toast" button
3. Immediately click "Error Toast" button
4. **Expected**: Both toasts visible (stacked)
5. **Actual**: Success toast disappears, only Error toast visible

---

## Investigation Steps

### 1. Review Toast State Management

**Files to check**:
- [`src/hooks/ToastContext.tsx`](../src/hooks/ToastContext.tsx) - Standalone toast state
- [`src/redux/toastSlice.ts`](../src/redux/toastSlice.ts) - Redux toast state
- [`src/components/ToastContainer.tsx`](../src/components/ToastContainer.tsx) - Toast rendering logic

**Questions to answer**:
- [ ] Are toasts being added to state correctly?
- [ ] Is the state array maintaining multiple toasts?
- [ ] Are unique IDs being preserved?
- [ ] Is there any logic that removes old toasts when new ones are added?

### 2. Check Toast Addition Logic

**In `ToastContext.tsx`**, verify the `addToast` function:

```typescript
const addToast = useCallback((options: ToastOptions) => {
  const newToast: Toast = {
    id: options.id || `toast-${Date.now()}`,
    type: options.type || 'info',
    title: options.title,
    message: options.message,
    duration: options.duration ?? 5000,
    progress: options.progress,
    isPermanent: false,
    isPaused: false,
  }

  setToasts((prev) => {
    // Check if toast with this ID already exists
    const exists = prev.some((t) => t.id === newToast.id)
    if (exists) {
      // Update existing toast
      return prev.map((t) => (t.id === newToast.id ? { ...t, ...newToast } : t))
    }
    // Add new toast
    return [...prev, newToast]  // ✅ Should append, not replace
  })

  return newToast.id
}, [])
```

**Potential Issues**:
- ❌ If `setToasts` is replacing instead of appending
- ❌ If duplicate ID detection is too aggressive
- ❌ If state updates are being batched incorrectly

### 3. Check Redux Slice Logic

**In `toastSlice.ts`**, verify the `addToast` reducer:

```typescript
addToast: (state, action: PayloadAction<ToastOptions>) => {
  const newToast: Toast = {
    id: action.payload.id || `toast-${Date.now()}`,
    type: action.payload.type || 'info',
    title: action.payload.title,
    message: action.payload.message,
    duration: action.payload.duration ?? 5000,
    progress: action.payload.progress,
    isPermanent: false,
    isPaused: false,
  }

  const exists = state.toasts.some((t) => t.id === newToast.id)
  if (exists) {
    // Update existing toast
    state.toasts = state.toasts.map((t) =>
      t.id === newToast.id ? { ...t, ...newToast } : t
    )
  } else {
    // Add new toast
    state.toasts.push(newToast)  // ✅ Should append
  }
}
```

### 4. Check ToastContainer Rendering

**In `ToastContainer.tsx`**, verify the rendering logic:

```typescript
export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  onUpdate,
  onPause,
  onResume,
  onMakePermanent,
}) => {
  // Check if toasts array is being filtered or limited
  const [animatedToasts, setAnimatedToasts] = useState<AnimatedToast[]>([])

  useEffect(() => {
    setAnimatedToasts((current) => {
      // ⚠️ Check this logic - might be removing toasts
      // ...
    })
  }, [toasts])

  // ...
}
```

**Potential Issues**:
- ❌ If `animatedToasts` state is limiting to 1 toast
- ❌ If exit animations are removing toasts prematurely
- ❌ If positioning logic is overlapping toasts

### 5. Check for Max Toast Limits

Search for any logic that limits the number of visible toasts:

```bash
# Search for max toast limits
grep -r "maxToasts" src/
grep -r "limit" src/components/ToastContainer.tsx
grep -r "slice(0" src/
grep -r "filter" src/components/ToastContainer.tsx
```

### 6. Test with Console Logging

Add debug logging to track toast state:

```typescript
// In ToastContext.tsx
const addToast = useCallback((options: ToastOptions) => {
  console.log('🔵 Adding toast:', options.id)
  
  setToasts((prev) => {
    console.log('📊 Current toasts:', prev.length, prev.map(t => t.id))
    const newState = [...prev, newToast]
    console.log('📊 New toasts:', newState.length, newState.map(t => t.id))
    return newState
  })
}, [])
```

---

## Root Cause Analysis

Based on the investigation, identify the root cause:

### Hypothesis 1: State Update Issue
- **Symptom**: `setToasts` not appending correctly
- **Fix**: Ensure functional state update with spread operator
- **Test**: Add console logs to verify state changes

### Hypothesis 2: Duplicate ID Detection
- **Symptom**: `Date.now()` IDs considered duplicates if created too quickly
- **Fix**: Use more unique ID generation (UUID or counter)
- **Test**: Add multiple toasts rapidly

### Hypothesis 3: Animation State Conflict
- **Symptom**: `animatedToasts` state removing old toasts
- **Fix**: Update animation logic to preserve all toasts
- **Test**: Check `animatedToasts` array length

### Hypothesis 4: Container Rendering Limit
- **Symptom**: ToastContainer only rendering first/last toast
- **Fix**: Remove any limiting logic in render
- **Test**: Verify all toasts in array are mapped

---

## Solution Implementation

### Fix 1: Ensure Proper State Updates

**File**: `src/hooks/ToastContext.tsx`

```typescript
const addToast = useCallback((options: ToastOptions) => {
  const newToast: Toast = {
    id: options.id || `toast-${Date.now()}-${Math.random()}`, // More unique
    type: options.type || 'info',
    title: options.title,
    message: options.message,
    duration: options.duration ?? 5000,
    progress: options.progress,
    isPermanent: false,
    isPaused: false,
  }

  setToasts((prev) => {
    // Only update if exact ID match exists
    const existingIndex = prev.findIndex((t) => t.id === newToast.id)
    if (existingIndex !== -1) {
      // Update existing toast
      const updated = [...prev]
      updated[existingIndex] = { ...prev[existingIndex], ...newToast }
      return updated
    }
    // Add new toast (append to end)
    return [...prev, newToast]
  })

  return newToast.id
}, [])
```

### Fix 2: Update Redux Slice

**File**: `src/redux/toastSlice.ts`

```typescript
addToast: (state, action: PayloadAction<ToastOptions>) => {
  const newToast: Toast = {
    id: action.payload.id || `toast-${Date.now()}-${Math.random()}`,
    type: action.payload.type || 'info',
    title: action.payload.title,
    message: action.payload.message,
    duration: action.payload.duration ?? 5000,
    progress: action.payload.progress,
    isPermanent: false,
    isPaused: false,
  }

  const existingIndex = state.toasts.findIndex((t) => t.id === newToast.id)
  if (existingIndex !== -1) {
    // Update existing toast
    state.toasts[existingIndex] = { ...state.toasts[existingIndex], ...newToast }
  } else {
    // Add new toast
    state.toasts.push(newToast)
  }
}
```

### Fix 3: Verify ToastContainer Logic

**File**: `src/components/ToastContainer.tsx`

Ensure the `useEffect` that syncs `toasts` to `animatedToasts` preserves all toasts:

```typescript
useEffect(() => {
  setAnimatedToasts((current) => {
    // Get IDs of current toasts
    const currentIds = new Set(current.map((t) => t.id))
    const newIds = new Set(toasts.map((t) => t.id))

    // Add new toasts (not in current)
    const toastsToAdd = toasts
      .filter((t) => !currentIds.has(t.id))
      .map((t) => ({
        ...t,
        isEntering: true,
        isExiting: false,
        height: 0,
        offsetY: 0,
      }))

    // Update existing toasts
    const updatedToasts = current.map((toast) => {
      const updated = toasts.find((t) => t.id === toast.id)
      if (updated) {
        return { ...toast, ...updated }
      }
      // Mark for removal if not in new toasts
      if (!newIds.has(toast.id)) {
        return { ...toast, isExiting: true }
      }
      return toast
    })

    // Combine updated and new toasts
    return [...updatedToasts, ...toastsToAdd]
  })
}, [toasts])
```

### Fix 4: Add Max Toast Configuration (Optional)

If we want to limit toasts but still stack them:

```typescript
interface ToastProviderProps {
  children: React.ReactNode
  theme?: CompleteTheme
  maxToasts?: number  // Default: unlimited
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  theme,
  maxToasts = Infinity 
}) => {
  const addToast = useCallback((options: ToastOptions) => {
    // ... create newToast ...

    setToasts((prev) => {
      const updated = [...prev, newToast]
      // Keep only the most recent maxToasts
      return updated.slice(-maxToasts)
    })
  }, [maxToasts])
}
```

---

## Testing

### Manual Testing

```bash
# Build the library
npm run build

# Test in demo app
cd demo
npm run dev
```

**Test Cases**:
1. **Rapid Toast Creation**:
   - Click "Success Toast" 3 times quickly
   - **Expected**: 3 toasts visible, stacked vertically
   - **Verify**: All 3 toasts have unique IDs

2. **Mixed Toast Types**:
   - Click "Success Toast"
   - Click "Error Toast"
   - Click "Warning Toast"
   - **Expected**: All 3 visible, different colors
   - **Verify**: Toasts stack without overlapping

3. **Multiple Toasts Button**:
   - Click "Multiple Toasts (Stacking)"
   - **Expected**: 4 toasts appear with 500ms delay between each
   - **Verify**: All 4 remain visible until dismissed

4. **Progress Updates**:
   - Click "Progress Upload Simulation"
   - While progress toast is visible, click "Success Toast"
   - **Expected**: Both toasts visible
   - **Verify**: Progress toast continues updating

5. **Toast Interactions**:
   - Show 3 toasts
   - Hover over middle toast (should pause)
   - Click top toast (should make permanent)
   - Swipe bottom toast (should dismiss)
   - **Expected**: Remaining toasts adjust positions smoothly

### Automated Testing

Create a test file to verify stacking:

**File**: `src/__tests__/toast-stacking.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ToastProvider, useToast } from '../standalone'

function TestComponent() {
  const toast = useToast()
  
  return (
    <div>
      <button onClick={() => toast.success({ id: 'toast-1', title: 'Toast 1' })}>
        Toast 1
      </button>
      <button onClick={() => toast.success({ id: 'toast-2', title: 'Toast 2' })}>
        Toast 2
      </button>
      <button onClick={() => toast.success({ id: 'toast-3', title: 'Toast 3' })}>
        Toast 3
      </button>
    </div>
  )
}

describe('Toast Stacking', () => {
  it('should display multiple toasts simultaneously', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    // Add 3 toasts
    fireEvent.click(screen.getByText('Toast 1'))
    fireEvent.click(screen.getByText('Toast 2'))
    fireEvent.click(screen.getByText('Toast 3'))

    // All 3 should be visible
    expect(screen.getByText('Toast 1')).toBeInTheDocument()
    expect(screen.getByText('Toast 2')).toBeInTheDocument()
    expect(screen.getByText('Toast 3')).toBeInTheDocument()
  })

  it('should stack toasts vertically without overlap', () => {
    // Test positioning logic
    // Verify each toast has unique offsetY
  })
})
```

---

## Verification Checklist

- [ ] Multiple toasts can be created rapidly
- [ ] All toasts remain visible (no premature dismissal)
- [ ] Toasts stack vertically with proper spacing
- [ ] Each toast has unique ID
- [ ] Toast state updates correctly in both standalone and Redux modes
- [ ] Animations work correctly with multiple toasts
- [ ] Hover/click/swipe interactions work on individual toasts
- [ ] Progress updates work while other toasts are visible
- [ ] No console errors or warnings
- [ ] Build successful with no TypeScript errors

---

## Documentation Updates

### Update README.md

Add section on toast stacking:

```markdown
### Multiple Toasts

The library supports displaying multiple toasts simultaneously. Toasts stack vertically with smooth animations:

```typescript
// Show multiple toasts
toast.success({ id: 'toast-1', title: 'First' })
toast.error({ id: 'toast-2', title: 'Second' })
toast.warning({ id: 'toast-3', title: 'Third' })

// All three toasts will be visible, stacked vertically
```

**Note**: Each toast should have a unique `id`. If you reuse an ID, the existing toast will be updated instead of creating a new one.

#### Limiting Maximum Toasts (Optional)

```typescript
<ToastProvider maxToasts={5}>
  {/* Only the 5 most recent toasts will be visible */}
</ToastProvider>
```
```

### Update CHANGELOG.md

```markdown
## [3.0.1] - 2026-02-15

### Fixed
- Fixed toast stacking bug where multiple toasts would dismiss each other
- Improved unique ID generation to prevent collisions
- Fixed animation state management for multiple simultaneous toasts

### Changed
- Enhanced toast state update logic for better reliability
- Improved ToastContainer rendering to handle multiple toasts correctly
```

---

## Root Cause (IDENTIFIED)

After investigation, the root cause has been identified:

**Root Cause**: Aggressive click-outside handler in ToastContainer

**Why It Happened**:
The [`ToastContainer.tsx`](../src/components/ToastContainer.tsx) component had a click-outside event listener (lines 126-145) that called `onClearAll()` whenever the user clicked anywhere outside the toast container. This meant that clicking buttons to create new toasts would trigger the click-outside handler, which would immediately clear all existing toasts before the new toast could be added.

**How It Was Fixed**:
1. Removed the aggressive click-outside handler from `ToastContainer.tsx` (lines 126-145)
2. Removed the `onClearAll` prop from `ToastContainerProps` interface
3. Updated `StandaloneToastContainer.tsx` to not pass `onClearAll` prop
4. Updated `ReduxToastContainer.tsx` to not pass `onClearAll` prop
5. Removed `clearAllToasts` import from both wrapper components

**Result**: Users can now create multiple toasts rapidly without them dismissing each other. Toasts still auto-dismiss after their duration, and users can manually dismiss individual toasts by swiping or clicking the X button.

**Files Modified**:
- [`src/components/ToastContainer.tsx`](../src/components/ToastContainer.tsx) - Removed click-outside handler
- [`src/components/StandaloneToastContainer.tsx`](../src/components/StandaloneToastContainer.tsx) - Removed onClearAll prop
- [`src/components/ReduxToastContainer.tsx`](../src/components/ReduxToastContainer.tsx) - Removed onClearAll prop

---

## Future Enhancements

1. **Toast Queue Management**: Add option to queue toasts if max limit reached
2. **Toast Grouping**: Group similar toasts (e.g., "3 new messages")
3. **Toast Priorities**: High-priority toasts appear at top
4. **Toast Positioning**: Support top-left, top-right, bottom-left, bottom-right
5. **Toast Animations**: More animation options (slide, fade, bounce)

---

**Status**: Not Started  
**Priority**: High (User-facing bug)  
**Next Steps**: 
1. Add debug logging to track toast state
2. Identify root cause through investigation
3. Implement fix
4. Test thoroughly
5. Update documentation
6. Release v3.0.1
