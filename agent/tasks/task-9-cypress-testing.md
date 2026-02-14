# Task 9: Cypress E2E Testing Against Storybook

**Milestone**: M2 - Testing & Documentation
**Estimated Time**: 4-5 hours
**Dependencies**: Task 7 (Storybook Setup must be complete)
**Status**: Not Started

---

## Objective

Set up Cypress end-to-end testing that runs against the Storybook instance to verify all toast functionality works correctly. This provides automated visual and interaction testing for the component library.

---

## Steps

### 1. Install Cypress and Dependencies

```bash
npm install --save-dev cypress @cypress/webpack-preprocessor @cypress/vite-dev-server
npm install --save-dev start-server-and-test
```

**Purpose**:
- `cypress`: E2E testing framework
- `start-server-and-test`: Run Storybook and Cypress together
- Preprocessor: Handle TypeScript in Cypress

### 2. Initialize Cypress

```bash
npx cypress open
```

This creates:
- `cypress/` directory
- `cypress.config.ts`
- Example test files

### 3. Configure Cypress

Create/update `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:6006',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
```

### 4. Update Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test:e2e": "start-server-and-test storybook http://localhost:6006 cypress:run",
    "test:e2e:open": "start-server-and-test storybook http://localhost:6006 cypress:open"
  }
}
```

### 5. Create Cypress Support Files

#### Update `cypress/support/e2e.ts`:

```typescript
// Import commands
import './commands';

// Hide fetch/XHR requests in command log
Cypress.on('window:before:load', (win) => {
  // Stub console methods if needed
});

// Add custom assertions
chai.use((chai, utils) => {
  // Custom assertions here if needed
});
```

#### Create `cypress/support/commands.ts`:

```typescript
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Navigate to a specific Storybook story
       * @example cy.visitStory('components-toast--success')
       */
      visitStory(storyId: string): Chainable<void>;
      
      /**
       * Get the Storybook iframe content
       * @example cy.getStoryFrame().find('.toast')
       */
      getStoryFrame(): Chainable<JQuery<HTMLIFrameElement>>;
      
      /**
       * Wait for toast to appear
       * @example cy.waitForToast()
       */
      waitForToast(): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('visitStory', (storyId: string) => {
  cy.visit(`/iframe.html?id=${storyId}&viewMode=story`);
});

Cypress.Commands.add('getStoryFrame', () => {
  return cy.get('iframe#storybook-preview-iframe')
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
});

Cypress.Commands.add('waitForToast', () => {
  return cy.get('[role="alert"]', { timeout: 10000 }).should('be.visible');
});

export {};
```

### 6. Create Test Files

#### A. Toast Component Tests

Create `cypress/e2e/toast-component.cy.ts`:

```typescript
describe('Toast Component', () => {
  beforeEach(() => {
    cy.visitStory('components-toast--success');
  });

  it('renders success toast with correct gradient', () => {
    cy.waitForToast()
      .should('have.class', 'bg-gradient-to-r')
      .should('have.class', 'from-purple-500/90')
      .should('have.class', 'to-indigo-500/90');
  });

  it('displays title and message', () => {
    cy.waitForToast().within(() => {
      cy.contains('Success!').should('be.visible');
      cy.contains('Operation completed successfully').should('be.visible');
    });
  });

  it('shows progress bar', () => {
    cy.waitForToast().within(() => {
      cy.get('.h-1').should('exist'); // Progress bar container
      cy.get('.bg-gradient-to-r').should('exist'); // Progress bar fill
    });
  });

  it('has dismiss button', () => {
    cy.waitForToast().within(() => {
      cy.get('button[aria-label="Dismiss notification"]').should('be.visible');
    });
  });

  it('dismisses when X button is clicked', () => {
    cy.waitForToast().within(() => {
      cy.get('button[aria-label="Dismiss notification"]').click();
    });
    cy.get('[role="alert"]').should('not.exist');
  });

  describe('Toast Types', () => {
    it('renders error toast with correct gradient', () => {
      cy.visitStory('components-toast--error');
      cy.waitForToast()
        .should('have.class', 'from-purple-500/90')
        .should('have.class', 'to-rose-500/90');
    });

    it('renders warning toast with correct gradient', () => {
      cy.visitStory('components-toast--warning');
      cy.waitForToast()
        .should('have.class', 'from-amber-500/90')
        .should('have.class', 'to-orange-500/90');
    });

    it('renders info toast with correct gradient', () => {
      cy.visitStory('components-toast--info');
      cy.waitForToast()
        .should('have.class', 'from-blue-500/90')
        .should('have.class', 'to-purple-500/90');
    });
  });

  describe('Progress Bar', () => {
    it('shows manual progress', () => {
      cy.visitStory('components-toast--with-progress');
      cy.waitForToast().within(() => {
        cy.get('.h-1 > div').should('have.css', 'width').and('match', /45%/);
      });
    });
  });

  describe('Long Messages', () => {
    it('handles long messages correctly', () => {
      cy.visitStory('components-toast--long-message');
      cy.waitForToast().should('be.visible');
      cy.contains('This is a very long message').should('be.visible');
    });
  });
});
```

#### B. Toast Container Tests

Create `cypress/e2e/toast-container.cy.ts`:

```typescript
describe('Toast Container', () => {
  describe('Standalone Mode', () => {
    beforeEach(() => {
      cy.visitStory('containers-standalonetoastcontainer--interactive');
    });

    it('shows toast when button is clicked', () => {
      cy.contains('Show Success Toast').click();
      cy.waitForToast().should('be.visible');
    });

    it('stacks multiple toasts', () => {
      cy.contains('Show Success Toast').click();
      cy.contains('Show Error Toast').click();
      cy.get('[role="alert"]').should('have.length', 2);
    });

    it('positions toasts correctly', () => {
      cy.contains('Show Success Toast').click();
      cy.get('[data-toast-container]')
        .should('have.css', 'position', 'fixed')
        .should('have.css', 'bottom', '16px')
        .should('have.css', 'right', '16px');
    });

    it('dismisses all toasts when clicking outside', () => {
      cy.contains('Show Success Toast').click();
      cy.contains('Show Error Toast').click();
      cy.get('[role="alert"]').should('have.length', 2);
      
      // Click outside the toast container
      cy.get('body').click(100, 100);
      cy.get('[role="alert"]').should('not.exist');
    });
  });

  describe('Responsive Behavior', () => {
    it('uses full width on mobile', () => {
      cy.viewport('iphone-x');
      cy.visitStory('containers-standalonetoastcontainer--interactive');
      cy.contains('Show Success Toast').click();
      
      cy.get('[data-toast-container]')
        .should('have.css', 'width')
        .and('match', /calc\(100% - 1rem\)/);
    });

    it('uses 33vw width on desktop', () => {
      cy.viewport(1440, 900);
      cy.visitStory('containers-standalonetoastcontainer--interactive');
      cy.contains('Show Success Toast').click();
      
      cy.get('[data-toast-container]')
        .should('have.css', 'width')
        .and('match', /33vw/);
    });
  });
});
```

#### C. Interaction Tests

Create `cypress/e2e/toast-interactions.cy.ts`:

```typescript
describe('Toast Interactions', () => {
  beforeEach(() => {
    cy.visitStory('containers-standalonetoastcontainer--interactive');
  });

  describe('Hover Behavior', () => {
    it('pauses progress on hover', () => {
      cy.contains('Show Success Toast').click();
      cy.waitForToast().trigger('mouseenter');
      
      // Get initial progress
      cy.get('.h-1 > div').invoke('css', 'width').then((width1) => {
        cy.wait(500);
        // Progress should not change while hovering
        cy.get('.h-1 > div').invoke('css', 'width').should('equal', width1);
      });
    });

    it('resumes progress on mouse leave', () => {
      cy.contains('Show Success Toast').click();
      cy.waitForToast()
        .trigger('mouseenter')
        .trigger('mouseleave');
      
      // Progress should continue
      cy.get('.h-1 > div').invoke('css', 'width').then((width1) => {
        cy.wait(500);
        cy.get('.h-1 > div').invoke('css', 'width').should('not.equal', width1);
      });
    });
  });

  describe('Swipe to Dismiss', () => {
    it('dismisses toast on swipe right (mobile)', () => {
      cy.viewport('iphone-x');
      cy.contains('Show Success Toast').click();
      
      cy.waitForToast()
        .trigger('touchstart', { touches: [{ clientX: 50, clientY: 100 }] })
        .trigger('touchmove', { touches: [{ clientX: 200, clientY: 100 }] })
        .trigger('touchend');
      
      cy.get('[role="alert"]').should('not.exist');
    });

    it('does not dismiss on small swipe', () => {
      cy.viewport('iphone-x');
      cy.contains('Show Success Toast').click();
      
      cy.waitForToast()
        .trigger('touchstart', { touches: [{ clientX: 50, clientY: 100 }] })
        .trigger('touchmove', { touches: [{ clientX: 100, clientY: 100 }] })
        .trigger('touchend');
      
      cy.get('[role="alert"]').should('exist');
    });
  });

  describe('Drag to Dismiss (Desktop)', () => {
    it('dismisses toast on drag right', () => {
      cy.contains('Show Success Toast').click();
      
      cy.waitForToast()
        .trigger('mousedown', { clientX: 50, clientY: 100, button: 0 })
        .trigger('mousemove', { clientX: 200, clientY: 100, buttons: 1 })
        .trigger('mouseup');
      
      cy.get('[role="alert"]').should('not.exist');
    });
  });

  describe('Auto-dismiss', () => {
    it('automatically dismisses after duration', () => {
      // Use a story with short duration for faster testing
      cy.visitStory('components-toast--success');
      cy.waitForToast().should('be.visible');
      
      // Wait for auto-dismiss (default 10s, but can be configured)
      cy.get('[role="alert"]', { timeout: 12000 }).should('not.exist');
    });
  });
});
```

#### D. Accessibility Tests

Create `cypress/e2e/toast-accessibility.cy.ts`:

```typescript
describe('Toast Accessibility', () => {
  beforeEach(() => {
    cy.visitStory('containers-standalonetoastcontainer--interactive');
    cy.injectAxe(); // Requires cypress-axe plugin
  });

  it('has proper ARIA roles', () => {
    cy.contains('Show Success Toast').click();
    cy.get('[role="alert"]').should('exist');
    cy.get('[aria-live="polite"]').should('exist');
  });

  it('has accessible dismiss button', () => {
    cy.contains('Show Success Toast').click();
    cy.waitForToast().within(() => {
      cy.get('button[aria-label="Dismiss notification"]').should('exist');
    });
  });

  it('has no accessibility violations', () => {
    cy.contains('Show Success Toast').click();
    cy.waitForToast();
    cy.checkA11y('[data-toast-container]');
  });

  it('is keyboard navigable', () => {
    cy.contains('Show Success Toast').click();
    cy.waitForToast().within(() => {
      cy.get('button').focus().should('have.focus');
      cy.focused().type('{enter}');
    });
    cy.get('[role="alert"]').should('not.exist');
  });
});
```

### 7. Add Accessibility Testing Plugin (Optional but Recommended)

```bash
npm install --save-dev cypress-axe axe-core
```

Update `cypress/support/e2e.ts`:

```typescript
import 'cypress-axe';
```

### 8. Create GitHub Actions Workflow for E2E Tests

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, mainline]
  pull_request:
    branches: [main, mainline]

jobs:
  cypress-run:
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

      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          start: npm run storybook
          wait-on: 'http://localhost:6006'
          wait-on-timeout: 120
          browser: chrome
          record: false

      - name: Upload screenshots
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots

      - name: Upload videos
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
```

### 9. Create Cypress TypeScript Configuration

Create `cypress/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "types": ["cypress", "node"],
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["**/*.ts"]
}
```

### 10. Add Visual Regression Testing (Optional)

```bash
npm install --save-dev @cypress/snapshot
```

Create visual regression tests:

```typescript
describe('Visual Regression', () => {
  it('matches success toast snapshot', () => {
    cy.visitStory('components-toast--success');
    cy.waitForToast().toMatchImageSnapshot();
  });
});
```

---

## Verification

- [ ] `npm run test:e2e:open` opens Cypress UI
- [ ] `npm run test:e2e` runs all tests headlessly
- [ ] All toast component tests pass
- [ ] All container tests pass
- [ ] All interaction tests pass
- [ ] All accessibility tests pass
- [ ] Tests run against Storybook successfully
- [ ] GitHub Actions workflow runs successfully
- [ ] Screenshots captured on failure
- [ ] Videos recorded for all test runs
- [ ] Tests cover all major features:
  - [ ] Toast rendering (all types)
  - [ ] Gradients display correctly
  - [ ] Progress bar works
  - [ ] Dismiss button works
  - [ ] Hover to pause
  - [ ] Swipe to dismiss
  - [ ] Drag to dismiss
  - [ ] Auto-dismiss
  - [ ] Click outside to dismiss all
  - [ ] Stacking behavior
  - [ ] Responsive behavior
  - [ ] Accessibility compliance

---

## Files to Create

1. `cypress.config.ts` - Cypress configuration
2. `cypress/support/e2e.ts` - Support file
3. `cypress/support/commands.ts` - Custom commands
4. `cypress/tsconfig.json` - TypeScript config for Cypress
5. `cypress/e2e/toast-component.cy.ts` - Component tests
6. `cypress/e2e/toast-container.cy.ts` - Container tests
7. `cypress/e2e/toast-interactions.cy.ts` - Interaction tests
8. `cypress/e2e/toast-accessibility.cy.ts` - A11y tests
9. `.github/workflows/e2e-tests.yml` - CI workflow
10. `package.json` - Update with test scripts

---

## Running Tests

### Local Development

```bash
# Open Cypress UI (with Storybook running)
npm run test:e2e:open

# Run all tests headlessly
npm run test:e2e

# Run specific test file
npx cypress run --spec "cypress/e2e/toast-component.cy.ts"

# Run with specific browser
npx cypress run --browser chrome
```

### CI/CD

Tests run automatically on:
- Push to main/mainline
- Pull requests
- Manual workflow dispatch

---

## Notes

- Tests run against Storybook, not the built library
- Use `start-server-and-test` to ensure Storybook is running
- Cypress videos help debug failures in CI
- Screenshots captured automatically on test failure
- Consider adding visual regression testing for pixel-perfect verification
- Accessibility tests ensure WCAG compliance
- Test both mobile and desktop viewports
- Mock timers for faster auto-dismiss testing if needed
- Use custom commands to reduce test code duplication

---

## Troubleshooting

### Issue: Tests timeout waiting for Storybook

**Solution**: Increase `wait-on-timeout` in GitHub Actions or locally

### Issue: Flaky tests

**Solution**:
- Add proper waits (`cy.wait()`, `cy.waitForToast()`)
- Use `should` assertions instead of `then`
- Increase timeouts for slow operations

### Issue: Styles not applied in tests

**Solution**: Ensure Tailwind CSS is loaded in Storybook

### Issue: Touch events not working

**Solution**: Use proper touch event syntax with `touches` array

---

**Status**: Not Started
**Estimated Completion**: 4-5 hours
**Dependencies**: Task 7 (Storybook Setup)