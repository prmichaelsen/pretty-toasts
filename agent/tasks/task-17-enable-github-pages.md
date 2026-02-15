# Task 17: Enable GitHub Pages for Demo Deployment

**Milestone**: M2 - Testing & Documentation  
**Estimated Time**: 0.5 hours  
**Dependencies**: Task 12 (GitHub Pages Demo), Task 15 (Reorganize Demos)  
**Priority**: High  
**Status**: Not Started

---

## Objective

Enable GitHub Pages for the pretty-toasts repository so the demo can be automatically deployed and accessible at https://prmichaelsen.github.io/pretty-toasts/

---

## Problem Statement

**Current State**:
- GitHub Actions workflow created (`.github/workflows/deploy-demo.yml`)
- Demo builds successfully
- GitHub Pages shows 404 error
- Pages not enabled in repository settings

**Needed**:
- Enable GitHub Pages in repository settings
- Configure to deploy from GitHub Actions
- Verify demo is accessible

---

## Implementation Steps

### 1. Enable GitHub Pages in Repository Settings

**Navigate to**: https://github.com/prmichaelsen/pretty-toasts/settings/pages

**Steps**:
1. Go to repository Settings
2. Scroll to "Pages" section in left sidebar
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - (NOT "Deploy from a branch")
4. Click "Save"

### 2. Verify Workflow Permissions

**Navigate to**: https://github.com/prmichaelsen/pretty-toasts/settings/actions

**Check**:
- [ ] "Read and write permissions" enabled
- [ ] "Allow GitHub Actions to create and approve pull requests" enabled

**Or verify in workflow file** (`.github/workflows/deploy-demo.yml`):
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### 3. Trigger Workflow

**Option A**: Push a commit (already done)
```bash
git push origin mainline
```

**Option B**: Manual trigger
1. Go to Actions tab
2. Select "Deploy Demo to GitHub Pages" workflow
3. Click "Run workflow"
4. Select "mainline" branch
5. Click "Run workflow"

### 4. Monitor Deployment

**Navigate to**: https://github.com/prmichaelsen/pretty-toasts/actions

**Check**:
- [ ] Workflow runs successfully
- [ ] Build job completes
- [ ] Deploy job completes
- [ ] No errors in logs

**Expected Output**:
```
✓ Build job completed
✓ Deploy job completed
🚀 Deployed to: https://prmichaelsen.github.io/pretty-toasts/
```

### 5. Verify Demo is Accessible

**Navigate to**: https://prmichaelsen.github.io/pretty-toasts/

**Verify**:
- [ ] Demo loads without 404 error
- [ ] All buttons visible and styled correctly
- [ ] Clicking buttons shows toasts
- [ ] Toasts stack correctly
- [ ] No console errors
- [ ] Mobile responsive

---

## Troubleshooting

### Issue: 404 Error Persists

**Possible Causes**:
1. GitHub Pages not enabled
2. Wrong source selected (should be "GitHub Actions")
3. Workflow hasn't run yet
4. Deployment failed

**Solutions**:
1. Double-check Pages settings
2. Manually trigger workflow
3. Check Actions tab for errors
4. Wait 5-10 minutes for DNS propagation

### Issue: Workflow Fails

**Check**:
- Permissions in workflow file
- Repository settings → Actions permissions
- Build logs for errors
- Artifact upload path is correct

**Common Fixes**:
```yaml
# Ensure correct path
path: ./demos/standalone/dist  # NOT ./demo/dist
```

### Issue: Demo Loads But Broken

**Check**:
- Base path in vite.config.ts matches GitHub Pages URL
- Assets loading correctly (check Network tab)
- No CORS errors
- JavaScript bundle loads

**Fix base path**:
```typescript
// demos/standalone/vite.config.ts
export default defineConfig({
  base: '/pretty-toasts/',  // Must match repo name
})
```

---

## Verification Checklist

- [ ] GitHub Pages enabled in repository settings
- [ ] Source set to "GitHub Actions"
- [ ] Workflow permissions configured
- [ ] Workflow runs successfully
- [ ] Demo accessible at https://prmichaelsen.github.io/pretty-toasts/
- [ ] All features work correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] README link works

---

## Documentation Updates

### Update README.md

Once deployed, verify the link works:

```markdown
## Live Demo

🎮 **Try the interactive demo**: [https://prmichaelsen.github.io/pretty-toasts/](https://prmichaelsen.github.io/pretty-toasts/)
```

### Update Task 12

Add deployment verification:

```markdown
## Deployment Verification

✅ **Deployed Successfully** (2026-02-15)
- Demo accessible at: https://prmichaelsen.github.io/pretty-toasts/
- All features working correctly
- No console errors
- Mobile responsive
```

---

## GitHub Pages Configuration

**Repository**: prmichaelsen/pretty-toasts  
**Branch**: mainline  
**Source**: GitHub Actions  
**Custom Domain**: None  
**HTTPS**: Enforced  

**Workflow File**: `.github/workflows/deploy-demo.yml`  
**Deploy Path**: `./demos/standalone/dist`  
**Base URL**: `/pretty-toasts/`

---

## Success Criteria

- [ ] GitHub Pages enabled
- [ ] Demo deploys automatically on push to mainline
- [ ] Demo accessible at public URL
- [ ] All toast features work
- [ ] No errors in browser console
- [ ] Mobile responsive
- [ ] README link verified

---

**Status**: Not Started  
**Priority**: High (Demo is built but not accessible)  
**Next Steps**: 
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Trigger workflow manually or push commit
4. Verify demo is accessible
5. Test all features
6. Update documentation
