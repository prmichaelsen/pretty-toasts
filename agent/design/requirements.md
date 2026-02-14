# Pretty-Toasts Library Requirements

**Project Name**: pretty-toasts
**Created**: 2026-02-14
**Status**: Active

---

## Overview

A portable, production-ready React toast notification library that provides beautiful gradient-styled notifications with support for both Redux Toolkit and standalone React Context modes. The library replicates the exact functionality and styling from the goodneighbor application's toast system.

---

## Problem Statement

React applications need a flexible, beautiful toast notification system that:
- Works with or without Redux
- Provides rich visual feedback with gradients and animations
- Supports interactive gestures (swipe, hover, click)
- Handles progress tracking for long-running operations
- Is fully responsive and accessible
- Can be easily integrated into any React + Tailwind project

---

## Goals and Objectives

### Primary Goals
1. **Dual-Mode Support**: Work seamlessly with Redux Toolkit or standalone React Context
2. **Feature Parity**: Replicate ALL features from the source goodneighbor toast system
3. **Beautiful UI**: Gradient backgrounds, smooth animations, and polished interactions
4. **Developer Experience**: Simple API, TypeScript support, comprehensive documentation

### Secondary Goals
1. **Accessibility**: ARIA labels, keyboard support, screen reader friendly
2. **Performance**: Smooth 60fps animations, efficient re-renders
3. **Portability**: Zero dependencies on goodneighbor-specific code
4. **Maintainability**: Clean code, proper TypeScript types, clear structure

---

## Functional Requirements

### Core Features
1. **Toast Types**: Support success, error, warning, and info toast types
2. **Auto-Dismiss**: Configurable duration with visual progress bar (default 10s)
3. **Manual Dismiss**: Click X button or swipe/drag to dismiss
4. **Pause on Hover**: Hover pauses auto-dismiss timer
5. **Make Permanent**: Click toast body to make it permanent (no auto-dismiss)
6. **Manual Progress**: Update progress manually for file uploads, etc.
7. **Stacked Positioning**: Multiple toasts stack from bottom with smooth animations
8. **Click Outside**: Click outside toast container dismisses all toasts
9. **Responsive**: 33vw width on desktop, full width on mobile

### Visual Features
1. **Gradient Backgrounds**:
   - Success: Purple to Indigo (`from-purple-500/90 to-indigo-500/90`)
   - Error: Purple to Rose (`from-purple-500/90 to-rose-500/90`)
   - Warning: Amber to Orange (`from-amber-500/90 to-orange-500/90`)
   - Info: Blue to Purple (`from-blue-500/90 to-purple-500/90`)

2. **Progress Bar**: Gradient progress bar at bottom showing time remaining

3. **Animations**:
   - Enter: Slide in from right with fade
   - Exit: Slide out to right with fade and scale
   - Duration: 300ms cubic-bezier easing
   - Smooth repositioning when toasts are added/removed

### API Features
1. **useToast Hook**: Convenience methods for all toast types
   - `toast({ type, title, message, duration, progress })`
   - `success({ title, message, duration })`
   - `error({ title, message, duration })`
   - `warning({ title, message, duration })`
   - `info({ title, message, duration })`

2. **Redux Actions** (when using Redux):
   - `addToast(options)`
   - `updateToast({ id, updates })`
   - `removeToast(id)`
   - `pauseToast(id)`
   - `resumeToast(id)`
   - `makeToastPermanent(id)`
   - `clearAllToasts()`

3. **Context Actions** (when using standalone):
   - Same API as Redux actions via `useToastContext()`

---

## Non-Functional Requirements

### Performance
- Animations run at 60fps
- Progress bar updates every 100ms
- No layout thrashing during toast repositioning
- Efficient React re-renders (memoization where needed)

### Accessibility
- ARIA live regions for screen readers
- ARIA labels on dismiss buttons
- Keyboard navigation support
- Proper focus management

### Compatibility
- React 18+
- TypeScript 5+
- Modern browsers (ES2022)
- Tailwind CSS 3+

### Code Quality
- 100% TypeScript with strict mode
- Proper type exports for library consumers
- ESLint compliant
- Clean, readable code with comments where needed

---

## Technical Requirements

### Technology Stack
- **Language**: TypeScript 5.x
- **Framework**: React 18.x
- **State Management**: Redux Toolkit 2.x (optional) or React Context
- **Styling**: Tailwind CSS 3.x (peer dependency)
- **Build Tool**: Rollup 4.x
- **Module Format**: CommonJS + ESM

### Dependencies
**Peer Dependencies** (required):
- `react: ^18.0.0`
- `react-dom: ^18.0.0`

**Optional Peer Dependencies**:
- `@reduxjs/toolkit: ^2.0.0`
- `react-redux: ^9.0.0`

**Dev Dependencies**:
- TypeScript, Rollup, ESLint, etc.

### Build Output
- `dist/index.js` - CommonJS bundle
- `dist/index.esm.js` - ESM bundle
- `dist/index.d.ts` - TypeScript declarations
- Source maps for debugging

### Package Configuration
- Proper `package.json` with exports field
- Peer dependencies correctly marked as optional
- Files array to include only dist/ and README
- NPM scripts for build, dev, test, lint

---

## User Stories

### As a Developer Using Redux
1. I want to add the toast reducer to my Redux store so that I can use toasts
2. I want to use the `useToast` hook so that I can show toasts easily
3. I want toasts to auto-detect Redux mode so that I don't need extra configuration

### As a Developer NOT Using Redux
1. I want to wrap my app with `ToastProvider` so that I can use toasts without Redux
2. I want the same `useToast` API so that I don't need to learn different patterns
3. I want toasts to auto-detect standalone mode so that it just works

### As an End User
1. I want to see beautiful, clear notifications so that I understand what happened
2. I want to dismiss toasts by swiping so that I can clear them on mobile
3. I want toasts to pause when I hover so that I can read long messages
4. I want to click a toast to keep it visible so that I can reference it later
5. I want toasts to auto-dismiss so that they don't clutter the screen

---

## Constraints

### Technical Constraints
- Must use Tailwind CSS classes (no custom CSS files)
- Must support both CommonJS and ESM
- Must work with or without Redux
- Must not bundle peer dependencies

### Design Constraints
- Must match exact gradient colors from source
- Must match exact animation timings from source
- Must maintain responsive breakpoint at 640px (sm)

### Compatibility Constraints
- Node.js 18+ for development
- React 18+ required
- Modern browser features (no IE11 support)

---

## Success Criteria

### MVP Success Criteria
- [x] All core components implemented (Toast, ToastContainer)
- [x] Redux slice with all actions
- [x] Standalone context provider
- [x] useToast hook with auto-detection
- [x] TypeScript types exported
- [ ] useMediaQuery hook created
- [ ] Wrapper components created (ReduxToastContainer, StandaloneToastContainer)
- [ ] Rollup build configuration
- [ ] Library builds without errors
- [ ] Type declarations generated
- [ ] README with usage examples

### Full Release Success Criteria
- [ ] All MVP criteria met
- [ ] Library published to NPM
- [ ] Example projects created (with-redux, standalone)
- [ ] Tests written and passing
- [ ] Documentation complete
- [ ] Used in at least one production project

---

## Out of Scope

1. **Custom Themes**: Users must use Tailwind - no custom theme system
2. **Animation Customization**: Animation timings are fixed to match source
3. **Position Customization**: Toasts always appear bottom-right (desktop) or bottom (mobile)
4. **Sound Effects**: No audio notifications
5. **Browser Notifications**: No system-level notifications
6. **Toast Queue Limits**: No limit on number of simultaneous toasts
7. **Persistence**: Toasts don't persist across page reloads
8. **Server-Side Rendering**: No SSR support in v1

---

## Assumptions

1. Users have Tailwind CSS configured in their project
2. Users are using React 18+ with modern build tools
3. Users understand basic Redux concepts (if using Redux mode)
4. Users have a modern browser with ES2022 support
5. Users will configure Tailwind to scan node_modules/pretty-toasts

---

## Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| Tailwind classes not working | High | Medium | Clear documentation about Tailwind configuration |
| Redux/Context detection fails | High | Low | Comprehensive error messages, fallback logic |
| Animation performance issues | Medium | Low | Use CSS transforms, avoid layout thrashing |
| TypeScript type errors | Medium | Low | Strict typing, proper exports, test in consuming projects |
| Build configuration issues | Medium | Medium | Test build output, verify both CJS and ESM work |

---

## Timeline

### Phase 1: Completion (Current) - 1 day
- Create missing components (useMediaQuery, wrappers)
- Configure Rollup build
- Test build output
- Verify all features work

### Phase 2: Testing & Examples - 2-3 days
- Write unit tests
- Create example projects
- Test in real applications
- Fix any discovered issues

### Phase 3: Documentation & Publishing - 1-2 days
- Finalize documentation
- Create CHANGELOG
- Publish to NPM
- Announce release

---

## References

- [Source Toast Component](../../../goodneighbor/src/components/ui/Toast.tsx): Original implementation
- [Source Redux Slice](../../../goodneighbor/src/store/slices/uiSlice.ts): Original Redux logic
- [Tailwind CSS Documentation](https://tailwindcss.com/docs): Styling reference
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/): State management reference
- [Rollup Documentation](https://rollupjs.org/): Build tool reference

---

**Status**: Active - In Implementation Phase
**Last Updated**: 2026-02-14
**Next Review**: 2026-02-15
