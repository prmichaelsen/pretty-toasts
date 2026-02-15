# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.1] - 2026-02-15

### Fixed
- **CRITICAL**: Fixed toast stacking bug where multiple toasts would dismiss each other instead of stacking vertically
- Removed aggressive click-outside handler that was clearing all toasts when clicking buttons to create new toasts
- Toast stacking now works correctly - multiple toasts display simultaneously as intended

### Changed
- Removed `onClearAll` prop from `ToastContainer` component (breaking change for direct ToastContainer usage)
- Updated `StandaloneToastContainer` and `ReduxToastContainer` to not use `onClearAll`
- Users can still dismiss individual toasts via swipe gesture or close button

### Technical Details
- Modified `src/components/ToastContainer.tsx` - removed click-outside event listener
- Modified `src/components/StandaloneToastContainer.tsx` - removed clearAllToasts usage
- Modified `src/components/ReduxToastContainer.tsx` - removed clearAllToasts import

## [3.0.0] - 2026-02-15

### Added
- Custom gradient theme support for brand color customization
- Theme type system: `GradientConfig`, `ToastTheme`, `CompleteTheme`, `ResolvedTheme`
- `ThemeProvider` component and `useTheme()` hook for theme management
- Theme prop on `ToastProvider` for custom color schemes
- Exported theme types from standalone and redux entry points

### Changed
- **BREAKING**: Removed Tailwind CSS dependency completely
- Converted all components to use inline React styles
- Zero CSS configuration required - works out of the box
- Style helpers converted to theme-aware hooks (`useToastBackgroundStyle`, `useProgressBarStyle`)
- Bundle size increased slightly (~5KB) but gained flexibility

### Removed
- **BREAKING**: Removed Tailwind CSS, autoprefixer, postcss dependencies
- **BREAKING**: No longer need to configure Tailwind in consuming projects
- Removed `rollup-plugin-postcss` from build process

### Migration
See [MIGRATION.md](MIGRATION.md) for detailed upgrade instructions from v2.x to v3.0.0.

## [2.1.4] - 2026-02-14

### Added
- Initial release with Tailwind CSS styling
- Redux Toolkit integration
- Standalone React Context mode
- Toast types: success, error, warning, info
- Interactive features: hover to pause, click to make permanent, swipe to dismiss
- Progress bar with manual updates
- Smooth animations and stacking
- TypeScript support
- Dual build: CommonJS and ESM

### Features
- Beautiful gradient styling with Tailwind CSS
- Responsive design (mobile and desktop)
- Gesture support (swipe to dismiss)
- Auto-dismiss with configurable duration
- Manual progress updates for file uploads
- Permanent toasts (no auto-dismiss)
- Pause on hover
- Multiple toast stacking

---

## Version History

- **3.0.1** (2026-02-15) - Fixed toast stacking bug
- **3.0.0** (2026-02-15) - Removed Tailwind, added custom themes
- **2.1.4** (2026-02-14) - Initial release with Tailwind CSS
