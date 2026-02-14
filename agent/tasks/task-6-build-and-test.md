# Task 6: Build and Test

**Milestone**: M1 - Core Library Implementation
**Estimated Time**: 1 hour
**Dependencies**: Tasks 1-5 (all code and config complete)
**Status**: Not Started

---

## Objective

Build the library and verify that everything works correctly. This includes installing dependencies, running the build, checking the output, and testing the library in a sample project.

---

## Steps

### 1. Install Dependencies

```bash
cd /home/prmichaelsen/pretty-toasts
npm install
```

Verify that all required dependencies are installed:
- Rollup and plugins
- TypeScript
- React (dev dependency)
- Redux Toolkit (dev dependency)

### 2. Clean Previous Builds

```bash
npm run clean
# or
rm -rf dist/
```

### 3. Run the Build

```bash
npm run build
```

Expected output:
```
src/index.ts → dist/index.js, dist/index.esm.js...
created dist/index.js, dist/index.esm.js in X.Xs
```

### 4. Verify Build Output

Check that all expected files were created:

```bash
ls -lh dist/
```

Expected files:
- `index.js` - CommonJS bundle
- `index.js.map` - CJS source map
- `index.esm.js` - ESM bundle
- `index.esm.js.map` - ESM source map
- `index.d.ts` - Main type declarations
- `types/` - Type definition files
- `components/` - Component type files
- `hooks/` - Hook type files
- `store/` - Store type files

### 5. Check File Sizes

```bash
du -h dist/index.js dist/index.esm.js
```

Expected sizes:
- CJS: ~30-50KB
- ESM: ~30-50KB

If larger, investigate what's being bundled.

### 6. Verify Exports

Test that all exports are accessible:

```bash
node -e "const lib = require('./dist/index.js'); console.log(Object.keys(lib).sort());"
```

Expected exports:
- ReduxToastContainer
- StandaloneToastContainer
- Toast
- ToastContainer
- ToastProvider
- addToast
- clearAllToasts
- makeToastPermanent
- pauseToast
- removeToast
- resumeToast
- selectActiveToasts
- selectPermanentToasts
- selectToasts
- toastReducer
- updateToast
- useMediaQuery
- useToast
- useToastContext

### 7. Check TypeScript Declarations

Verify type declarations are generated:

```bash
cat dist/index.d.ts
```

Should see all type exports and declarations.

### 8. Test in a Sample Project

Create a test project to verify the library works:

```bash
# Create test directory
mkdir -p /tmp/test-pretty-toasts
cd /tmp/test-pretty-toasts

# Initialize project
npm init -y

# Install dependencies
npm install react react-dom @reduxjs/toolkit react-redux

# Install local build
npm install /home/prmichaelsen/pretty-toasts
```

Create `test.js`:

```javascript
const { useToast, toastReducer, ReduxToastContainer } = require('pretty-toasts');

console.log('✓ CommonJS import works');
console.log('✓ useToast:', typeof useToast);
console.log('✓ toastReducer:', typeof toastReducer);
console.log('✓ ReduxToastContainer:', typeof ReduxToastContainer);
```

Run test:

```bash
node test.js
```

### 9. Test ESM Import

Create `test.mjs`:

```javascript
import { useToast, toastReducer, ReduxToastContainer } from 'pretty-toasts';

console.log('✓ ESM import works');
console.log('✓ useToast:', typeof useToast);
console.log('✓ toastReducer:', typeof toastReducer);
console.log('✓ ReduxToastContainer:', typeof ReduxToastContainer);
```

Run test:

```bash
node test.mjs
```

### 10. Test TypeScript Types

Create `test.ts`:

```typescript
import {
  Toast,
  ToastType,
  ToastOptions,
  useToast,
  ReduxToastContainer,
  StandaloneToastContainer,
  toastReducer,
} from 'pretty-toasts';

// Type checking
const toastType: ToastType = 'success';
const options: ToastOptions = {
  type: 'success',
  title: 'Test',
  message: 'Testing types',
};

console.log('✓ TypeScript types work');
```

Compile:

```bash
npx tsc test.ts --noEmit --esModuleInterop --jsx react
```

Should compile without errors.

---

## Verification Checklist

- [ ] `npm install` completes successfully
- [ ] `npm run build` completes without errors
- [ ] `dist/` directory created
- [ ] `dist/index.js` exists (CommonJS)
- [ ] `dist/index.esm.js` exists (ESM)
- [ ] `dist/index.d.ts` exists (types)
- [ ] Source maps generated
- [ ] File sizes are reasonable (<50KB each)
- [ ] All exports are present
- [ ] CommonJS import works
- [ ] ESM import works
- [ ] TypeScript types work
- [ ] No TypeScript errors
- [ ] No build warnings
- [ ] Peer dependencies not bundled
- [ ] React not bundled
- [ ] Redux not bundled

---

## Common Issues and Solutions

### Issue: "Cannot find module" during build

**Solution**: 
- Run `npm install` to ensure all dependencies are installed
- Check that all import paths are correct
- Verify file names match imports

### Issue: Build fails with TypeScript errors

**Solution**:
- Fix TypeScript errors in source files
- Check `tsconfig.json` configuration
- Ensure all types are properly defined

### Issue: Peer dependencies bundled

**Solution**:
- Check `external` array in `rollup.config.js`
- Verify `rollup-plugin-peer-deps-external` is working
- Check `peerDependencies` in `package.json`

### Issue: Types not generated

**Solution**:
- Ensure `declaration: true` in rollup typescript plugin
- Check `tsconfig.json` has `declaration: true`
- Verify `declarationDir` is set correctly

### Issue: Large bundle size

**Solution**:
- Check what's being bundled with `rollup-plugin-visualizer`
- Ensure peer dependencies are externalized
- Verify tree-shaking is working

---

## Success Criteria

✅ Build completes without errors
✅ All expected files generated
✅ File sizes are reasonable
✅ All exports accessible
✅ CommonJS works
✅ ESM works
✅ TypeScript types work
✅ No dependencies bundled incorrectly
✅ Library can be installed and used

---

## Notes

- This is the final task for Milestone 1
- After this, the core library is complete
- Next milestone focuses on testing and documentation
- Keep build output clean and optimized
- Document any build issues for future reference

---

## Files to Verify

1. `dist/index.js` - CommonJS bundle
2. `dist/index.esm.js` - ESM bundle
3. `dist/index.d.ts` - Type declarations
4. `dist/**/*.d.ts` - All type files
5. `dist/**/*.map` - Source maps

---

**Next Milestone**: M2 - Testing & Documentation (Tasks 7-9)
