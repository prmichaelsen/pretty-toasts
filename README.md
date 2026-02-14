# Pretty Toasts

Beautiful gradient toast notifications for React with Redux and standalone support.

## Features

- 🎨 **Beautiful Gradient Styling** - Purple/indigo for success, purple/rose for error, amber/orange for warning, blue/purple for info
- 🔄 **Redux & Standalone Support** - Use with Redux Toolkit or standalone React Context
- ⏱️ **Auto-dismiss with Progress Bar** - Configurable duration with visual progress indicator
- 👆 **Interactive Gestures** - Swipe/drag to dismiss, hover to pause, click to make permanent
- 📱 **Responsive** - Works on desktop and mobile with appropriate positioning
- 🎭 **Smooth Animations** - Enter/exit animations with stacking support
- ♿ **Accessible** - ARIA labels and keyboard support

## Installation

```bash
npm install pretty-toasts
# or
yarn add pretty-toasts
# or
pnpm add pretty-toasts
```

### Peer Dependencies

```bash
npm install react react-dom
```

For Redux support (optional):
```bash
npm install @reduxjs/toolkit react-redux
```

## Usage

### With Redux

1. Add the toast reducer to your store:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import toastReducer from 'pretty-toasts/store/toastSlice';

export const store = configureStore({
  reducer: {
    prettyToasts: toastReducer,
    // ... other reducers
  },
});
```

2. Add the ToastContainer to your app:

```tsx
import { ToastContainer } from 'pretty-toasts';

function App() {
  return (
    <>
      {/* Your app content */}
      <ToastContainer />
    </>
  );
}
```

3. Use the toast hook:

```tsx
import { useToast } from 'pretty-toasts';

function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    toast.success({
      title: 'Success!',
      message: 'Operation completed successfully',
      duration: 5000,
    });
  };

  return <button onClick={handleClick}>Show Toast</button>;
}
```

### Standalone (without Redux)

1. Wrap your app with ToastProvider:

```tsx
import { ToastProvider, ToastContainer } from 'pretty-toasts';

function App() {
  return (
    <ToastProvider>
      {/* Your app content */}
      <ToastContainer />
    </ToastProvider>
  );
}
```

2. Use the toast hook:

```tsx
import { useToast } from 'pretty-toasts';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  return (
    <div>
      <button onClick={() => success({ title: 'Success!', message: 'It worked!' })}>
        Success
      </button>
      <button onClick={() => error({ title: 'Error!', message: 'Something went wrong' })}>
        Error
      </button>
    </div>
  );
}
```

## API

### Toast Options

```typescript
interface ToastOptions {
  id?: string;              // Optional custom ID
  type: ToastType;          // 'success' | 'error' | 'warning' | 'info'
  title: string;            // Toast title
  message?: string;         // Optional message
  duration?: number;        // Duration in ms (default: 10000)
  progress?: number;        // Manual progress 0-100 (for uploads, etc.)
}
```

### useToast Hook

```typescript
const toast = useToast();

// Generic toast
toast.toast({ type: 'success', title: 'Title', message: 'Message' });

// Convenience methods
toast.success({ title: 'Success!', message: 'Optional message' });
toast.error({ title: 'Error!', message: 'Optional message' });
toast.warning({ title: 'Warning!', message: 'Optional message' });
toast.info({ title: 'Info', message: 'Optional message' });
```

### Manual Progress Updates (for file uploads, etc.)

```typescript
const uploadId = 'upload-123';

// Start upload toast
toast.info({
  id: uploadId,
  title: 'Uploading...',
  progress: 0,
});

// Update progress
dispatch(updateToast({
  id: uploadId,
  progress: 50,
  message: '50% complete',
}));

// Complete
dispatch(updateToast({
  id: uploadId,
  type: 'success',
  title: 'Upload Complete!',
  progress: 100,
}));
```

## Styling

The library uses Tailwind CSS classes. Make sure your project has Tailwind configured, or the toasts will not be styled correctly.

Required Tailwind config:
```javascript
module.exports = {
  content: [
    './node_modules/pretty-toasts/**/*.{js,ts,jsx,tsx}',
    // ... your other content paths
  ],
  // ... rest of config
};
```

## License

MIT
