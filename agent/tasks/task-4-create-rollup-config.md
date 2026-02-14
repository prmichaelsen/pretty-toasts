# Task 4: Create Rollup Build Configuration

**Milestone**: M1 - Core Library Implementation
**Estimated Time**: 2 hours
**Dependencies**: Tasks 1-3 (all components created)
**Status**: Not Started

---

## Objective

Create a Rollup configuration to build the library for distribution. The build must output both CommonJS and ESM formats, generate TypeScript declarations, handle peer dependencies correctly, and preserve Tailwind CSS classes without processing them.

---

## Steps

### 1. Install Required Dependencies

```bash
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript rollup-plugin-peer-deps-external tslib
```

### 2. Create Rollup Configuration

Create `rollup.config.js`:

```javascript
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
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    // Automatically externalize peer dependencies
    peerDepsExternal(),
    
    // Resolve node_modules
    resolve(),
    
    // Convert CommonJS modules to ES6
    commonjs(),
    
    // Compile TypeScript
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
    }),
  ],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@reduxjs/toolkit',
    'react-redux',
  ],
};
```

### 3. Update TypeScript Configuration for Build

Update `tsconfig.json` to ensure proper declaration generation:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

### 4. Update Package.json Scripts

Ensure these scripts exist in `package.json`:

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "prepublishOnly": "npm run build",
    "clean": "rm -rf dist"
  }
}
```

### 5. Update Package.json Main Fields

Ensure proper entry points in `package.json`:

```json
{
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "sideEffects": false
}
```

### 6. Create .npmignore

Create `.npmignore` to exclude source files from npm package:

```
src/
.github/
agent/
cypress/
.storybook/
storybook-static/
*.log
*.spec.ts
*.test.ts
*.cy.ts
tsconfig.json
rollup.config.js
.eslintrc.js
cypress.config.ts
```

---

## Verification

- [ ] `rollup.config.js` created
- [ ] All required Rollup plugins installed
- [ ] `npm run build` completes without errors
- [ ] `dist/` directory is created
- [ ] `dist/index.js` exists (CommonJS)
- [ ] `dist/index.esm.js` exists (ESM)
- [ ] `dist/index.d.ts` exists (TypeScript declarations)
- [ ] Source maps generated (`.map` files)
- [ ] Peer dependencies are NOT bundled
- [ ] React is NOT bundled
- [ ] Redux is NOT bundled
- [ ] TypeScript types are correct and complete
- [ ] Build output is clean (no warnings)
- [ ] File sizes are reasonable:
  - [ ] CJS bundle < 50KB
  - [ ] ESM bundle < 50KB
- [ ] `.npmignore` excludes source files

---

## Testing the Build

### 1. Build the Library

```bash
npm run clean
npm run build
```

### 2. Check Output Structure

```bash
ls -lh dist/
```

Should see:
- `index.js` (CommonJS)
- `index.js.map` (source map)
- `index.esm.js` (ESM)
- `index.esm.js.map` (source map)
- `index.d.ts` (TypeScript declarations)
- Various `.d.ts` files for types

### 3. Verify Exports

Check that all exports are present:

```bash
node -e "console.log(Object.keys(require('./dist/index.js')))"
```

Should include:
- Toast
- ToastContainer
- ReduxToastContainer
- StandaloneToastContainer
- ToastProvider
- useToast
- useToastContext
- useMediaQuery
- toastReducer
- addToast, removeToast, etc.

### 4. Test in a Sample Project

Create a test project and install the local build:

```bash
cd /tmp
mkdir test-pretty-toasts
cd test-pretty-toasts
npm init -y
npm install /path/to/pretty-toasts
```

---

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution**: Ensure all imports use correct paths and extensions

### Issue: Peer dependencies bundled

**Solution**: Check `external` array in rollup.config.js

### Issue: TypeScript declarations not generated

**Solution**: 
- Check `declaration: true` in rollup typescript plugin
- Verify `tsconfig.json` has `declaration: true`

### Issue: Build is too large

**Solution**:
- Verify peer dependencies are externalized
- Check that React/Redux are not bundled
- Use `rollup-plugin-visualizer` to analyze bundle

---

## Notes

- Rollup is ideal for libraries (vs Webpack for apps)
- CommonJS for older Node.js compatibility
- ESM for modern bundlers (tree-shaking)
- Peer dependencies must NOT be bundled
- Tailwind classes are preserved as strings (not processed)
- Source maps help with debugging
- TypeScript declarations enable IntelliSense
- `sideEffects: false` enables tree-shaking

---

## Files to Create/Modify

1. `rollup.config.js` - Rollup configuration
2. `.npmignore` - NPM ignore file
3. `tsconfig.json` - Update for build
4. `package.json` - Update scripts and fields

---

**Next Task**: Task 5 - Update Index Exports
