# Task 1: Create useMediaQuery Hook

**Milestone**: M1 - Core Library Implementation
**Estimated Time**: 0.5 hours
**Dependencies**: None
**Status**: Not Started

---

## Objective

Create a simple `useMediaQuery` hook that wraps `window.matchMedia` to enable responsive behavior in the toast containers. This hook will detect whether the user is on desktop or mobile to adjust toast positioning and width.

---

## Steps

### 1. Create the Hook File

Create `src/hooks/useMediaQuery.ts`:

```typescript
import { useEffect, useState } from 'react';

/**
 * Hook to detect if a media query matches
 * @param query - CSS media query string (e.g., '(min-width: 640px)')
 * @returns boolean indicating if the query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Create listener for changes
    const listener = () => setMatches(media.matches);
    
    // Add listener (modern browsers)
    media.addEventListener('change', listener);
    
    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};
```

### 2. Add TypeScript Types (if needed)

The hook uses standard React and DOM types, so no additional type definitions are needed.

### 3. Test the Hook Locally

Create a simple test component to verify:

```typescript
// Test component (not to be committed)
import { useMediaQuery } from './useMediaQuery';

function TestComponent() {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  
  return (
    <div>
      <p>Is Desktop: {isDesktop ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

---

## Verification

- [ ] File `src/hooks/useMediaQuery.ts` created
- [ ] Hook exports `useMediaQuery` function
- [ ] Hook accepts a media query string parameter
- [ ] Hook returns a boolean
- [ ] Hook updates when window is resized
- [ ] TypeScript compiles without errors
- [ ] No console errors when using the hook
- [ ] Hook works with common breakpoints:
  - [ ] `(min-width: 640px)` for desktop detection
  - [ ] `(max-width: 639px)` for mobile detection
  - [ ] Custom queries work correctly

---

## Usage Example

```typescript
import { useMediaQuery } from './hooks/useMediaQuery';

function MyComponent() {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  
  return (
    <div style={{ width: isDesktop ? '33vw' : '100%' }}>
      {/* Content */}
    </div>
  );
}
```

---

## Notes

- This is a standard React hook pattern for media queries
- The hook automatically cleans up event listeners
- Works with any valid CSS media query string
- Re-renders component when media query match changes
- Breakpoint at 640px matches Tailwind's `sm` breakpoint
- Hook is reusable across the library

---

## Files to Create

1. `src/hooks/useMediaQuery.ts` - The hook implementation

---

**Next Task**: Task 2 - Create ReduxToastContainer Wrapper
