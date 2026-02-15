# Task 20: Fix Toast Drag Performance Issue

**Milestone**: M2 - Testing & Documentation
**Estimated Time**: 3-4 hours
**Priority**: Medium
**Status**: Not Started

---

## Objective

Fix the laggy and flickery behavior when dragging toast notifications to provide a smooth, responsive user experience at 60fps.

---

## Problem Statement

Toast notifications exhibit poor performance when being dragged:
- Laggy movement that doesn't follow cursor smoothly
- Visual flickering during drag operation
- Unresponsive feel with noticeable delay
- Stuttering behavior

This creates a poor user experience and makes the application feel unpolished.

---

## Root Causes

The performance issue is likely caused by:

1. **Excessive Re-renders** - State updates during drag triggering unnecessary re-renders
2. **Inefficient Event Handlers** - `onMouseMove` events not throttled/debounced
3. **Layout Thrashing** - Reading layout properties during drag (e.g., `getBoundingClientRect()`)
4. **Missing Performance Optimizations** - Not using `transform`, `requestAnimationFrame`, or GPU acceleration

---

## Solution

### Step 1: Analyze Current Implementation

Review [`src/components/Toast.tsx`](src/components/Toast.tsx:1) drag handlers:
- `handleMouseDown` (lines 71-84)
- `handleMouseMove` (lines 86-109)
- `handleMouseUp` (lines 111-129)
- `handleTouchStart`, `handleTouchMove`, `handleTouchEnd` (lines 37-68)

Identify performance bottlenecks:
- Are we using `top`/`left` or `transform`?
- Are event handlers memoized?
- Is there layout thrashing?
- Are we using `requestAnimationFrame`?

### Step 2: Use `transform` for Position Updates

Replace any `top`/`left` positioning with `transform: translate3d()`:

```tsx
// ❌ BAD - Causes layout recalculation
<div style={{ top: `${y}px`, left: `${x}px` }}>

// ✅ GOOD - Uses GPU acceleration
<div style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}>
```

### Step 3: Throttle Drag Events with `requestAnimationFrame`

```tsx
const rafId = useRef<number | null>(null);

const handleMouseMove = useCallback((e: React.MouseEvent) => {
  if (e.buttons !== 1) return;
  
  if (!rafId.current) {
    rafId.current = requestAnimationFrame(() => {
      const currentX = e.clientX;
      const deltaX = currentX - startX;
      
      if (Math.abs(deltaX) > 2) {
        setHasMoved(true);
      }
      
      if (Math.abs(deltaX) > 5 && !isDragging) {
        setIsDragging(true);
        setIsPaused(true);
      }
      
      if (isDragging && deltaX > 0) {
        setSwipeOffset(deltaX);
      }
      
      rafId.current = null;
    });
  }
}, [isDragging, startX]);

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
  };
}, []);
```

### Step 4: Add CSS Performance Hints

Update toast styles to include performance optimizations:

```tsx
const toastStyle: React.CSSProperties = {
  // ... existing styles
  willChange: isDragging ? 'transform' : 'auto',
  transform: `translateX(${swipeOffset}px)`,
  // Use translate3d for hardware acceleration
  // transform: `translate3d(${swipeOffset}px, 0, 0)`,
};
```

### Step 5: Cache Layout Info Before Drag

Prevent layout thrashing by caching measurements:

```tsx
const initialRect = useRef<DOMRect | null>(null);

const handleMouseDown = useCallback((e: React.MouseEvent) => {
  setStartX(e.clientX);
  setMouseDownTime(Date.now());
  setHasMoved(false);
  setIsDragging(false);
  
  // Cache layout info once at start
  if (toastRef.current) {
    initialRect.current = toastRef.current.getBoundingClientRect();
  }
  
  if (!toast.isPermanent) {
    setIsPaused(true);
  }
}, [toast.isPermanent]);
```

### Step 6: Optimize Touch Events Similarly

Apply the same optimizations to touch handlers:

```tsx
const handleTouchMove = useCallback((e: React.TouchEvent) => {
  if (!isDragging) return;
  
  if (!rafId.current) {
    rafId.current = requestAnimationFrame(() => {
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const deltaX = currentX - startX;
      
      if (deltaX > 0) {
        setSwipeOffset(deltaX);
      }
      
      rafId.current = null;
    });
  }
}, [isDragging, startX]);
```

---

## Testing

### Manual Testing

1. **Smoothness Test**:
   - Drag toast slowly - should follow cursor smoothly
   - Drag toast quickly - should keep up without lag
   - Drag multiple toasts - performance should remain consistent

2. **Visual Test**:
   - No flickering during drag
   - No stuttering or jank
   - Smooth animation at 60fps

3. **Browser Test**:
   - Test in Chrome DevTools Performance tab
   - Check frame rate during drag (should be 60fps)
   - Verify no layout thrashing in Performance timeline

4. **Device Test**:
   - Test on desktop (mouse drag)
   - Test on mobile (touch drag)
   - Test on tablet

### Performance Metrics

Use Chrome DevTools to measure:
- **Frame Rate**: Should be 60fps during drag
- **CPU Usage**: Should remain low (<30%)
- **Layout Recalculations**: Should be minimal
- **Paint Operations**: Should be optimized

### Automated Testing

Update Cypress tests to verify drag performance:

```typescript
// cypress/e2e/toast-performance.cy.ts
describe('Toast Drag Performance', () => {
  it('drags smoothly without lag', () => {
    cy.visit('/');
    cy.clickButton('Success');
    
    cy.get('[role="alert"]')
      .trigger('mousedown', { clientX: 100 })
      .trigger('mousemove', { clientX: 200, buttons: 1 })
      .trigger('mousemove', { clientX: 300, buttons: 1 })
      .trigger('mouseup');
    
    // Toast should have moved smoothly
    cy.get('[role="alert"]').should('not.exist');
  });
});
```

---

## Verification Checklist

- [ ] Toast drags smoothly at 60fps without lag
- [ ] No visual flickering during drag
- [ ] Drag feels responsive and follows cursor immediately
- [ ] No performance degradation with multiple toasts
- [ ] Works consistently across Chrome, Firefox, and Safari
- [ ] Works on both desktop (mouse) and mobile (touch) devices
- [ ] No memory leaks from event listeners or `requestAnimationFrame`
- [ ] CPU usage remains low during drag operations
- [ ] Chrome DevTools Performance tab shows no layout thrashing
- [ ] Frame rate stays at 60fps during drag

---

## Alternative Solution: Disable Dragging

If performance cannot be fixed immediately, add option to disable dragging:

```tsx
// In ToastProvider
export interface ToastProviderProps {
  children: React.ReactNode;
  theme?: PartialTheme;
  draggable?: boolean; // New prop
}

// In Toast component
interface ToastProps {
  toast: ToastType;
  isExiting?: boolean;
  onRemove: () => void;
  onMakePermanent?: () => void;
  draggable?: boolean; // New prop
}

// Conditionally attach drag handlers
{draggable !== false && (
  <div
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
)}
```

---

## Files to Modify

1. [`src/components/Toast.tsx`](src/components/Toast.tsx:1) - Main drag logic
2. [`src/types/index.ts`](src/types/index.ts:1) - Add `draggable` prop to types (if implementing alternative)
3. [`cypress/e2e/toast-performance.cy.ts`](cypress/e2e/toast-performance.cy.ts:1) - New performance tests

---

## Success Criteria

- Toast drag operations feel smooth and responsive
- No visual artifacts (flickering, stuttering)
- Performance metrics show 60fps during drag
- Chrome DevTools shows minimal layout recalculations
- Works consistently across all browsers and devices
- No regression in other toast functionality

---

## Notes

- This issue was discovered during error toast implementation for image uploads
- The laggy behavior significantly impacts user experience
- Performance optimizations should not break existing functionality
- Consider adding performance monitoring to detect regressions

---

**Status**: Not Started
**Estimated Completion**: 3-4 hours
**Priority**: Medium (affects UX but not core functionality)
