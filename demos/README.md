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

## Testing Both Demos

From the project root:

```bash
# Install all demo dependencies
npm run demo:install

# Run standalone demo
npm run demo:standalone

# Run redux demo (in another terminal)
npm run demo:redux

# Build both demos
npm run demo:build
```
