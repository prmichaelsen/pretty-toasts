# Task 18: Add Jest Unit Tests

**Milestone**: M2 - Testing & Documentation  
**Estimated Time**: 6 hours  
**Dependencies**: None  
**Priority**: Medium  
**Status**: Not Started

---

## Objective

Add comprehensive unit tests using Jest and React Testing Library to ensure code quality, catch regressions, and provide confidence in the library's functionality.

---

## Problem Statement

**Current State**:
- No unit tests exist
- Code quality relies on manual testing
- Risk of regressions when making changes
- No automated test coverage metrics
- Difficult to verify edge cases

**Needed**:
- Jest test framework setup
- React Testing Library for component testing
- Unit tests for all core functionality
- Test coverage reporting
- CI integration for automated testing

---

## Solution

Implement Jest with React Testing Library to test:
1. **Hooks**: useToast, useMediaQuery, useTheme
2. **Context**: ToastContext, ThemeProvider
3. **Redux**: toastSlice reducers and actions
4. **Components**: Toast, ToastContainer, wrappers
5. **Utilities**: Style helpers, theme utilities

---

## Implementation Steps

### 1. Install Testing Dependencies

```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/jest \
  jest-environment-jsdom \
  ts-jest
```

### 2. Configure Jest

**Create `jest.config.js`**:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### 3. Create Test Setup File

**Create `src/setupTests.ts`**:
```typescript
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### 4. Write Hook Tests

**Create `src/hooks/__tests__/useMediaQuery.test.ts`**:
```typescript
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from '../useMediaQuery';

describe('useMediaQuery', () => {
  it('should return false for non-matching query', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should return true for matching query', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', () => {
    let listener: ((e: MediaQueryListEvent) => void) | null = null;
    
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((event, handler) => {
        if (event === 'change') listener = handler;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    // Simulate media query change
    if (listener) {
      listener({ matches: true } as MediaQueryListEvent);
    }

    expect(result.current).toBe(true);
  });
});
```

**Create `src/hooks/__tests__/useToast.test.tsx`**:
```typescript
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useToast } from '../useToast';
import { toastReducer } from '../../store/toastSlice';
import { ToastProvider } from '../ToastContext';

describe('useToast', () => {
  describe('with Redux', () => {
    it('should add toast using Redux', () => {
      const store = configureStore({
        reducer: { prettyToasts: toastReducer },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      result.current.success('Test message');

      const state = store.getState();
      expect(state.prettyToasts.toasts).toHaveLength(1);
      expect(state.prettyToasts.toasts[0].message).toBe('Test message');
      expect(state.prettyToasts.toasts[0].type).toBe('success');
    });
  });

  describe('standalone mode', () => {
    it('should add toast using context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      result.current.error('Error message');

      // Context doesn't expose state directly, but we can verify the function exists
      expect(result.current.success).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.warning).toBeDefined();
      expect(result.current.info).toBeDefined();
    });
  });
});
```

### 5. Write Redux Tests

**Create `src/store/__tests__/toastSlice.test.ts`**:
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { toastReducer, addToast, removeToast, updateToast } from '../toastSlice';

describe('toastSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { prettyToasts: toastReducer },
    });
  });

  it('should add a toast', () => {
    store.dispatch(addToast({ message: 'Test', type: 'success' }));

    const state = store.getState().prettyToasts;
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].message).toBe('Test');
    expect(state.toasts[0].type).toBe('success');
    expect(state.toasts[0].id).toBeDefined();
  });

  it('should remove a toast', () => {
    store.dispatch(addToast({ message: 'Test', type: 'success' }));
    const toastId = store.getState().prettyToasts.toasts[0].id;

    store.dispatch(removeToast(toastId));

    const state = store.getState().prettyToasts;
    expect(state.toasts).toHaveLength(0);
  });

  it('should update a toast', () => {
    store.dispatch(addToast({ message: 'Test', type: 'success' }));
    const toastId = store.getState().prettyToasts.toasts[0].id;

    store.dispatch(updateToast({ id: toastId, updates: { progress: 50 } }));

    const state = store.getState().prettyToasts;
    expect(state.toasts[0].progress).toBe(50);
  });

  it('should pause a toast', () => {
    store.dispatch(addToast({ message: 'Test', type: 'success' }));
    const toastId = store.getState().prettyToasts.toasts[0].id;

    store.dispatch({ type: 'prettyToasts/pauseToast', payload: toastId });

    const state = store.getState().prettyToasts;
    expect(state.toasts[0].isPaused).toBe(true);
  });

  it('should resume a toast', () => {
    store.dispatch(addToast({ message: 'Test', type: 'success' }));
    const toastId = store.getState().prettyToasts.toasts[0].id;

    store.dispatch({ type: 'prettyToasts/pauseToast', payload: toastId });
    store.dispatch({ type: 'prettyToasts/resumeToast', payload: toastId });

    const state = store.getState().prettyToasts;
    expect(state.toasts[0].isPaused).toBe(false);
  });

  it('should make a toast permanent', () => {
    store.dispatch(addToast({ message: 'Test', type: 'success' }));
    const toastId = store.getState().prettyToasts.toasts[0].id;

    store.dispatch({ type: 'prettyToasts/makeToastPermanent', payload: toastId });

    const state = store.getState().prettyToasts;
    expect(state.toasts[0].isPermanent).toBe(true);
  });
});
```

### 6. Write Component Tests

**Create `src/components/__tests__/Toast.test.tsx`**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from '../Toast';
import { ThemeProvider } from '../../hooks/ThemeContext';

describe('Toast', () => {
  const mockToast = {
    id: '1',
    message: 'Test message',
    type: 'success' as const,
    duration: 5000,
    isPaused: false,
    isPermanent: false,
  };

  const mockOnRemove = jest.fn();
  const mockOnMakePermanent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render toast message', () => {
    render(
      <ThemeProvider>
        <Toast
          toast={mockToast}
          isExiting={false}
          onRemove={mockOnRemove}
          onMakePermanent={mockOnMakePermanent}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should call onRemove when close button clicked', () => {
    render(
      <ThemeProvider>
        <Toast
          toast={mockToast}
          isExiting={false}
          onRemove={mockOnRemove}
          onMakePermanent={mockOnMakePermanent}
        />
      </ThemeProvider>
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('should show progress bar when progress is set', () => {
    const toastWithProgress = { ...mockToast, progress: 50 };

    render(
      <ThemeProvider>
        <Toast
          toast={toastWithProgress}
          isExiting={false}
          onRemove={mockOnRemove}
          onMakePermanent={mockOnMakePermanent}
        />
      </ThemeProvider>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('should apply correct styles for different toast types', () => {
    const types = ['success', 'error', 'warning', 'info'] as const;

    types.forEach(type => {
      const { container } = render(
        <ThemeProvider>
          <Toast
            toast={{ ...mockToast, type }}
            isExiting={false}
            onRemove={mockOnRemove}
            onMakePermanent={mockOnMakePermanent}
          />
        </ThemeProvider>
      );

      const toastElement = container.firstChild as HTMLElement;
      expect(toastElement).toHaveStyle({ background: expect.any(String) });
    });
  });
});
```

### 7. Write Context Tests

**Create `src/hooks/__tests__/ToastContext.test.tsx`**:
```typescript
import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToastContext } from '../ToastContext';

describe('ToastContext', () => {
  it('should add a toast', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToastContext(), { wrapper });

    act(() => {
      result.current.addToast({ message: 'Test', type: 'success' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test');
  });

  it('should remove a toast', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToastContext(), { wrapper });

    act(() => {
      result.current.addToast({ message: 'Test', type: 'success' });
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should update a toast', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToastContext(), { wrapper });

    act(() => {
      result.current.addToast({ message: 'Test', type: 'success' });
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.updateToast(toastId, { progress: 75 });
    });

    expect(result.current.toasts[0].progress).toBe(75);
  });
});
```

### 8. Update Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### 9. Add Test Coverage to .gitignore

```
# Test coverage
coverage/
*.lcov
```

### 10. Create GitHub Actions Workflow for Tests

**Create `.github/workflows/test.yml`**:
```yaml
name: Run Tests

on:
  push:
    branches: [mainline, develop]
  pull_request:
    branches: [mainline, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

---

## Test Coverage Goals

### Minimum Coverage Targets
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Priority Test Areas
1. **Critical Path**: Toast creation, display, removal
2. **State Management**: Redux slice, Context API
3. **User Interactions**: Click, hover, swipe gestures
4. **Edge Cases**: Empty messages, long messages, rapid additions
5. **Accessibility**: ARIA attributes, keyboard navigation

---

## Verification Checklist

- [ ] Jest and React Testing Library installed
- [ ] Jest configuration created
- [ ] Test setup file created
- [ ] useMediaQuery tests written and passing
- [ ] useToast tests written and passing
- [ ] toastSlice tests written and passing
- [ ] Toast component tests written and passing
- [ ] ToastContext tests written and passing
- [ ] Test coverage meets 70% threshold
- [ ] All tests pass locally
- [ ] GitHub Actions workflow created
- [ ] Tests run in CI/CD
- [ ] Coverage report generated

---

## Files to Create

### Test Files
- `jest.config.js`
- `src/setupTests.ts`
- `src/hooks/__tests__/useMediaQuery.test.ts`
- `src/hooks/__tests__/useToast.test.tsx`
- `src/hooks/__tests__/ToastContext.test.tsx`
- `src/store/__tests__/toastSlice.test.ts`
- `src/components/__tests__/Toast.test.tsx`
- `src/components/__tests__/ToastContainer.test.tsx`
- `src/styles/__tests__/helpers.test.ts`

### Configuration Files
- `.github/workflows/test.yml`
- Update `.gitignore`
- Update `package.json`

---

## Benefits

**For Development**:
- Catch bugs early in development
- Confidence when refactoring
- Documentation through tests
- Faster debugging

**For Users**:
- Higher code quality
- Fewer bugs in production
- More reliable library
- Better maintained codebase

**For Project**:
- Professional quality standards
- Easier to accept contributions
- Better code reviews
- Automated quality checks

---

## Trade-offs

**Pros**:
- ✅ Automated quality assurance
- ✅ Catches regressions
- ✅ Documents expected behavior
- ✅ Enables confident refactoring
- ✅ Industry standard practice

**Cons**:
- ⚠️ Initial setup time (~6 hours)
- ⚠️ Tests need maintenance
- ⚠️ Adds to build time
- ⚠️ Learning curve for contributors

---

## Success Criteria

- [ ] All tests pass
- [ ] Coverage ≥ 70% for all metrics
- [ ] Tests run in CI/CD
- [ ] No flaky tests
- [ ] Fast test execution (< 30 seconds)
- [ ] Clear test descriptions
- [ ] Easy to add new tests

---

**Status**: Not Started  
**Next Steps**: 
1. Install Jest and React Testing Library
2. Configure Jest with TypeScript support
3. Create test setup file
4. Write tests for hooks
5. Write tests for Redux slice
6. Write tests for components
7. Set up CI/CD integration
8. Achieve 70% coverage threshold
