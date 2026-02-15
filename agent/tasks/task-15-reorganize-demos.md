# Task 15: Reorganize Demos - Standalone & Redux Examples

**Milestone**: M2 - Testing & Documentation  
**Estimated Time**: 3-4 hours  
**Dependencies**: Task 12 (GitHub Pages Demo)  
**Status**: Not Started

---

## Objective

Reorganize the demo structure to provide separate, complete examples for both standalone and Redux Toolkit usage patterns. This will help users understand how to integrate the library in their specific setup.

---

## Problem Statement

Currently:
- Single demo using standalone mode only
- No Redux Toolkit example
- Users need to figure out Redux integration themselves
- No side-by-side comparison of both modes

A better structure would:
- Provide complete working examples for both modes
- Show best practices for each integration pattern
- Make it easy to copy-paste into projects
- Demonstrate that both modes work identically

---

## Solution

Create a `demos/` directory with two separate demo apps:

```
demos/
├── standalone/          # Standalone React Context demo
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── redux/              # Redux Toolkit demo
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── store.ts
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

---

## Implementation Steps

### 1. Rename Current Demo Directory

```bash
# Move current demo to demos/standalone
mkdir -p demos
mv demo demos/standalone
```

### 2. Create Redux Demo Structure

```bash
mkdir -p demos/redux/src
```

### 3. Create Redux Demo Package.json

**File**: `demos/redux/package.json`

```json
{
  "name": "pretty-toasts-demo-redux",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@prmichaelsen/pretty-toasts": "file:../..",
    "@reduxjs/toolkit": "^2.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-redux": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^6.0.3"
  }
}
```

### 4. Create Redux Store

**File**: `demos/redux/src/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit'
import { toastReducer } from '@prmichaelsen/pretty-toasts/redux'

export const store = configureStore({
  reducer: {
    prettyToasts: toastReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### 5. Create Redux Demo App

**File**: `demos/redux/src/App.tsx`

```typescript
import React from 'react'
import { useToast } from '@prmichaelsen/pretty-toasts/redux'

function App() {
  const toast = useToast()

  // Same handlers as standalone demo
  const handleSuccess = () => {
    toast.success({
      id: `success-${Date.now()}`,
      title: 'Success!',
      message: 'This is a success toast notification',
      duration: 5000,
    })
  }

  // ... (all other handlers same as standalone)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1e1b4b, #581c87, #1e1b4b)',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
          Toast Test Page (Redux)
        </h1>
        <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>
          Test the @prmichaelsen/pretty-toasts library with Redux Toolkit
        </p>

        {/* Same UI as standalone demo */}
      </div>
    </div>
  )
}

export default App
```

### 6. Create Redux Demo Entry Point

**File**: `demos/redux/src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ReduxToastContainer } from '@prmichaelsen/pretty-toasts/redux'
import { store } from './store'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ReduxToastContainer />
    </Provider>
  </React.StrictMode>,
)
```

### 7. Update Standalone Demo Title

**File**: `demos/standalone/src/App.tsx`

Change title to indicate it's the standalone version:

```typescript
<h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
  Toast Test Page (Standalone)
</h1>
<p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>
  Test the @prmichaelsen/pretty-toasts library with React Context
</p>
```

### 8. Create Demos README

**File**: `demos/README.md`

```markdown
# Pretty Toasts Demos

This directory contains complete working examples of the pretty-toasts library.

## Available Demos

### 1. Standalone Demo (`demos/standalone/`)

Uses React Context for state management. Perfect for projects without Redux.

**Run locally:**
```bash
cd demos/standalone
npm install
npm run dev
```

**Features:**
- React Context API
- ToastProvider + StandaloneToastContainer
- useToast() hook
- Zero Redux dependencies

### 2. Redux Demo (`demos/redux/`)

Uses Redux Toolkit for state management. Perfect for projects already using Redux.

**Run locally:**
```bash
cd demos/redux
npm install
npm run dev
```

**Features:**
- Redux Toolkit integration
- Redux Provider + ReduxToastContainer
- useToast() hook (same API as standalone)
- Automatic Redux store integration

## Key Differences

| Feature | Standalone | Redux |
|---------|-----------|-------|
| State Management | React Context | Redux Toolkit |
| Setup Complexity | Simple | Moderate |
| Provider | `<ToastProvider>` | `<Provider store={store}>` |
| Container | `<StandaloneToastContainer />` | `<ReduxToastContainer />` |
| Hook API | `useToast()` | `useToast()` (identical) |
| Redux Required | ❌ No | ✅ Yes |

## Identical Features

Both demos have the exact same:
- Toast types (success, error, warning, info)
- Interactive features (hover, click, swipe)
- Progress bar support
- Auto-dismiss functionality
- Custom theme support
- Beautiful gradient styling

## Which Should I Use?

- **Use Standalone** if you don't have Redux in your project
- **Use Redux** if you already use Redux Toolkit
- Both work identically from the user's perspective!
```

### 9. Update Root Package.json Scripts

**File**: `package.json`

```json
{
  "scripts": {
    "demo:standalone": "cd demos/standalone && npm run dev",
    "demo:redux": "cd demos/redux && npm run dev",
    "demo:build": "npm run build && cd demos/standalone && npm run build && cd ../redux && npm run build",
    "demo:install": "cd demos/standalone && npm install && cd ../redux && npm install"
  }
}
```

### 10. Update GitHub Actions Workflow

**File**: `.github/workflows/deploy-demo.yml`

Update to build both demos and deploy standalone to GitHub Pages:

```yaml
- name: Install standalone demo dependencies
  run: cd demos/standalone && npm ci

- name: Build standalone demo
  run: cd demos/standalone && npm run build

- name: Install redux demo dependencies
  run: cd demos/redux && npm ci

- name: Build redux demo
  run: cd demos/redux && npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./demos/standalone/dist
```

### 11. Update README.md

Add section explaining the demos:

```markdown
## Examples

Check out the complete working examples in the `demos/` directory:

- **[Standalone Demo](demos/standalone/)** - Using React Context (no Redux)
- **[Redux Demo](demos/redux/)** - Using Redux Toolkit

Both demos showcase all features and can be run locally.
```

---

## Verification

### Test Standalone Demo

```bash
cd demos/standalone
npm install
npm run dev
```

Visit `http://localhost:5173` and verify:
- [ ] All toast types work
- [ ] Stacking works correctly
- [ ] Progress updates work
- [ ] No console errors
- [ ] Title says "Standalone"

### Test Redux Demo

```bash
cd demos/redux
npm install
npm run dev
```

Visit `http://localhost:5173` and verify:
- [ ] All toast types work
- [ ] Stacking works correctly
- [ ] Progress updates work
- [ ] No console errors
- [ ] Title says "Redux"
- [ ] Redux DevTools shows toast state

### Build Both Demos

```bash
npm run demo:build
```

Verify:
- [ ] Standalone demo builds successfully
- [ ] Redux demo builds successfully
- [ ] No build errors
- [ ] Both dist/ directories created

---

## Benefits

1. **Clear Examples**: Users see exactly how to integrate
2. **Mode Comparison**: Side-by-side comparison of both modes
3. **Copy-Paste Ready**: Complete working examples
4. **Best Practices**: Demonstrates proper setup
5. **Testing**: Can test both modes locally

---

## Trade-offs

**Pros:**
- Complete, working examples
- Shows both integration patterns
- Easy to understand and copy
- Demonstrates identical API

**Cons:**
- Slightly more complex directory structure
- Need to maintain two demos
- Larger repository size
- More dependencies to install

---

**Status**: Not Started  
**Next Steps**: 
1. Rename demo/ to demos/standalone/
2. Create demos/redux/ structure
3. Implement Redux demo
4. Update scripts and workflows
5. Test both demos
6. Update documentation
