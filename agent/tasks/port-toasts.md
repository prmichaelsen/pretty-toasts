# Task: Complete Pretty-Toasts Library Port

## Objective
Complete the portable toast notification library at `/home/prmichaelsen/pretty-toasts` that replicates the EXACT toast functionality and styling from the goodneighbor application.

## Context

### Source Application (goodneighbor)
The toast system in the goodneighbor application consists of:

1. **Redux State Management** - [`src/store/slices/uiSlice.ts`](../src/store/slices/uiSlice.ts)
   - Toast interface (lines 35-45): `{ id, type, title, message, duration, progress, isPaused, isPermanent, createdAt }`
   - ToastType: `"success" | "error" | "warning" | "info"`
   - Redux actions: `addToast`, `updateToast`, `removeToast`, `pauseToast`, `resumeToast`, `makeToastPermanent`, `clearAllToasts`

2. **UI Components**
   - [`src/components/ui/Toast.tsx`](../src/components/ui/Toast.tsx) - Individual toast with gradient styling, progress bar, swipe-to-dismiss
   - [`src/components/ui/ToastContainer.tsx`](../src/components/ui/ToastContainer.tsx) - Container managing positioning, animations, click-outside-to-dismiss

3. **Hook** - [`src/hooks/useToast.ts`](../src/hooks/useToast.ts)
   - Convenience methods: `toast()`, `success()`, `error()`, `warning()`, `info()`

### Key Features to Replicate EXACTLY
- ✅ Gradient backgrounds (purple/indigo for success, purple/rose for error, amber/orange for warning, blue/purple for info)
- ✅ Progress bar showing time remaining
- ✅ Swipe/drag to dismiss (mobile and desktop)
- ✅ Hover to pause timer
- ✅ Click to make permanent
- ✅ Auto-dismiss after duration (default 10s)
- ✅ Stacked positioning with smooth enter/exit animations
- ✅ Click outside to dismiss all
- ✅ Manual progress updates (for file uploads)
- ✅ Responsive design (33vw on desktop, full width on mobile)

## Current Progress

### ✅ Completed Files
1. `/home/prmichaelsen/pretty-toasts/package.json` - NPM package configuration with peer dependencies
2. `/home/prmichaelsen/pretty-toasts/tsconfig.json` - TypeScript configuration
3. `/home/prmichaelsen/pretty-toasts/src/types/index.ts` - Complete type definitions
4. `/home/prmichaelsen/pretty-toasts/src/store/toastSlice.ts` - Redux Toolkit slice (EXACT copy of logic)
5. `/home/prmichaelsen/pretty-toasts/src/components/Toast.tsx` - Toast component (EXACT copy with all styling)
6. `/home/prmichaelsen/pretty-toasts/src/components/ToastContainer.tsx` - Container component
7. `/home/prmichaelsen/pretty-toasts/src/hooks/ToastContext.tsx` - Standalone React Context provider
8. `/home/prmichaelsen/pretty-toasts/src/hooks/useToast.ts` - Universal hook (auto-detects Redux vs standalone)
9. `/home/prmichaelsen/pretty-toasts/src/index.ts` - Main export file
10. `/home/prmichaelsen/pretty-toasts/README.md` - Comprehensive documentation
11. `/home/prmichaelsen/pretty-toasts/.gitignore` - Git ignore file

### ❌ Missing Files (CRITICAL)

1. **Rollup Build Configuration** - `rollup.config.js`
   - Must bundle for both CommonJS and ESM
   - Must handle TypeScript compilation
   - Must generate type declarations
   - Must handle peer dependencies correctly
   - Must preserve Tailwind classes (don't process CSS)

2. **Redux Container Wrapper** - `src/components/ReduxToastContainer.tsx`
   - Connects ToastContainer to Redux store
   - Uses `useSelector(selectToasts)` and `useDispatch()`
   - Detects desktop/mobile with media query

3. **Standalone Container Wrapper** - `src/components/StandaloneToastContainer.tsx`
   - Connects ToastContainer to ToastContext
   - Uses `useToastContext()` hook
   - Detects desktop/mobile with media query

4. **useMediaQuery Hook** - `src/hooks/useMediaQuery.ts`
   - Required by ToastContainer for responsive behavior
   - Simple window.matchMedia wrapper

5. **ESLint Configuration** - `.eslintrc.js`
   - TypeScript and React rules

6. **NPM Ignore** - `.npmignore`
   - Exclude source files, only publish dist/

## Remaining Tasks

### 1. Create Missing Core Files

#### A. useMediaQuery Hook
```typescript
// src/hooks/useMediaQuery.ts
import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};
```

#### B. Redux Toast Container Wrapper
```typescript
// src/components/ReduxToastContainer.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from './ToastContainer';
import { selectToasts, removeToast, clearAllToasts } from '../store/toastSlice';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const ReduxToastContainer: React.FC = () => {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  return (
    <ToastContainer
      toasts={toasts}
      onRemoveToast={(id) => dispatch(removeToast(id))}
      onClearAll={() => dispatch(clearAllToasts())}
      isDesktop={isDesktop}
    />
  );
};
```

#### C. Standalone Toast Container Wrapper
```typescript
// src/components/StandaloneToastContainer.tsx
import React from 'react';
import { ToastContainer } from './ToastContainer';
import { useToastContext } from '../hooks/ToastContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const StandaloneToastContainer: React.FC = () => {
  const { toasts, removeToast, clearAllToasts } = useToastContext();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  return (
    <ToastContainer
      toasts={toasts}
      onRemoveToast={removeToast}
      onClearAll={clearAllToasts}
      isDesktop={isDesktop}
    />
  );
};
```

#### D. Rollup Configuration
```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
    }),
  ],
  external: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux'],
};
```

### 2. Update Index Exports

Update `src/index.ts` to export both wrapper components:

```typescript
// Add to exports:
export { ReduxToastContainer } from './components/ReduxToastContainer';
export { StandaloneToastContainer } from './components/StandaloneToastContainer';
export { useMediaQuery } from './hooks/useMediaQuery';
```

### 3. Build and Test

```bash
cd /home/prmichaelsen/pretty-toasts
npm install
npm run build
```

**VERIFICATION REQUIRED**: 
- Check that `dist/` directory is created
- Verify `dist/index.js` and `dist/index.esm.js` exist
- Verify `dist/index.d.ts` type declarations exist
- Check build logs for any errors

### 4. Create Example Usage Files

Create `examples/` directory with:
- `examples/with-redux.tsx` - Full Redux example
- `examples/standalone.tsx` - Full standalone example
- `examples/package.json` - Example dependencies

### 5. Testing

Create test files to verify:
- Toast rendering
- Redux integration
- Standalone context integration
- Animations work correctly
- Gestures work correctly

## Critical Requirements

### MUST MAINTAIN EXACT FEATURE PARITY
- All gradient colors EXACTLY as in source
- All animations EXACTLY as in source
- All gesture handling EXACTLY as in source
- Progress bar behavior EXACTLY as in source
- Positioning logic EXACTLY as in source

### MUST SUPPORT BOTH MODES
- Redux mode with Redux Toolkit
- Standalone mode with React Context
- Hook automatically detects which mode is available

### MUST BE PORTABLE
- No dependencies on goodneighbor-specific code
- Works with any React + Tailwind project
- Peer dependencies properly configured
- Build outputs both CJS and ESM

## Verification Checklist

Before marking complete, verify:

- [ ] All files created and no TypeScript errors
- [ ] `npm install` runs successfully
- [ ] `npm run build` completes without errors
- [ ] `dist/` contains all expected files
- [ ] Type declarations are generated
- [ ] README.md has complete usage examples
- [ ] Both Redux and standalone modes work
- [ ] Toasts look IDENTICAL to source application
- [ ] All gestures work (swipe, hover, click)
- [ ] Animations are smooth
- [ ] Responsive behavior works

## Reference Files

### Source Files to Reference
- [`/home/prmichaelsen/goodneighbor/src/components/ui/Toast.tsx`](../src/components/ui/Toast.tsx) - Original Toast component
- [`/home/prmichaelsen/goodneighbor/src/components/ui/ToastContainer.tsx`](../src/components/ui/ToastContainer.tsx) - Original container
- [`/home/prmichaelsen/goodneighbor/src/store/slices/uiSlice.ts`](../src/store/slices/uiSlice.ts) - Original Redux slice (lines 32-388, 700-705)
- [`/home/prmichaelsen/goodneighbor/src/hooks/useToast.ts`](../src/hooks/useToast.ts) - Original hook
- [`/home/prmichaelsen/goodneighbor/src/hooks/useMediaQuery.ts`](../src/hooks/useMediaQuery.ts) - Media query hook

### Target Library Location
`/home/prmichaelsen/pretty-toasts/`

## Notes

- The library uses Tailwind CSS classes - users must have Tailwind configured
- Redux dependencies are optional peer dependencies
- The hook automatically detects Redux vs standalone mode
- All styling is inline via Tailwind classes (no separate CSS files needed)
- Progress bar updates every 100ms for smooth animation
- Default toast duration is 10 seconds
- Toasts stack from bottom with 12px gap
- Exit animation is 300ms

## Success Criteria

1. Library builds without errors
2. Can be installed in another project
3. Works with Redux Toolkit
4. Works standalone without Redux
5. Toasts look and behave IDENTICALLY to source
6. All gestures and animations work
7. Responsive behavior matches source
8. Type definitions are complete and accurate
