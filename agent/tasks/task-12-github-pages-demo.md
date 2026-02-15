# Task 12: Create GitHub Pages Interactive Demo

**Milestone**: M2 - Documentation & Examples  
**Estimated Time**: 4-6 hours  
**Dependencies**: Task 11 (Custom Gradient Themes)  
**Status**: Not Started

---

## Objective

Create an interactive GitHub Pages demo site that showcases all features of the pretty-toasts library, replicating the functionality from the agentbase.me toast-test page. This will serve as both a live demo and a testing playground for users.

---

## Problem Statement

Currently, users need to:
1. Install the library to see how it works
2. Read documentation without visual examples
3. Guess how features like stacking, progress, and interactions work

A live, interactive demo would:
- Show all toast types and features in action
- Provide a testing playground
- Serve as visual documentation
- Increase adoption by letting users try before installing

---

## Solution

Create a standalone HTML/React demo page that:
1. Uses the published npm package (or local build for testing)
2. Demonstrates all toast types (success, error, warning, info)
3. Shows message variations (long messages, title-only)
4. Tests duration options (short, long)
5. Demonstrates advanced features (stacking, progress updates)
6. Includes interactive instructions
7. Deploys automatically to GitHub Pages

---

## Implementation Steps

### 1. Create Demo Directory Structure

```bash
mkdir -p demo/src
mkdir -p demo/public
```

**Files to create:**
- `demo/index.html` - Main HTML file
- `demo/src/App.tsx` - React demo app
- `demo/src/main.tsx` - Entry point
- `demo/package.json` - Demo dependencies
- `demo/vite.config.ts` - Vite configuration
- `demo/tsconfig.json` - TypeScript config
- `.github/workflows/deploy-demo.yml` - GitHub Actions workflow

### 2. Create Demo Package Configuration

**File: `demo/package.json`**

```json
{
  "name": "pretty-toasts-demo",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@prmichaelsen/pretty-toasts": "workspace:*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
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

### 3. Create Vite Configuration

**File: `demo/vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pretty-toasts/', // GitHub Pages base path
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### 4. Create Demo App Component

**File: `demo/src/App.tsx`**

```typescript
import React from 'react'
import { useToast } from '@prmichaelsen/pretty-toasts/standalone'

function App() {
  const toast = useToast()

  const handleSuccess = () => {
    toast.success({
      id: `success-${Date.now()}`,
      title: 'Success!',
      message: 'This is a success toast notification',
      duration: 5000,
    })
  }

  const handleError = () => {
    toast.error({
      id: `error-${Date.now()}`,
      title: 'Error!',
      message: 'This is an error toast notification',
      duration: 5000,
    })
  }

  const handleWarning = () => {
    toast.warning({
      id: `warning-${Date.now()}`,
      title: 'Warning!',
      message: 'This is a warning toast notification',
      duration: 5000,
    })
  }

  const handleInfo = () => {
    toast.info({
      id: `info-${Date.now()}`,
      title: 'Info',
      message: 'This is an info toast notification',
      duration: 5000,
    })
  }

  const handleLongMessage = () => {
    toast.success({
      id: `long-${Date.now()}`,
      title: 'Long Message Test',
      message: 'This is a much longer message to test how the toast handles multiple lines of text. It should wrap nicely and display all the content without breaking the layout.',
      duration: 8000,
    })
  }

  const handleNoMessage = () => {
    toast.info({
      id: `no-msg-${Date.now()}`,
      title: 'Title Only',
      duration: 3000,
    })
  }

  const handleShortDuration = () => {
    toast.success({
      id: `short-${Date.now()}`,
      title: 'Quick Toast',
      message: 'This will disappear in 2 seconds',
      duration: 2000,
    })
  }

  const handleLongDuration = () => {
    toast.info({
      id: `long-dur-${Date.now()}`,
      title: 'Long Duration',
      message: 'This will stay for 15 seconds',
      duration: 15000,
    })
  }

  const handleMultiple = () => {
    toast.success({ id: `multi-1-${Date.now()}`, title: 'First Toast', message: 'Toast 1' })
    setTimeout(() => toast.error({ id: `multi-2-${Date.now()}`, title: 'Second Toast', message: 'Toast 2' }), 500)
    setTimeout(() => toast.warning({ id: `multi-3-${Date.now()}`, title: 'Third Toast', message: 'Toast 3' }), 1000)
    setTimeout(() => toast.info({ id: `multi-4-${Date.now()}`, title: 'Fourth Toast', message: 'Toast 4' }), 1500)
  }

  const handleProgressUpload = () => {
    const uploadId = `upload-${Date.now()}`
    
    // Start upload
    toast.info({
      id: uploadId,
      title: 'Uploading...',
      message: 'Starting upload',
      progress: 0,
    })

    // Simulate progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      
      if (progress <= 100) {
        toast.toast({
          id: uploadId,
          type: progress === 100 ? 'success' : 'info',
          title: progress === 100 ? 'Upload Complete!' : 'Uploading...',
          message: `${progress}% complete`,
          progress,
        })
      }
      
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
          Pretty Toasts Demo
        </h1>
        <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>
          Interactive demo of @prmichaelsen/pretty-toasts library
        </p>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(8px)',
          borderRadius: '0.5rem',
          padding: '2rem',
          border: '1px solid #334155',
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            Toast Types
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Button onClick={handleSuccess} variant="success">Success Toast</Button>
            <Button onClick={handleError} variant="error">Error Toast</Button>
            <Button onClick={handleWarning} variant="warning">Warning Toast</Button>
            <Button onClick={handleInfo} variant="info">Info Toast</Button>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem', marginTop: '2rem' }}>
            Message Variations
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Button onClick={handleLongMessage} variant="success">Long Message</Button>
            <Button onClick={handleNoMessage} variant="info">Title Only (No Message)</Button>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem', marginTop: '2rem' }}>
            Duration Tests
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Button onClick={handleShortDuration} variant="success">Short (2s)</Button>
            <Button onClick={handleLongDuration} variant="info">Long (15s)</Button>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem', marginTop: '2rem' }}>
            Advanced Tests
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Button onClick={handleMultiple} variant="success">Multiple Toasts (Stacking)</Button>
            <Button onClick={handleProgressUpload} variant="success">Progress Upload Simulation</Button>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(51, 65, 85, 0.5)',
            borderRadius: '0.5rem',
            border: '1px solid #475569',
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
              Interactive Features
            </h3>
            <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.5' }}>
              <li>• <strong>Hover</strong> over a toast to pause auto-dismiss</li>
              <li>• <strong>Click</strong> a toast to make it permanent (no auto-dismiss)</li>
              <li>• <strong>Swipe/Drag</strong> a toast to dismiss it manually</li>
              <li>• <strong>Progress bar</strong> shows time remaining</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a
            href="https://github.com/prmichaelsen/pretty-toasts"
            style={{ color: '#60a5fa', textDecoration: 'none' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </div>
  )
}

// Simple Button component
interface ButtonProps {
  onClick: () => void
  variant: 'success' | 'error' | 'warning' | 'info'
  children: React.ReactNode
}

function Button({ onClick, variant, children }: ButtonProps) {
  const colors = {
    success: { bg: '#10b981', hover: '#059669' },
    error: { bg: '#ef4444', hover: '#dc2626' },
    warning: { bg: '#f59e0b', hover: '#d97706' },
    info: { bg: '#3b82f6', hover: '#2563eb' },
  }

  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        border: 'none',
        background: isHovered ? colors[variant].hover : colors[variant].bg,
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
      }}
    >
      {children}
    </button>
  )
}

export default App
```

### 5. Create Entry Point

**File: `demo/src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastProvider } from '@prmichaelsen/pretty-toasts/standalone'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
)
```

### 6. Create HTML Template

**File: `demo/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Interactive demo of @prmichaelsen/pretty-toasts - Beautiful, customizable toast notifications for React" />
    <title>Pretty Toasts - Interactive Demo</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 7. Create TypeScript Configuration

**File: `demo/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**File: `demo/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 8. Create GitHub Actions Workflow

**File: `.github/workflows/deploy-demo.yml`**

```yaml
name: Deploy Demo to GitHub Pages

on:
  push:
    branches: [mainline]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build library
        run: npm run build

      - name: Install demo dependencies
        run: cd demo && npm ci

      - name: Build demo
        run: cd demo && npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./demo/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 9. Update Root Package.json

Add demo scripts to root `package.json`:

```json
{
  "scripts": {
    "demo:dev": "cd demo && npm run dev",
    "demo:build": "npm run build && cd demo && npm run build",
    "demo:preview": "cd demo && npm run preview"
  }
}
```

### 10. Update README.md

Add demo link to README:

```markdown
## Live Demo

Try the interactive demo: [https://prmichaelsen.github.io/pretty-toasts/](https://prmichaelsen.github.io/pretty-toasts/)

## Features
...
```

---

## Verification

### Local Testing

```bash
# Build the library
npm run build

# Install demo dependencies
cd demo
npm install

# Run demo locally
npm run dev
```

Visit `http://localhost:5173` and test:
- [ ] All toast types display correctly
- [ ] Long messages wrap properly
- [ ] Title-only toasts work
- [ ] Short and long durations work
- [ ] Multiple toasts stack correctly
- [ ] Progress upload simulation works
- [ ] Hover pauses toasts
- [ ] Click makes toasts permanent
- [ ] Swipe/drag dismisses toasts

### Build Testing

```bash
# Build demo for production
cd demo
npm run build

# Preview production build
npm run preview
```

Verify:
- [ ] Production build completes without errors
- [ ] All features work in production build
- [ ] No console errors
- [ ] Assets load correctly

### GitHub Pages Testing

After pushing to mainline:
- [ ] GitHub Actions workflow runs successfully
- [ ] Demo deploys to GitHub Pages
- [ ] Demo is accessible at `https://prmichaelsen.github.io/pretty-toasts/`
- [ ] All features work on deployed site
- [ ] Mobile responsive
- [ ] Works in different browsers (Chrome, Firefox, Safari)

---

## Benefits

1. **User Experience**: Users can try the library before installing
2. **Visual Documentation**: Shows all features in action
3. **Testing Playground**: Developers can test edge cases
4. **Marketing**: Increases adoption with live demo
5. **Bug Reports**: Users can reference demo when reporting issues
6. **CI/CD**: Automated deployment on every push

---

## Trade-offs

**Pros:**
- Live, interactive demonstration
- No installation required to try
- Automated deployment
- Always up-to-date with mainline

**Cons:**
- Additional maintenance (demo code)
- GitHub Pages setup required
- Slightly larger repository
- Need to keep demo in sync with library changes

---

## Notes

- Demo uses Vite for fast development and small bundle size
- Inline styles used to avoid external CSS dependencies
- Demo is self-contained and doesn't require backend
- GitHub Pages serves static files only (perfect for React SPA)
- Base path `/pretty-toasts/` matches GitHub Pages URL structure
- Demo uses published package in production, local build in development

---

## Future Enhancements

1. **Custom Theme Showcase**: Add section demonstrating custom themes
2. **Code Examples**: Show code snippets for each demo
3. **Copy to Clipboard**: Let users copy code examples
4. **Dark/Light Mode Toggle**: Demonstrate theme customization
5. **Performance Metrics**: Show bundle size, load time
6. **Accessibility Demo**: Highlight ARIA features
7. **Mobile Gestures**: Better mobile interaction examples

---

**Status**: Not Started  
**Next Steps**: 
1. Create demo directory structure
2. Set up Vite configuration
3. Implement demo app
4. Configure GitHub Actions
5. Test locally
6. Deploy to GitHub Pages
