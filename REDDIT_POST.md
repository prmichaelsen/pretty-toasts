# Pretty Toasts - Beautiful Gradient Toast Notifications for React

I just released **Pretty Toasts** - a lightweight, beautiful toast notification library for React with both Redux and standalone support!

## 🎮 Live Demo

Try it out: https://prmichaelsen.github.io/pretty-toasts/

## ✨ Key Features

- 🎨 **Beautiful Gradient Styling** - Stunning purple/indigo, purple/rose, orange/purple, and blue/purple gradients
- 🎨 **Custom Theme Support** - Customize colors to match your brand
- 🔄 **Dual Mode** - Works with Redux Toolkit OR standalone React Context
- ⏱️ **Auto-dismiss with Progress Bar** - Visual progress indicator
- 👆 **Interactive Gestures** - Swipe to dismiss, hover to pause, click to make permanent
- 📱 **Fully Responsive** - Optimized for desktop and mobile
- 🎭 **Smooth Animations** - Beautiful enter/exit animations with stacking
- ♿ **Accessible** - ARIA labels and keyboard support
- 🚀 **Zero Config** - Works out of the box, no CSS setup required
- 📦 **Tiny Bundle** - ~27KB minified
- ✅ **TypeScript** - Full type safety
- ✅ **Well Tested** - 85 unit tests, 65% coverage

## 📦 Installation

```bash
npm install @prmichaelsen/pretty-toasts
```

## 🚀 Quick Start

### With Redux Toolkit

```typescript
import { ReduxToastContainer } from '@prmichaelsen/pretty-toasts/redux';
import { useToast } from '@prmichaelsen/pretty-toasts';

function App() {
  const { success, error, warning, info } = useToast();

  return (
    <>
      <button onClick={() => success({ title: 'Success!' })}>
        Show Toast
      </button>
      <ReduxToastContainer />
    </>
  );
}
```

### Standalone (without Redux)

```typescript
import { ToastProvider, StandaloneToastContainer } from '@prmichaelsen/pretty-toasts/standalone';
import { useToast } from '@prmichaelsen/pretty-toasts';

function App() {
  const { success } = useToast();

  return (
    <ToastProvider>
      <button onClick={() => success({ title: 'Success!' })}>
        Show Toast
      </button>
      <StandaloneToastContainer />
    </ToastProvider>
  );
}
```

## 🎨 Custom Themes

Easily customize gradient colors to match your brand:

```typescript
const customTheme = {
  toast: {
    success: {
      from: '#10b981', // emerald
      to: '#3b82f6',   // blue
      opacity: 0.95,
    },
  },
};

<ToastProvider theme={customTheme}>
  <App />
</ToastProvider>
```

## 🔗 Links

- **NPM**: https://www.npmjs.com/package/@prmichaelsen/pretty-toasts
- **GitHub**: https://github.com/prmichaelsen/pretty-toasts
- **Live Demo**: https://prmichaelsen.github.io/pretty-toasts/
- **Docs**: Full documentation in the README

## 🤔 Why Another Toast Library?

I wanted a toast library that:
- ✅ Works with **both** Redux and standalone React
- ✅ Has **beautiful gradients** out of the box
- ✅ Requires **zero CSS configuration**
- ✅ Supports **custom theming**
- ✅ Has **smooth animations** and **gesture support**
- ✅ Is **fully typed** with TypeScript
- ✅ Is **well tested** and maintained

Most toast libraries require complex setup or don't support both Redux and Context patterns. Pretty Toasts gives you the best of both worlds!

## 📊 Stats

[![npm version](https://img.shields.io/npm/v/@prmichaelsen/pretty-toasts.svg)](https://www.npmjs.com/package/@prmichaelsen/pretty-toasts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Unit Tests](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/test.yml/badge.svg)](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/prmichaelsen/pretty-toasts/branch/mainline/graph/badge.svg)](https://codecov.io/gh/prmichaelsen/pretty-toasts)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@prmichaelsen/pretty-toasts)](https://bundlephobia.com/package/@prmichaelsen/pretty-toasts)

## 💬 Feedback Welcome!

I'd love to hear your thoughts, suggestions, or bug reports. Feel free to:
- Try the [live demo](https://prmichaelsen.github.io/pretty-toasts/)
- Check out the [source code](https://github.com/prmichaelsen/pretty-toasts)
- Open an issue or PR
- Star the repo if you find it useful! ⭐

---

*Built with React, TypeScript, and Redux Toolkit. MIT Licensed.*
