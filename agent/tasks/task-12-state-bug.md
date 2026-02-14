# Task: Fix React State Update During Render Error

**Priority**: High  
**Package**: @prmichaelsen/pretty-toasts  
**Version**: 2.1.2  
**Status**: Bug Report  
**Created**: 2026-02-14  

---

## Problem Statement

The toast library is throwing a React error when used in a TanStack Start application:

```
Cannot update a component ('ToastProvider') while rendering a different component ('Toast'). 
To locate the bad setState() call inside 'Toast', follow the stack trace as described in 
https://react.dev/link/setstate-in-render
```

### Error Details

- **Error Type**: React state update during render
- **Component**: `Toast` component is updating `ToastProvider` state during render
- **Impact**: Toasts don't display correctly, React throws warnings/errors
- **Environment**: TanStack Start with SSR, React 19

### Console Output

```
[vite] connecting...
[vite] connected.
⚠ Cannot update a component ('ToastProvider') while rendering a different component ('Toast')
[vite] hot updated: /src/routes/__root.tsx
[vite] css hot updated: /src/styles.css
```

---

## Root Cause

The `Toast` component is calling a state update function (likely `onRemove`, `onUpdate`, or similar) **during the render phase** instead of in a `useEffect` or event handler.

### React Rules Violated

React's rules state:
1. ❌ **Never update state during render** - causes infinite loops and unpredictable behavior
2. ✅ **Update state in effects or event handlers** - ensures predictable, one-way data flow

### Likely Code Pattern (Incorrect)

```typescript
// ❌ WRONG - State update during render
function Toast({ id, onRemove, duration }) {
  // This runs during render!
  if (shouldAutoRemove) {
    onRemove(id)  // ❌ State update during render
  }
  
  return <div>Toast content</div>
}
```

---

## Solution

Move all state updates from render to `useEffect` or event handlers.

### Correct Pattern

```typescript
// ✅ CORRECT - State update in effect
function Toast({ id, onRemove, duration }) {
  useEffect(() => {
    if (shouldAutoRemove) {
      onRemove(id)  // ✅ State update in effect
    }
  }, [shouldAutoRemove, id, onRemove])
  
  return <div>Toast content</div>
}
```

### Auto-dismiss Timer Example

```typescript
// ✅ CORRECT - Auto-dismiss in effect
function Toast({ id, onRemove, duration }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id)  // ✅ State update in timer callback
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [id, onRemove, duration])
  
  return <div>Toast content</div>
}
```

---

## Files to Check

Based on the library structure, check these files:

1. **`src/components/Toast.tsx`** or **`src/components/Toast/index.tsx`**
   - Look for any `onRemove()`, `onUpdate()`, or state update calls
   - Check if they're in render vs useEffect
   - Move any render-phase state updates to useEffect

2. **`src/components/StandaloneToastContainer.tsx`**
   - Check if it's passing callbacks that get called during render
   - Ensure callbacks are memoized with useCallback

3. **`src/hooks/ToastContext.tsx`**
   - Check if context updates are happening during render
   - Ensure state updates are in effects or event handlers

---

## Common Patterns to Fix

### Pattern 1: Auto-remove on Mount

```typescript
// ❌ WRONG
function Toast({ onRemove, id }) {
  if (someCondition) {
    onRemove(id)  // Called during render
  }
  return <div>...</div>
}

// ✅ CORRECT
function Toast({ onRemove, id }) {
  useEffect(() => {
    if (someCondition) {
      onRemove(id)
    }
  }, [someCondition, id, onRemove])
  return <div>...</div>
}
```

### Pattern 2: Conditional State Update

```typescript
// ❌ WRONG
function Toast({ expired, onRemove, id }) {
  if (expired) {
    onRemove(id)  // Called during render
  }
  return <div>...</div>
}

// ✅ CORRECT
function Toast({ expired, onRemove, id }) {
  useEffect(() => {
    if (expired) {
      onRemove(id)
    }
  }, [expired, id, onRemove])
  return <div>...</div>
}
```

### Pattern 3: Timer-based Removal

```typescript
// ❌ WRONG
function Toast({ duration, onRemove, id }) {
  setTimeout(() => onRemove(id), duration)  // Creates new timer every render!
  return <div>...</div>
}

// ✅ CORRECT
function Toast({ duration, onRemove, id }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), duration)
    return () => clearTimeout(timer)
  }, [duration, id, onRemove])
  return <div>...</div>
}
```

---

## Testing

After fixing, verify:

1. **No React warnings** in console
2. **Toasts display correctly** with gradients and animations
3. **Auto-dismiss works** without errors
4. **Multiple toasts stack** properly
5. **Interactive features work** (hover, click, swipe)
6. **SSR compatibility** - no hydration errors

### Test in TanStack Start

The library must work correctly with:
- Server-side rendering (SSR)
- Client-side hydration
- React 19
- Strict Mode

### Test Commands

```bash
npm run dev
# Navigate to /toast-test
# Click buttons to trigger toasts
# Check console for errors
```

---

## Verification Checklist

- [ ] No "Cannot update component during render" errors
- [ ] Toasts display with proper gradients
- [ ] Auto-dismiss timer works correctly
- [ ] Progress bar animates smoothly
- [ ] Hover to pause works
- [ ] Click to persist works
- [ ] Swipe to dismiss works
- [ ] Multiple toasts stack correctly
- [ ] No memory leaks (timers cleaned up)
- [ ] SSR/hydration works without errors

---

## Additional Context

### Test Environment

- **Framework**: TanStack Start (SSR)
- **React Version**: 19
- **Tailwind**: v4 (using `@source` directive)
- **Import Path**: `@prmichaelsen/pretty-toasts/standalone`

### Test Page

A comprehensive test page exists at `/toast-test` with:
- All toast types (success, error, warning, info)
- Duration tests (2s, 15s)
- Multiple toast stacking
- Progress upload simulation

### Expected Behavior

Toasts should:
1. Display immediately when triggered
2. Show gradient background and progress bar
3. Auto-dismiss after duration
4. Support hover, click, and swipe interactions
5. Stack properly when multiple toasts are shown
6. Clean up timers on unmount

---

## Priority

**High** - This blocks the toast system from working in production. The integration is complete on the consumer side, but the library needs this fix to function correctly.

---

**Next Steps**: Fix the state update during render issue in the Toast component by moving state updates to useEffect hooks.
