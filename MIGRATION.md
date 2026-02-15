# Migration Guide: v2.x → v3.0.0

## Overview

Version 3.0.0 removes the Tailwind CSS dependency and uses inline styles instead. This is a **major improvement** that eliminates the need for CSS configuration, but it's a breaking change if you were customizing toast styles via Tailwind.

## Breaking Changes

### 1. Tailwind CSS No Longer Required

**Before (v2.x):**
```javascript
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@prmichaelsen/pretty-toasts/dist/**/*.{js,mjs}",
  ],
}
```

**After (v3.0.0):**
```javascript
// No Tailwind configuration needed!
// Just install and use the library
```

### 2. Custom Styling via Tailwind No Longer Possible

**Before (v2.x):**
You could customize toast colors by extending the Tailwind theme:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#custom-purple',
        },
      },
    },
  },
}
```

**After (v3.0.0):**
Toast colors are now fixed inline styles. To customize, you'll need to fork the library or use CSS overrides (not recommended).

## Migration Steps

### Step 1: Update Package Version

```bash
npm install @prmichaelsen/pretty-toasts@^3.0.0
# or
yarn add @prmichaelsen/pretty-toasts@^3.0.0
# or
pnpm add @prmichaelsen/pretty-toasts@^3.0.0
```

### Step 2: Remove Tailwind Configuration (Optional)

If you were only using Tailwind for pretty-toasts, you can now remove it:

```bash
npm uninstall tailwindcss autoprefixer postcss
```

And remove these files:
- `tailwind.config.js`
- `postcss.config.js`

If you're using Tailwind for other parts of your app, just remove the pretty-toasts configuration:

```diff
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
-   "./node_modules/@prmichaelsen/pretty-toasts/dist/**/*.{js,mjs}",
  ],
}
```

### Step 3: Remove CSS Imports (If Any)

If you were importing Tailwind CSS specifically for pretty-toasts:

```diff
- import 'tailwindcss/tailwind.css';
```

### Step 4: Test Your Application

The toasts should work exactly the same, but now with zero configuration:

```typescript
import { useToast } from '@prmichaelsen/pretty-toasts';

function MyComponent() {
  const { success } = useToast();
  
  return (
    <button onClick={() => success({ title: 'Success!', message: 'It works!' })}>
      Show Toast
    </button>
  );
}
```

## What Stays the Same

✅ **API is unchanged** - All hooks, components, and functions work exactly the same
✅ **Visual appearance** - All gradients, colors, and animations are identical
✅ **Functionality** - All features (swipe, hover, progress, etc.) work the same
✅ **TypeScript types** - All types remain the same
✅ **Redux & Standalone modes** - Both modes work identically

## Benefits of Upgrading

### 1. Zero Configuration
No need to configure Tailwind CSS scanning or worry about CSS not loading.

### 2. Smaller Bundle
Removed 4 dependencies:
- `tailwindcss`
- `autoprefixer`
- `postcss`
- `rollup-plugin-postcss`

### 3. Universal Compatibility
Works with any CSS framework or no framework at all:
- ✅ Bootstrap
- ✅ Material-UI
- ✅ Chakra UI
- ✅ Vanilla CSS
- ✅ No CSS framework

### 4. Faster Setup
```bash
npm install @prmichaelsen/pretty-toasts
# Done! No configuration needed
```

## Troubleshooting

### Issue: Toasts Don't Appear

**Solution:** Make sure you have the toast container in your app:

```tsx
// With Redux
import { ReduxToastContainer } from '@prmichaelsen/pretty-toasts';

function App() {
  return (
    <>
      {/* Your app */}
      <ReduxToastContainer />
    </>
  );
}

// Standalone
import { ToastProvider, StandaloneToastContainer } from '@prmichaelsen/pretty-toasts';

function App() {
  return (
    <ToastProvider>
      {/* Your app */}
      <StandaloneToastContainer />
    </ToastProvider>
  );
}
```

### Issue: Toasts Look Different

**Solution:** They shouldn't! All colors and styles are preserved. If they look different:
1. Clear your browser cache
2. Rebuild your application
3. Check that you're using v3.0.0: `npm list @prmichaelsen/pretty-toasts`

### Issue: TypeScript Errors

**Solution:** The types haven't changed. Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Need Custom Styling?

If you need to customize toast appearance, you have these options:

### Option 1: Stay on v2.x
If Tailwind customization is critical, stay on v2.x:
```bash
npm install @prmichaelsen/pretty-toasts@^2.1.4
```

### Option 2: CSS Overrides (Not Recommended)
You can override styles with CSS, but this is fragile:
```css
/* Not recommended - may break in future versions */
[data-toast-container] > div > div {
  /* Your custom styles */
}
```

### Option 3: Fork the Library
For extensive customization, fork the library and modify the inline styles in:
- `src/styles/colors.ts`
- `src/styles/helpers.ts`

## Rollback Instructions

If you need to rollback to v2.x:

```bash
npm install @prmichaelsen/pretty-toasts@^2.1.4
```

Then restore your Tailwind configuration:

```javascript
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@prmichaelsen/pretty-toasts/dist/**/*.{js,mjs}",
  ],
}
```

## Questions?

If you have questions or issues with the migration:
1. Check the [README](README.md) for updated documentation
2. Open an issue on [GitHub](https://github.com/prmichaelsen/pretty-toasts/issues)
3. Review the [CHANGELOG](CHANGELOG.md) for detailed changes

## Summary

**TL;DR:**
- ✅ Update to v3.0.0
- ✅ Remove Tailwind configuration for pretty-toasts
- ✅ Everything else stays the same
- 🎉 Enjoy zero-configuration toasts!

The migration is straightforward for most users - just update the package and remove the Tailwind configuration. The library now works out-of-the-box with no setup required!
