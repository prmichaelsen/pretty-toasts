# Task 14: Fix React setState Warning in Toast Component

**Milestone**: M2 - Testing & Documentation  
**Estimated Time**: 1-2 hours  
**Dependencies**: None  
**Priority**: Medium  
**Status**: Not Started

---

## Objective

Fix React warning: "Cannot update a component (`ToastProvider`) while rendering a different component (`Toast`)". This warning indicates that the Toast component is calling setState on the ToastProvider during render, which is an anti-pattern in React.

---

## Problem Statement

**Warning Message**:
```
Warning: Cannot update a component (`ToastProvider`) while rendering a different component (`Toast`). 
To locate the bad setState() call inside `Toast`, follow the stack trace as described in 
https://reactjs.org/link/setstate-in-render

Error Component Stack
    at Toast (Toast.tsx:12:47)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at ToastContainer (ToastContainer.tsx:20:3)
    at StandaloneToastContainer (StandaloneToastContainer.tsx:12:35)
    at ThemeProvider (ThemeContext.tsx:49:10)
    at ToastProvider (ToastContext.tsx:17:63)
```

**Root Cause**:
The `Toast` component is calling a state update function (likely `onRemove`, `onPause`, `onResume`, or `onMakePermanent`) during the render phase instead of in an event handler or effect.

**Impact**:
- Console warnings in development
- Potential performance issues
- Violates React best practices
- Could cause unexpected behavior in React 18+ concurrent mode

---

## Investigation Steps

### 1. Review Toast Component Render Logic

**File**: [`src/components/Toast.tsx`](../src/components/Toast.tsx:12)

Look for any direct state updates in the render body (not in event handlers or effects):

```typescript
export const Toast: React.FC<ToastProps> = ({ toast, isExiting, onRemove }) => {
  // ❌ BAD: Calling state update during render
  if (someCondition) {
    onRemove(toast.id);  // This would cause the warning
  }

  // ✅ GOOD: State updates in event handlers
  const handleClick = () => {
    onRemove(toast.id);
  };

  // ✅ GOOD: State updates in effects
  useEffect(() => {
    if (someCondition) {
      onRemove(toast.id);
    }
  }, [someCondition, onRemove, toast.id]);
}
```

### 2. Check Auto-Dismiss Logic

The most likely culprit is the auto-dismiss logic. Check if `onRemove` is being called during render:

```typescript
// ❌ BAD: This would cause the warning
if (progress >= 100 && !toast.isPermanent) {
  onRemove(toast.id);  // Called during render!
}

// ✅ GOOD: Use useEffect
useEffect(() => {
  if (progress >= 100 && !toast.isPermanent && !toast.isPaused) {
    onRemove(toast.id);
  }
}, [progress, toast.isPermanent, toast.isPaused, onRemove, toast.id]);
```

### 3. Check Progress Updates

Look for any calls to `updateToast` or similar functions during render:

```typescript
// ❌ BAD
if (progress !== toast.progress) {
  updateToast(toast.id, { progress });  // Called during render!
}

// ✅ GOOD: Let parent control progress updates
// Progress should be updated via props, not by Toast component itself
```

### 4. Check Event Handler Setup

Ensure all state updates are in proper event handlers:

```typescript
// ✅ GOOD: Event handlers
const handleMouseEnter = useCallback(() => {
  onPause(toast.id);
}, [onPause, toast.id]);

const handleClick = useCallback(() => {
  onMakePermanent(toast.id);
}, [onMakePermanent, toast.id]);
```

---

## Root Cause Analysis

After reviewing [`Toast.tsx:12`](../src/components/Toast.tsx:12), identify the specific line causing the warning:

**Likely Culprits**:
1. Auto-dismiss logic calling `onRemove` during render
2. Progress bar logic updating state during render
3. Conditional logic that triggers state updates
4. Missing `useEffect` wrapper around state updates

---

## Solution Implementation

### Fix 1: Wrap Auto-Dismiss in useEffect

**File**: `src/components/Toast.tsx`

```typescript
// Move any auto-dismiss logic into useEffect
useEffect(() => {
  if (!toast.isPermanent && !toast.isPaused && progress >= 100) {
    onRemove(toast.id);
  }
}, [progress, toast.isPermanent, toast.isPaused, onRemove, toast.id]);
```

### Fix 2: Remove Direct State Updates from Render

Search for any direct calls to state update functions:

```typescript
// ❌ Remove these from render body
onRemove(toast.id);
onPause(toast.id);
onResume(toast.id);
onMakePermanent(toast.id);

// ✅ Only call them in:
// - Event handlers (onClick, onMouseEnter, etc.)
// - useEffect hooks
// - useCallback hooks
```

### Fix 3: Ensure All Callbacks Use useCallback

```typescript
const handleRemove = useCallback(() => {
  onRemove(toast.id);
}, [onRemove, toast.id]);

const handlePause = useCallback(() => {
  onPause(toast.id);
}, [onPause, toast.id]);

const handleResume = useCallback(() => {
  onResume(toast.id);
}, [onResume, toast.id]);
```

---

## Testing

### Manual Testing

```bash
# Build the library
npm run build

# Run demo
npm run demo:dev
```

**Test Cases**:
1. **Create Multiple Toasts**:
   - Click "Success Toast" multiple times
   - **Expected**: No console warnings
   - **Verify**: All toasts appear and stack correctly

2. **Auto-Dismiss**:
   - Create a toast with short duration
   - Wait for it to auto-dismiss
   - **Expected**: No console warnings
   - **Verify**: Toast dismisses smoothly

3. **Progress Updates**:
   - Click "Progress Upload Simulation"
   - Watch progress bar update
   - **Expected**: No console warnings
   - **Verify**: Progress updates smoothly

4. **Interactive Features**:
   - Hover over toast (pause)
   - Click toast (make permanent)
   - Swipe toast (dismiss)
   - **Expected**: No console warnings
   - **Verify**: All interactions work correctly

### Check Console

Open browser DevTools console and verify:
- [ ] No "Cannot update component" warnings
- [ ] No other React warnings
- [ ] No errors during toast lifecycle
- [ ] Clean console during all interactions

---

## Verification Checklist

- [ ] Identified the exact line causing the warning
- [ ] Moved state updates to useEffect or event handlers
- [ ] All callbacks wrapped in useCallback
- [ ] No direct state updates in render body
- [ ] Build successful with no TypeScript errors
- [ ] Demo runs without console warnings
- [ ] All toast features still work correctly
- [ ] Auto-dismiss works properly
- [ ] Progress updates work smoothly
- [ ] Interactive features (hover, click, swipe) work

---

## Documentation Updates

### Update CHANGELOG.md

```markdown
## [3.0.4] - 2026-02-15

### Fixed
- Fixed React warning: "Cannot update component while rendering different component"
- Moved state updates from render body to useEffect hooks
- Improved Toast component lifecycle management

### Technical Details
- Wrapped auto-dismiss logic in useEffect
- Ensured all state updates occur in proper React lifecycle phases
- No breaking changes - all functionality preserved
```

---

## Common Patterns to Avoid

### ❌ Anti-Pattern: State Update During Render

```typescript
function Toast({ toast, onRemove }) {
  // ❌ BAD: Called during every render
  if (toast.duration === 0) {
    onRemove(toast.id);
  }
  
  return <div>...</div>;
}
```

### ✅ Correct Pattern: State Update in Effect

```typescript
function Toast({ toast, onRemove }) {
  // ✅ GOOD: Called only when condition changes
  useEffect(() => {
    if (toast.duration === 0) {
      onRemove(toast.id);
    }
  }, [toast.duration, onRemove, toast.id]);
  
  return <div>...</div>;
}
```

---

## Related Resources

- [React Docs: setState in render](https://reactjs.org/link/setstate-in-render)
- [React Docs: useEffect](https://react.dev/reference/react/useEffect)
- [React Docs: Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)

---

**Status**: Not Started  
**Priority**: Medium (Console warning, not breaking)  
**Next Steps**: 
1. Review Toast.tsx line 12 and surrounding code
2. Identify the setState call during render
3. Move to useEffect or event handler
4. Test thoroughly
5. Update CHANGELOG
6. Release v3.0.4
