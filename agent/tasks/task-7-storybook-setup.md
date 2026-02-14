# Task 7: Setup Storybook for Component Development

**Milestone**: M2 - Testing & Documentation
**Estimated Time**: 3-4 hours
**Dependencies**: Task 6 (Build and Test must be complete)
**Status**: Not Started

---

## Objective

Set up Storybook for interactive component development and documentation of the pretty-toasts library. This will allow developers to see all toast variants, test interactions, and understand the API without needing to integrate the library into a full application.

---

## Steps

### 1. Install Storybook Dependencies

```bash
npx storybook@latest init --type react
```

This will install:
- `@storybook/react`
- `@storybook/react-vite` (or webpack)
- `@storybook/addon-essentials`
- `@storybook/addon-interactions`
- `@storybook/addon-links`
- `@storybook/blocks`

### 2. Install Additional Dependencies

```bash
npm install --save-dev @storybook/addon-a11y @storybook/addon-viewport
```

**Purpose**:
- `addon-a11y`: Accessibility testing in Storybook
- `addon-viewport`: Test responsive behavior

### 3. Configure Storybook for Tailwind

Create or update `.storybook/preview.js`:

```javascript
import '../src/styles/tailwind.css'; // If you create a CSS file
// OR configure Tailwind in preview-head.html

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
  },
};

export default preview;
```

### 4. Add Tailwind CSS Support

Option A: Create `src/styles/tailwind.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Option B: Add to `.storybook/preview-head.html`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### 5. Create Story Files

#### A. Toast Component Stories

Create `src/components/Toast.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import type { Toast as ToastType } from '../types';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

const baseToast: ToastType = {
  id: 'story-toast',
  type: 'success',
  title: 'Success!',
  message: 'Operation completed successfully',
  duration: 10000,
  isPaused: false,
  isPermanent: false,
  createdAt: Date.now(),
};

export const Success: Story = {
  args: {
    toast: { ...baseToast, type: 'success' },
  },
};

export const Error: Story = {
  args: {
    toast: { 
      ...baseToast, 
      type: 'error',
      title: 'Error!',
      message: 'Something went wrong',
    },
  },
};

export const Warning: Story = {
  args: {
    toast: { 
      ...baseToast, 
      type: 'warning',
      title: 'Warning!',
      message: 'Please review this action',
    },
  },
};

export const Info: Story = {
  args: {
    toast: { 
      ...baseToast, 
      type: 'info',
      title: 'Info',
      message: 'Here is some information',
    },
  },
};

export const WithProgress: Story = {
  args: {
    toast: { 
      ...baseToast,
      progress: 45,
      message: 'Upload in progress...',
    },
  },
};

export const LongMessage: Story = {
  args: {
    toast: { 
      ...baseToast,
      message: 'This is a very long message that demonstrates how the toast handles multiple lines of text. It should wrap properly and maintain good readability.',
    },
  },
};
```

#### B. Redux Toast Container Stories

Create `src/components/ReduxToastContainer.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ReduxToastContainer } from './ReduxToastContainer';
import toastReducer, { addToast } from '../store/toastSlice';
import { useEffect } from 'react';

const meta: Meta<typeof ReduxToastContainer> = {
  title: 'Containers/ReduxToastContainer',
  component: ReduxToastContainer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          prettyToasts: toastReducer,
        },
      });
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ReduxToastContainer>;

export const Default: Story = {
  render: () => {
    const store = configureStore({
      reducer: {
        prettyToasts: toastReducer,
      },
    });

    // Auto-add toasts for demo
    useEffect(() => {
      store.dispatch(addToast({
        type: 'success',
        title: 'Success!',
        message: 'This is a success toast',
      }));
      
      setTimeout(() => {
        store.dispatch(addToast({
          type: 'error',
          title: 'Error!',
          message: 'This is an error toast',
        }));
      }, 1000);
    }, []);

    return (
      <Provider store={store}>
        <div className="min-h-screen bg-gray-100 p-8">
          <h1 className="text-2xl font-bold mb-4">Redux Toast Container Demo</h1>
          <p>Toasts will appear in the bottom-right corner</p>
          <ReduxToastContainer />
        </div>
      </Provider>
    );
  },
};
```

#### C. Standalone Toast Container Stories

Create `src/components/StandaloneToastContainer.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { StandaloneToastContainer } from './StandaloneToastContainer';
import { ToastProvider } from '../hooks/ToastContext';
import { useToast } from '../hooks/useToast';

const meta: Meta<typeof StandaloneToastContainer> = {
  title: 'Containers/StandaloneToastContainer',
  component: StandaloneToastContainer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StandaloneToastContainer>;

const DemoButtons = () => {
  const { success, error, warning, info } = useToast();

  return (
    <div className="space-y-4">
      <button
        onClick={() => success({ title: 'Success!', message: 'Operation completed' })}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Show Success Toast
      </button>
      <button
        onClick={() => error({ title: 'Error!', message: 'Something went wrong' })}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Show Error Toast
      </button>
      <button
        onClick={() => warning({ title: 'Warning!', message: 'Please be careful' })}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Show Warning Toast
      </button>
      <button
        onClick={() => info({ title: 'Info', message: 'Here is some information' })}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Show Info Toast
      </button>
    </div>
  );
};

export const Interactive: Story = {
  render: () => (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-4">Standalone Toast Container Demo</h1>
        <p className="mb-4">Click buttons to show different toast types</p>
        <DemoButtons />
        <StandaloneToastContainer />
      </div>
    </ToastProvider>
  ),
};
```

### 6. Update Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### 7. Configure Storybook Main Config

Update `.storybook/main.js`:

```javascript
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

### 8. Create Introduction Story

Create `src/Introduction.stories.mdx`:

```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Introduction" />

# Pretty Toasts

Beautiful gradient toast notifications for React with Redux and standalone support.

## Features

- 🎨 Beautiful gradient styling
- 🔄 Redux & standalone support
- ⏱️ Auto-dismiss with progress bar
- 👆 Interactive gestures (swipe, hover, click)
- 📱 Responsive design
- 🎭 Smooth animations

## Installation

\`\`\`bash
npm install pretty-toasts
\`\`\`

## Quick Start

### With Redux

\`\`\`typescript
import { configureStore } from '@reduxjs/toolkit';
import toastReducer from 'pretty-toasts/store/toastSlice';

export const store = configureStore({
  reducer: {
    prettyToasts: toastReducer,
  },
});
\`\`\`

### Standalone

\`\`\`tsx
import { ToastProvider, ToastContainer } from 'pretty-toasts';

function App() {
  return (
    <ToastProvider>
      {/* Your app */}
      <ToastContainer />
    </ToastProvider>
  );
}
\`\`\`

## Browse Components

Check out the component stories to see all variants and interactions!
```

---

## Verification

- [ ] `npm run storybook` starts successfully
- [ ] All toast types render correctly (success, error, warning, info)
- [ ] Gradients match the design specifications
- [ ] Interactive controls work in Storybook
- [ ] Responsive viewports work correctly
- [ ] Accessibility addon shows no critical issues
- [ ] Stories demonstrate all key features:
  - [ ] Auto-dismiss with progress bar
  - [ ] Hover to pause
  - [ ] Swipe to dismiss
  - [ ] Click to make permanent
  - [ ] Manual progress updates
  - [ ] Stacked positioning
- [ ] Documentation is clear and helpful
- [ ] `npm run build-storybook` completes successfully

---

## Files to Create

1. `.storybook/main.js` - Storybook configuration
2. `.storybook/preview.js` - Global decorators and parameters
3. `.storybook/preview-head.html` - Custom head content (Tailwind CDN)
4. `src/components/Toast.stories.tsx` - Toast component stories
5. `src/components/ReduxToastContainer.stories.tsx` - Redux container stories
6. `src/components/StandaloneToastContainer.stories.tsx` - Standalone container stories
7. `src/Introduction.stories.mdx` - Introduction documentation
8. `src/styles/tailwind.css` - Tailwind imports (if not using CDN)

---

## Notes

- Storybook will run on `http://localhost:6006` by default
- Use the viewport addon to test mobile vs desktop behavior
- Use the a11y addon to ensure accessibility compliance
- Stories should demonstrate both Redux and standalone modes
- Include interactive examples with buttons to trigger toasts
- Document all props and their effects
- Show edge cases (long messages, multiple toasts, etc.)

---

**Next Task**: Task 8 - GitHub Pages Deployment
