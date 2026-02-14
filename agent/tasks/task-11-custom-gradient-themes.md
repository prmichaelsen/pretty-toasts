# Task 11: Add Custom Gradient Theme Support

**Milestone**: M3 - Customization & Theming (Future Enhancement)
**Estimated Time**: 2-3 hours
**Dependencies**: Task 10 (Remove Tailwind Dependency must be complete)
**Status**: Not Started
**Priority**: Medium (nice-to-have feature)

---

## Objective

Allow users to customize toast gradients by passing their own color schemes, enabling brand-specific styling while maintaining the library's visual polish and animation quality.

---

## Problem Statement

After removing Tailwind dependency (Task 10), the library will use hardcoded gradient colors. While these look great, users may want to:
- Match their brand colors
- Use their design system colors
- Create custom themes (dark mode, high contrast, etc.)
- Override specific toast type colors

Currently, there's no way to customize the gradient colors without forking the library.

---

## Solution

Provide a theme configuration system that allows users to override default gradients at the provider level or per-toast.

---

## API Design

### Option A: Theme Provider (Recommended)

```typescript
import { ToastProvider, ToastTheme } from '@prmichaelsen/pretty-toasts/standalone';

const customTheme: ToastTheme = {
  success: {
    from: '#10b981', // emerald-500
    to: '#3b82f6',   // blue-500
    opacity: 0.95,
  },
  error: {
    from: '#ef4444', // red-500
    to: '#f97316',   // orange-500
    opacity: 0.95,
  },
  warning: {
    from: '#f59e0b', // amber-500
    to: '#eab308',   // yellow-500
    opacity: 0.95,
  },
  info: {
    from: '#06b6d4', // cyan-500
    to: '#8b5cf6',   // violet-500
    opacity: 0.95,
  },
};

function App() {
  return (
    <ToastProvider theme={customTheme}>
      <MyApp />
      <StandaloneToastContainer />
    </ToastProvider>
  );
}
```

### Option B: Per-Toast Override

```typescript
const { success } = useToast();

success({
  title: 'Custom Success',
  message: 'With brand colors',
  gradient: {
    from: '#10b981',
    to: '#3b82f6',
    opacity: 0.95,
  },
});
```

### Option C: Redux Store Configuration

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { toastReducer, createToastTheme } from '@prmichaelsen/pretty-toasts/redux';

const customTheme = createToastTheme({
  success: { from: '#10b981', to: '#3b82f6' },
  // ... other types
});

export const store = configureStore({
  reducer: {
    prettyToasts: toastReducer,
  },
  preloadedState: {
    prettyToasts: {
      theme: customTheme,
      toasts: [],
    },
  },
});
```

**Recommendation**: **Option A (Theme Provider)** for standalone, with Option B for per-toast overrides.

---

## Implementation Steps

### 1. Define Theme Types

```typescript
// src/types/theme.ts

export interface GradientConfig {
  from: string;      // CSS color (hex, rgb, hsl)
  to: string;        // CSS color (hex, rgb, hsl)
  opacity?: number;  // 0-1, default 0.9
}

export interface ToastTheme {
  success?: GradientConfig;
  error?: GradientConfig;
  warning?: GradientConfig;
  info?: GradientConfig;
}

export interface ProgressBarTheme {
  success?: Omit<GradientConfig, 'opacity'>;
  error?: Omit<GradientConfig, 'opacity'>;
  warning?: Omit<GradientConfig, 'opacity'>;
  info?: Omit<GradientConfig, 'opacity'>;
}

export interface CompleteTheme {
  toast?: ToastTheme;
  progressBar?: ProgressBarTheme;
}
```

### 2. Create Default Theme

```typescript
// src/styles/defaultTheme.ts

export const defaultToastTheme: ToastTheme = {
  success: {
    from: 'rgb(168, 85, 247)',  // purple-500
    to: 'rgb(99, 102, 241)',    // indigo-500
    opacity: 0.9,
  },
  error: {
    from: 'rgb(168, 85, 247)',  // purple-500
    to: 'rgb(244, 63, 94)',     // rose-500
    opacity: 0.9,
  },
  warning: {
    from: 'rgb(245, 158, 11)',  // amber-500
    to: 'rgb(249, 115, 22)',    // orange-500
    opacity: 0.9,
  },
  info: {
    from: 'rgb(59, 130, 246)',  // blue-500
    to: 'rgb(168, 85, 247)',    // purple-500
    opacity: 0.9,
  },
};

export const defaultProgressBarTheme: ProgressBarTheme = {
  success: {
    from: 'rgb(192, 132, 252)',  // purple-400
    to: 'rgb(129, 140, 248)',    // indigo-400
  },
  error: {
    from: 'rgb(192, 132, 252)',  // purple-400
    to: 'rgb(251, 113, 133)',    // rose-400
  },
  warning: {
    from: 'rgb(251, 191, 36)',   // amber-400
    to: 'rgb(251, 146, 60)',     // orange-400
  },
  info: {
    from: 'rgb(96, 165, 250)',   // blue-400
    to: 'rgb(192, 132, 252)',    // purple-400
  },
};
```

### 3. Create Theme Context

```typescript
// src/hooks/ThemeContext.tsx

import React, { createContext, useContext } from 'react';
import { CompleteTheme } from '../types/theme';
import { defaultToastTheme, defaultProgressBarTheme } from '../styles/defaultTheme';

interface ThemeContextValue {
  theme: CompleteTheme;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: {
    toast: defaultToastTheme,
    progressBar: defaultProgressBarTheme,
  },
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  theme?: CompleteTheme;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  theme = {}, 
  children 
}) => {
  const mergedTheme: CompleteTheme = {
    toast: { ...defaultToastTheme, ...theme.toast },
    progressBar: { ...defaultProgressBarTheme, ...theme.progressBar },
  };

  return (
    <ThemeContext.Provider value={{ theme: mergedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 4. Update ToastProvider

```typescript
// src/hooks/ToastContext.tsx

import { ThemeProvider } from './ThemeContext';
import type { CompleteTheme } from '../types/theme';

interface ToastProviderProps {
  children: React.ReactNode;
  theme?: CompleteTheme;  // Add theme prop
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children,
  theme 
}) => {
  // ... existing toast context logic

  return (
    <ToastContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ToastContext.Provider>
  );
};
```

### 5. Update Style Helpers

```typescript
// src/styles/helpers.ts

import { useTheme } from '../hooks/ThemeContext';
import type { ToastType } from '../types';

export const useToastStyle = (type: ToastType): React.CSSProperties => {
  const { theme } = useTheme();
  const gradient = theme.toast[type];

  return {
    background: `linear-gradient(to right, 
      ${gradient.from}, 
      ${gradient.to})`,
    opacity: gradient.opacity ?? 0.9,
  };
};

export const useProgressBarStyle = (
  type: ToastType,
  progress: number
): React.CSSProperties => {
  const { theme } = useTheme();
  const gradient = theme.progressBar[type];

  return {
    width: `${progress}%`,
    background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
    height: '4px',
    transition: 'width 100ms linear',
  };
};
```

### 6. Update Toast Component

```typescript
// src/components/Toast.tsx

import { useToastStyle, useProgressBarStyle } from '../styles/helpers';

export const Toast: React.FC<ToastProps> = ({ toast, ... }) => {
  const toastStyle = useToastStyle(toast.type);
  const progressStyle = useProgressBarStyle(toast.type, progress);

  return (
    <div style={toastStyle}>
      {/* Toast content */}
      <div style={progressStyle} />
    </div>
  );
};
```

### 7. Add Per-Toast Override Support

```typescript
// src/types/index.ts

export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  progress?: number;
  gradient?: GradientConfig;  // Add gradient override
}
```

Update Toast component to use override if provided:

```typescript
const toastStyle = toast.gradient 
  ? getGradientStyle(toast.gradient)
  : useToastStyle(toast.type);
```

---

## Usage Examples

### Example 1: Brand Colors

```typescript
import { ToastProvider } from '@prmichaelsen/pretty-toasts/standalone';

const brandTheme = {
  toast: {
    success: {
      from: '#10b981', // Your brand green
      to: '#059669',
      opacity: 0.95,
    },
    error: {
      from: '#dc2626', // Your brand red
      to: '#991b1b',
      opacity: 0.95,
    },
  },
};

function App() {
  return (
    <ToastProvider theme={brandTheme}>
      <MyApp />
    </ToastProvider>
  );
}
```

### Example 2: Dark Mode Theme

```typescript
const darkTheme = {
  toast: {
    success: {
      from: '#065f46', // Darker green
      to: '#047857',
      opacity: 0.95,
    },
    error: {
      from: '#7f1d1d', // Darker red
      to: '#991b1b',
      opacity: 0.95,
    },
  },
};
```

### Example 3: Per-Toast Override

```typescript
const { success } = useToast();

// Use default theme
success({ title: 'Default', message: 'Uses theme colors' });

// Override for specific toast
success({
  title: 'Custom',
  message: 'Special gradient',
  gradient: {
    from: '#f59e0b',
    to: '#d97706',
    opacity: 1.0,
  },
});
```

### Example 4: Partial Theme Override

```typescript
// Only override success, keep defaults for others
const partialTheme = {
  toast: {
    success: {
      from: '#10b981',
      to: '#3b82f6',
    },
    // error, warning, info use defaults
  },
};
```

---

## Verification

- [ ] Theme types defined and exported
- [ ] Default theme matches current hardcoded colors
- [ ] ThemeProvider accepts custom theme
- [ ] Theme merging works (partial overrides)
- [ ] Toast component uses theme colors
- [ ] Progress bar uses theme colors
- [ ] Per-toast gradient override works
- [ ] TypeScript types are correct
- [ ] Works in standalone mode
- [ ] Works in Redux mode
- [ ] Documentation includes examples
- [ ] Storybook stories show custom themes

---

## Documentation Updates

### README.md

Add "Customization" section:

```markdown
## Customization

### Custom Theme

```typescript
import { ToastProvider } from '@prmichaelsen/pretty-toasts/standalone';

const customTheme = {
  toast: {
    success: {
      from: '#10b981',
      to: '#3b82f6',
      opacity: 0.95,
    },
  },
};

<ToastProvider theme={customTheme}>
  <App />
</ToastProvider>
```

### Per-Toast Colors

```typescript
const { success } = useToast();

success({
  title: 'Custom',
  gradient: { from: '#f59e0b', to: '#d97706' },
});
```
```

---

## Benefits

### For Users
- ✅ Match brand colors
- ✅ Support dark mode
- ✅ Create custom themes
- ✅ Per-toast customization
- ✅ Flexible and powerful

### For Library
- ✅ More versatile
- ✅ Wider adoption
- ✅ Professional feature set
- ✅ Competitive advantage

---

## Considerations

### Performance
- Theme context re-renders: Minimal (theme rarely changes)
- Per-toast overrides: No performance impact

### Bundle Size
- Theme system adds ~2KB
- Acceptable for the flexibility gained

### Breaking Changes
- None if implemented after Task 10
- Fully backward compatible (defaults match current)

---

## Future Enhancements

After this task, could add:
- Animation customization
- Border radius customization
- Shadow customization
- Font customization
- Icon customization
- Sound effects
- Preset themes (dark, light, high-contrast)

---

## Files to Create/Modify

### New Files
1. `src/types/theme.ts` - Theme type definitions
2. `src/styles/defaultTheme.ts` - Default theme values
3. `src/hooks/ThemeContext.tsx` - Theme context provider

### Modified Files
1. `src/hooks/ToastContext.tsx` - Add theme prop to ToastProvider
2. `src/components/Toast.tsx` - Use theme colors
3. `src/styles/helpers.ts` - Theme-aware style functions
4. `src/types/index.ts` - Add gradient to ToastOptions
5. `src/standalone.ts` - Export theme types
6. `src/redux.ts` - Export theme types
7. `README.md` - Add customization documentation

---

## Success Criteria

1. Users can provide custom theme to ToastProvider
2. Theme colors apply to all toasts
3. Partial theme overrides work correctly
4. Per-toast gradient overrides work
5. Default theme matches current appearance
6. TypeScript types are complete
7. Documentation is clear with examples
8. Works in both standalone and Redux modes

---

**Previous Task**: Task 10 - Remove Tailwind Dependency
**Next Task**: Task 12 - Advanced Customization (animations, sounds, etc.)
**Priority**: Medium - Nice feature but not critical
**Estimated Completion**: 2-3 hours after Task 10 is complete
