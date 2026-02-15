# Task 19: Add README Badges

**Milestone**: M2 - Testing & Documentation  
**Estimated Time**: 1 hour  
**Dependencies**: Task 18 (Jest tests), GitHub Actions workflows  
**Priority**: Low  
**Status**: Not Started

---

## Objective

Add professional badges to the README.md to display project status, version, license, test results, and code coverage at a glance.

---

## Problem Statement

**Current State**:
- README.md has no badges
- No visual indicators of project health
- Users can't quickly see version, license, or test status
- Missing professional polish

**Needed**:
- NPM version badge
- License badge
- GitHub Actions test workflow badges
- Code coverage badge (Codecov)
- Build status badge

---

## Solution

Add shields.io badges to the top of README.md that link to relevant resources and automatically update based on project status.

---

## Implementation Steps

### 1. Add NPM Version Badge

```markdown
[![npm version](https://img.shields.io/npm/v/@prmichaelsen/pretty-toasts.svg)](https://www.npmjs.com/package/@prmichaelsen/pretty-toasts)
```

**Purpose**: Shows current published version on NPM

### 2. Add License Badge

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

**Purpose**: Displays license type (MIT)

### 3. Add Unit Tests Badge

```markdown
[![Unit Tests](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/test.yml/badge.svg)](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/test.yml)
```

**Purpose**: Shows if unit tests are passing
**Requires**: `.github/workflows/test.yml` workflow file

### 4. Add Demo Deployment Badge

```markdown
[![Deploy Demo](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/deploy-demo.yml)
```

**Purpose**: Shows if demo deployment is successful
**Note**: Already have `.github/workflows/deploy-demo.yml`

### 5. Add Code Coverage Badge (Codecov)

```markdown
[![codecov](https://codecov.io/gh/prmichaelsen/pretty-toasts/branch/mainline/graph/badge.svg)](https://codecov.io/gh/prmichaelsen/pretty-toasts)
```

**Purpose**: Displays test coverage percentage
**Requires**: 
- Codecov account setup
- Codecov token in GitHub secrets
- Upload coverage in test workflow

### 6. Add Downloads Badge (Optional)

```markdown
[![npm downloads](https://img.shields.io/npm/dm/@prmichaelsen/pretty-toasts.svg)](https://www.npmjs.com/package/@prmichaelsen/pretty-toasts)
```

**Purpose**: Shows monthly download count

### 7. Add Bundle Size Badge (Optional)

```markdown
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@prmichaelsen/pretty-toasts)](https://bundlephobia.com/package/@prmichaelsen/pretty-toasts)
```

**Purpose**: Shows minified + gzipped bundle size

---

## Setup Codecov Integration

### 1. Sign Up for Codecov

1. Go to https://codecov.io/
2. Sign in with GitHub
3. Add `prmichaelsen/pretty-toasts` repository
4. Get the Codecov token

### 2. Add Codecov Token to GitHub Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `CODECOV_TOKEN`
4. Value: [token from Codecov]

### 3. Update Test Workflow

Add Codecov upload step to `.github/workflows/test.yml`:

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
    fail_ci_if_error: true
```

---

## Create Test Workflow

**Create `.github/workflows/test.yml`**:

```yaml
name: Unit Tests

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
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Run tests with coverage
        run: npm run test:ci

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false
```

---

## Update README.md

Add badges section at the top of README.md, right after the title:

```markdown
# Pretty Toasts

[![npm version](https://img.shields.io/npm/v/@prmichaelsen/pretty-toasts.svg)](https://www.npmjs.com/package/@prmichaelsen/pretty-toasts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Unit Tests](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/test.yml/badge.svg)](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/test.yml)
[![Deploy Demo](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/prmichaelsen/pretty-toasts/actions/workflows/deploy-demo.yml)
[![codecov](https://codecov.io/gh/prmichaelsen/pretty-toasts/branch/mainline/graph/badge.svg)](https://codecov.io/gh/prmichaelsen/pretty-toasts)
[![npm downloads](https://img.shields.io/npm/dm/@prmichaelsen/pretty-toasts.svg)](https://www.npmjs.com/package/@prmichaelsen/pretty-toasts)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@prmichaelsen/pretty-toasts)](https://bundlephobia.com/package/@prmichaelsen/pretty-toasts)

## Live Demo

🎮 **Try the interactive demo**: [https://prmichaelsen.github.io/pretty-toasts/](https://prmichaelsen.github.io/pretty-toasts/)

...
```

---

## Verification Checklist

- [ ] NPM version badge displays correct version
- [ ] License badge shows MIT
- [ ] Unit tests badge shows passing status
- [ ] Deploy demo badge shows passing status
- [ ] Codecov badge shows coverage percentage
- [ ] Downloads badge shows monthly downloads
- [ ] Bundle size badge shows correct size
- [ ] All badges link to correct URLs
- [ ] Badges render correctly on GitHub
- [ ] Badges update automatically

---

## Badge Customization

### Color Schemes

Shields.io supports custom colors:
- `?color=brightgreen` - Green (success)
- `?color=yellow` - Yellow (warning)
- `?color=red` - Red (failure)
- `?color=blue` - Blue (info)
- `?color=orange` - Orange

### Custom Styles

Add `?style=` parameter:
- `flat` - Default flat style
- `flat-square` - Flat with square edges
- `for-the-badge` - Large badges
- `plastic` - Plastic style
- `social` - Social media style

Example:
```markdown
[![npm version](https://img.shields.io/npm/v/@prmichaelsen/pretty-toasts.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@prmichaelsen/pretty-toasts)
```

---

## Benefits

**For Users**:
- Quick visual assessment of project health
- Easy access to version, license, and test status
- Confidence in project quality
- Professional appearance

**For Maintainers**:
- Automatic status updates
- No manual badge maintenance
- Encourages maintaining test coverage
- Promotes transparency

**For Project**:
- Professional polish
- Industry standard practice
- Increases trust and adoption
- Showcases project quality

---

## Trade-offs

**Pros**:
- ✅ Professional appearance
- ✅ Automatic updates
- ✅ Quick status visibility
- ✅ Industry standard
- ✅ Free service

**Cons**:
- ⚠️ Requires external services (Codecov)
- ⚠️ Badges can break if services change
- ⚠️ Minor setup time
- ⚠️ Adds visual clutter (if too many)

---

## Best Practices

1. **Keep it minimal** - Only add badges that provide value
2. **Order by importance** - Version, license, tests, coverage
3. **Use consistent style** - All badges should match
4. **Link to resources** - Each badge should link somewhere useful
5. **Update regularly** - Ensure workflows and services are maintained

---

## Alternative Badge Services

- **Shields.io** - Most popular, highly customizable
- **Badgen.net** - Faster, simpler alternative
- **GitHub badges** - Native GitHub status badges
- **Custom badges** - Create your own with SVG

---

## Success Criteria

- [ ] All badges display correctly
- [ ] Badges update automatically
- [ ] Links work correctly
- [ ] Professional appearance
- [ ] README looks polished
- [ ] Badges provide useful information

---

**Status**: Not Started  
**Next Steps**: 
1. Create `.github/workflows/test.yml`
2. Set up Codecov account and token
3. Add badges to README.md
4. Verify all badges work
5. Commit and push changes
6. Verify badges on GitHub
