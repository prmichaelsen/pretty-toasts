# Task: Storybook Troubleshooting Session - 2026-02-14

**Status**: BLOCKED - Infinite Loading Issue
**Time Spent**: ~2 hours
**Last Updated**: 2026-02-14

---

## Objective

Set up a working Storybook instance for the pretty-toasts library to provide interactive component documentation and demos.

---

## Problem Description

Storybook loads the UI (sidebar, navigation) but **all stories show infinite loading spinner**. The iframe that renders stories returns **500 Internal Server Error**.

### Error Details

```
GET http://137.184.37.88:6006/iframe.html?id=test-dummy--green&viewMode=story 
→ 500 (Internal Server Error)
```

Browser console shows repeated failed requests to load iframe.html.

---

## Environment Details

- **Machine**: Remote server (accessed via network IP, not localhost)
- **Access URL**: http://137.184.37.88:6006/
- **Node Version**: 18+
- **Vite Version**: 7.3.1
- **TypeScript**: 5.0.0
- **React**: 18.0.0

---

## What Was Tried

### 1. Initial Setup (Storybook 10.2.8)

```bash
npx storybook@latest init --type react
```

**Result**: ❌ Installed Storybook 10.2.8 (latest, but buggy)
- Stories showed infinite loading
- 500 errors on iframe.html

### 2. TypeScript Configuration Fixes

**Issue**: `moduleResolution: "bundler"` incompatible with Storybook

**Fix Attempted**:
- Changed `tsconfig.json` to `moduleResolution: "bundler"`
- Created `.storybook/tsconfig.json` with `moduleResolution: "node"`
- Removed `rootDir: "./src"` to allow `.storybook/**/*` files

**Files Modified**:
- [`tsconfig.json`](../../tsconfig.json:1)
- [`.storybook/tsconfig.json`](../../.storybook/tsconfig.json:1)

**Result**: ❌ Still infinite loading

### 3. Vite Configuration

**Created**: [`vite.config.ts`](../../vite.config.ts:1)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    strictPort: false,
  },
  css: {
    postcss: './postcss.config.js',
  },
});
```

**Installed**:
- `@vitejs/plugin-react`
- `vite`

**Result**: ❌ Still infinite loading

### 4. Tailwind CSS Configuration

**Created**:
- [`tailwind.config.js`](../../tailwind.config.js:1)
- [`postcss.config.js`](../../postcss.config.js:1)
- [`src/styles.css`](../../src/styles.css:1)

**Modified**: [`.storybook/preview.ts`](../../.storybook/preview.ts:1) to import styles

**Result**: ❌ Still infinite loading

### 5. Story File Fixes

**Attempted**:
- Changed from `satisfies` syntax to explicit type annotations
- Set `isPermanent: true` on toasts to prevent auto-dismiss
- Added `onRemove` and `onMakePermanent` callbacks
- Created simple test components (Dummy, Simple)

**Files Created**:
- [`src/components/Toast.stories.tsx`](../../src/components/Toast.stories.tsx:1)
- [`src/components/Dummy.tsx`](../../src/components/Dummy.tsx:1)
- [`src/components/Dummy.stories.tsx`](../../src/components/Dummy.stories.tsx:1)
- [`src/components/Simple.tsx`](../../src/components/Simple.tsx:1)
- [`src/components/Simple.stories.tsx`](../../src/components/Simple.stories.tsx:1)

**Result**: ❌ All stories show infinite loading

### 6. Downgrade to Storybook 8 (LTS)

**Reason**: Storybook 10.2.8 has known bugs with react-vite

**Commands**:
```bash
npm uninstall storybook @storybook/react-vite @storybook/addon-vitest @storybook/addon-a11y @storybook/addon-docs @chromatic-com/storybook

npm install --save-dev storybook@^8.0.0 @storybook/react-vite@^8.0.0 @storybook/addon-essentials@^8.0.0 @storybook/addon-interactions@^8.0.0 @storybook/addon-links@^8.0.0 @storybook/blocks@^8.0.0 --legacy-peer-deps
```

**Updated**: [`.storybook/main.ts`](../../.storybook/main.ts:1) for v8 format

**Result**: ❌ Still infinite loading (even with stable LTS version)

### 7. Removed Example Stories

**Reason**: Example stories used `'storybook/test'` which doesn't exist in v8

**Action**: Deleted `src/stories/` directory

**Result**: ❌ Still infinite loading with our custom stories

### 8. Cache Clearing

```bash
rm -rf node_modules/.cache node_modules/.vite
```

**Result**: ❌ Still infinite loading

---

## Current Configuration

### Storybook Version
- **storybook**: 8.6.15
- **@storybook/react-vite**: 8.6.15
- **@storybook/addon-essentials**: 8.6.14

### Key Files

1. **[`.storybook/main.ts`](../../.storybook/main.ts:1)**
```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
```

2. **[`.storybook/preview.ts`](../../.storybook/preview.ts:1)**
```typescript
import type { Preview } from '@storybook/react-vite'
// import '../src/styles.css'; // Temporarily disabled

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;
```

3. **[`.storybook/tsconfig.json`](../../.storybook/tsconfig.json:1)**
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "moduleResolution": "node",
    "allowImportingTsExtensions": false,
    "noEmit": true
  }
}
```

4. **[`vite.config.ts`](../../vite.config.ts:1)**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
  },
  css: {
    postcss: './postcss.config.js',
  },
});
```

---

## Symptoms

1. **Storybook UI loads** - Sidebar, navigation, controls all visible
2. **Stories list appears** - Can see story names in sidebar
3. **Story iframe fails** - 500 Internal Server Error
4. **Infinite loading spinner** - Never resolves
5. **Affects ALL stories** - Including simple test components
6. **No specific error messages** - Just 500 errors in browser console

---

## Hypotheses

### 1. Vite 7 Incompatibility (Most Likely)

**Evidence**:
- Storybook 8 officially supports Vite 4-6
- We have Vite 7.3.1
- Used `--legacy-peer-deps` to bypass version check
- This may cause runtime incompatibilities

**Test**: Downgrade Vite to 5.x

### 2. Remote Machine Access Issue

**Evidence**:
- Accessing via network IP (137.184.37.88) not localhost
- May have CORS or WebSocket issues
- HMR (Hot Module Replacement) may not work over network

**Test**: Try SSH tunnel or local access

### 3. Module Resolution Still Broken

**Evidence**:
- Multiple TypeScript configuration attempts
- `moduleResolution: "bundler"` vs `"node"`
- May still have import resolution issues

**Test**: Simplify tsconfig to absolute minimum

### 4. React/JSX Transform Issue

**Evidence**:
- Changed `jsx: "react"` to `jsx: "react-jsx"`
- May need different JSX configuration for Storybook

**Test**: Try `jsx: "react"` or other JSX settings

### 5. Tailwind CSS Build Hang

**Evidence**:
- PostCSS/Tailwind in the build chain
- Currently disabled in preview.ts
- May still be processed by Vite

**Test**: Remove Tailwind completely from build

---

## Next Steps to Debug

### Priority 1: Downgrade Vite

```bash
npm install --save-dev vite@^5.0.0 --legacy-peer-deps
```

Storybook 8 officially supports Vite 5, not Vite 7.

### Priority 2: Check Browser Console

Look for specific JavaScript errors when story loads:
- Module resolution errors
- React rendering errors
- Build/compilation errors

### Priority 3: Simplify Configuration

Remove all customizations and use absolute minimal config:
- No Tailwind
- No custom Vite config
- Minimal tsconfig
- Simple component with no dependencies

### Priority 4: Test Locally

If possible, test on the actual server (localhost:6006) rather than remote access to rule out network issues.

---

## Files Created During Session

### Configuration
- [`.storybook/main.ts`](../../.storybook/main.ts:1) - Storybook config (v8 format)
- [`.storybook/preview.ts`](../../.storybook/preview.ts:1) - Preview config
- [`.storybook/tsconfig.json`](../../.storybook/tsconfig.json:1) - TypeScript override
- [`vite.config.ts`](../../vite.config.ts:1) - Vite configuration
- [`tailwind.config.js`](../../tailwind.config.js:1) - Tailwind config
- [`postcss.config.js`](../../postcss.config.js:1) - PostCSS config
- [`src/styles.css`](../../src/styles.css:1) - Tailwind imports

### Test Components
- [`src/components/Simple.tsx`](../../src/components/Simple.tsx:1) - Minimal component (inline styles)
- [`src/components/Simple.stories.tsx`](../../src/components/Simple.stories.tsx:1) - Simple stories
- [`src/components/Dummy.tsx`](../../src/components/Dummy.tsx:1) - Dummy component (Tailwind)
- [`src/components/Dummy.stories.tsx`](../../src/components/Dummy.stories.tsx:1) - Dummy stories
- [`src/components/Toast.stories.tsx`](../../src/components/Toast.stories.tsx:1) - Toast stories

---

## Versions Tested

| Package | Version | Result |
|---------|---------|--------|
| Storybook | 10.2.8 | ❌ Infinite loading |
| Storybook | 8.6.15 | ❌ Infinite loading |
| Vite | 7.3.1 | ❌ May be incompatible |

---

## Research Findings

### Brave Search Results

1. **Storybook 10 has known bugs** with react-vite causing 500 errors on iframe.html
2. **Vite version compatibility** is critical - Storybook 8 supports Vite 4-6, not 7
3. **Remote access** can cause issues with HMR and WebSocket connections
4. **TypeScript moduleResolution** must be "node" for Storybook, not "bundler"

### GitHub Issues Referenced

- #26319 - Infinite spinner with Vite 5.1.x in Docker
- #30878 - Nextjs-Vite broken in fresh install (500 error)
- #33629 - Deployed versions not loading with v10.2.0
- #17329 - Storybook stuck loading

---

## Recommended Solution Path

### Option A: Downgrade Vite (Recommended)

1. Downgrade Vite to 5.x:
   ```bash
   npm install --save-dev vite@^5.4.0 --legacy-peer-deps
   ```

2. Restart Storybook:
   ```bash
   npm run storybook
   ```

3. Test if stories load

### Option B: Fresh Storybook Init

1. Delete all Storybook files:
   ```bash
   rm -rf .storybook src/stories node_modules/.cache
   ```

2. Re-initialize with Storybook 8:
   ```bash
   npx storybook@8 init --type react
   ```

3. Let it auto-configure everything

### Option C: Alternative Documentation

If Storybook continues to fail:
- Use **Docusaurus** for documentation
- Use **React Styleguidist** as alternative
- Create simple **demo HTML page** with examples
- Use **Ladle** (lightweight Storybook alternative)

---

## Key Learnings

1. **Always use LTS versions** - `npx storybook@8 init` not `@latest`
2. **Check Vite compatibility** - Storybook has strict Vite version requirements
3. **Remote access matters** - Network access can cause issues with HMR/WebSockets
4. **TypeScript moduleResolution** - "bundler" doesn't work with Storybook, use "node"
5. **Version mismatches cause silent failures** - Vite 7 + Storybook 8 = problems

---

## Current Blockers

1. **Vite 7.3.1 incompatibility** - Storybook 8 only supports Vite 4-6
2. **Unknown build/bundle issue** - Something in the pipeline is failing silently
3. **Remote machine access** - May be contributing to the problem

---

## Files to Review

If picking this up in a future session, check:

1. **Browser console** (F12) - Look for specific JavaScript errors
2. **Storybook terminal** - Check for build errors or warnings
3. **package.json** - Verify all version compatibilities
4. **Vite version** - Should be 5.x for Storybook 8

---

## Success Criteria (Not Yet Met)

- [ ] Storybook loads without infinite spinner
- [ ] Stories render in iframe
- [ ] Can interact with components
- [ ] Tailwind styles apply correctly
- [ ] All toast variants visible
- [ ] No 500 errors in console

---

## Estimated Time to Fix

- **If Vite downgrade works**: 30 minutes
- **If fresh init needed**: 1 hour
- **If alternative solution**: 2-3 hours

---

**Status**: BLOCKED - Requires Vite downgrade or alternative approach
**Next Action**: Downgrade Vite to 5.x and test
