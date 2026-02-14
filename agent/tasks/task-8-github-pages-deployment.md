# Task 8: Deploy Storybook to GitHub Pages

**Milestone**: M2 - Testing & Documentation
**Estimated Time**: 2-3 hours
**Dependencies**: Task 7 (Storybook Setup must be complete)
**Status**: Not Started

---

## Objective

Deploy the Storybook build to GitHub Pages to provide a live, interactive demo of the pretty-toasts library. This allows potential users to see the library in action before installing it, and provides a permanent reference for the component API.

---

## Steps

### 1. Install GitHub Pages Deployment Tool

```bash
npm install --save-dev @storybook/storybook-deployer
```

**Alternative**: Use GitHub Actions (recommended for automation)

### 2. Configure Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "deploy-storybook": "storybook-deployer --ci",
    "predeploy-storybook": "npm run build-storybook"
  }
}
```

### 3. Option A: Manual Deployment with storybook-deployer

#### Configure Deployment

Create or update `package.json`:

```json
{
  "storybook-deployer": {
    "gitUsername": "GitHub Actions",
    "gitEmail": "actions@github.com",
    "commitMessage": "Deploy Storybook [skip ci]"
  }
}
```

#### Deploy Manually

```bash
npm run deploy-storybook
```

This will:
1. Build Storybook to `storybook-static/`
2. Push to `gh-pages` branch
3. GitHub Pages will serve from that branch

### 4. Option B: Automated Deployment with GitHub Actions (Recommended)

#### Create GitHub Actions Workflow

Create `.github/workflows/deploy-storybook.yml`:

```yaml
name: Deploy Storybook to GitHub Pages

on:
  push:
    branches:
      - main
      - mainline
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./storybook-static

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

### 5. Configure GitHub Repository Settings

#### Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: "GitHub Actions"
3. Save

**Note**: If using the `gh-pages` branch method (Option A):
1. Source: "Deploy from a branch"
2. Branch: `gh-pages`
3. Folder: `/ (root)`

### 6. Update Storybook Configuration for GitHub Pages

Update `.storybook/main.js` to handle base path:

```javascript
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
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
  // Configure base path for GitHub Pages
  viteFinal: async (config) => {
    // Set base path when building for production
    if (process.env.NODE_ENV === 'production') {
      config.base = '/pretty-toasts/'; // Replace with your repo name
    }
    return config;
  },
};

export default config;
```

### 7. Add Custom Domain (Optional)

If you have a custom domain:

1. Create `storybook-static/CNAME` file:
   ```
   docs.yourproject.com
   ```

2. Or add to `.storybook/manager-head.html`:
   ```html
   <!-- This will be copied to the build -->
   ```

3. Configure DNS:
   - Add CNAME record pointing to `<username>.github.io`
   - Or A records pointing to GitHub Pages IPs

### 8. Update README with Storybook Link

Add to `README.md`:

```markdown
## 📚 Documentation & Demo

**[View Interactive Storybook →](https://yourusername.github.io/pretty-toasts/)**

Explore all components, variants, and interactions in our live Storybook demo.

## Features

...
```

### 9. Add Storybook Badge

Add badge to `README.md`:

```markdown
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)](https://yourusername.github.io/pretty-toasts/)
```

### 10. Test Deployment

#### Local Build Test

```bash
npm run build-storybook
npx http-server storybook-static
```

Visit `http://localhost:8080` to verify the build works.

#### After Deployment

1. Push changes to main branch
2. Wait for GitHub Actions to complete
3. Visit `https://yourusername.github.io/pretty-toasts/`
4. Verify all stories load correctly
5. Test on mobile and desktop
6. Check all interactive features work

---

## Verification

- [ ] GitHub Actions workflow runs successfully
- [ ] Storybook is accessible at GitHub Pages URL
- [ ] All stories render correctly on GitHub Pages
- [ ] Tailwind styles are applied correctly
- [ ] Interactive features work (buttons, controls)
- [ ] Responsive viewports work
- [ ] No console errors in browser
- [ ] All images/assets load correctly
- [ ] Navigation between stories works
- [ ] Documentation is readable
- [ ] Mobile view works correctly
- [ ] README includes link to live Storybook
- [ ] Deployment happens automatically on push to main

---

## Files to Create/Modify

1. `.github/workflows/deploy-storybook.yml` - GitHub Actions workflow
2. `.storybook/main.js` - Update with base path configuration
3. `README.md` - Add Storybook link and badge
4. `package.json` - Add deployment scripts (if using storybook-deployer)

---

## Troubleshooting

### Issue: 404 on GitHub Pages

**Solution**: Check base path in `.storybook/main.js` matches repo name

### Issue: Styles not loading

**Solution**: Ensure Tailwind CSS is properly configured in Storybook

### Issue: GitHub Actions fails

**Solution**: 
- Check Node.js version compatibility
- Verify all dependencies install correctly
- Check build logs for errors

### Issue: Assets not loading

**Solution**: Use relative paths, not absolute paths

---

## URLs

After deployment, your Storybook will be available at:

- **GitHub Pages**: `https://<username>.github.io/<repo-name>/`
- **Example**: `https://yourusername.github.io/pretty-toasts/`

---

## Notes

- GitHub Pages deployment is free for public repositories
- Updates deploy automatically on push to main (with GitHub Actions)
- Build time is typically 2-5 minutes
- Storybook static build is optimized and fast to load
- Consider adding a custom domain for professional appearance
- Keep the `gh-pages` branch or use GitHub Actions artifacts
- Monitor GitHub Actions usage (free tier has limits)

---

## Security Considerations

- Don't commit secrets or API keys
- Storybook is public - don't include sensitive data
- Use environment variables for any configuration
- Review what's included in the static build

---

**Next Task**: Task 9 - Cypress E2E Testing
