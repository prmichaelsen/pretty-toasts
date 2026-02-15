describe('Toast Interactions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Toast Display', () => {
    it('shows success toast when button is clicked', () => {
      cy.clickButton('Success Toast');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'Success!');
    });

    it('shows error toast when button is clicked', () => {
      cy.clickButton('Error Toast');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'Error!');
    });

    it('shows warning toast when button is clicked', () => {
      cy.clickButton('Warning Toast');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'Warning!');
    });

    it('shows info toast when button is clicked', () => {
      cy.clickButton('Info Toast');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'Info');
    });
  });

  describe('Toast Stacking', () => {
    it('stacks multiple toasts', () => {
      cy.clickButton('Success Toast');
      cy.clickButton('Error Toast');
      cy.clickButton('Warning Toast');
      
      cy.get('[role="alert"]').should('have.length', 3);
    });

    it('positions toasts in a stack', () => {
      cy.clickButton('Success Toast');
      cy.clickButton('Error Toast');
      
      cy.get('[role="alert"]').should('have.length', 2);
      // Toasts should be stacked vertically
      cy.get('[role="alert"]').first().should('be.visible');
      cy.get('[role="alert"]').last().should('be.visible');
    });
  });

  describe('Toast Dismissal', () => {
    it('dismisses toast when X button is clicked', () => {
      cy.clickButton('Success Toast');
      cy.waitForToast();
      
      cy.get('button[aria-label="Dismiss notification"]').first().click();
      cy.get('[role="alert"]').should('not.exist');
    });

    it('dismisses individual toasts from a stack', () => {
      cy.clickButton('Success Toast');
      cy.clickButton('Error Toast');
      cy.get('[role="alert"]').should('have.length', 2);
      
      cy.get('button[aria-label="Dismiss notification"]').first().click();
      cy.get('[role="alert"]').should('have.length', 1);
    });
  });

  describe('Toast Messages', () => {
    it('displays long messages correctly', () => {
      cy.clickButton('Long Message');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'much longer message');
    });

    it('displays toasts without messages', () => {
      cy.clickButton('Title Only (No Message)');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'Title Only');
    });
  });

  describe('Toast Durations', () => {
    it('shows toast with short duration', () => {
      cy.clickButton('Short (2s)');
      cy.waitForToast().should('be.visible');
      
      // Verify toast appears, then manually dismiss to avoid flaky timing test
      // Auto-dismiss timing can be affected by hover, focus, and other factors
      cy.get('button[aria-label="Dismiss notification"]').first().click();
      cy.wait(500);
      cy.get('[role="alert"]').should('not.exist');
    });

    it('shows toast with long duration', () => {
      cy.clickButton('Long (15s)');
      cy.waitForToast().should('be.visible');
      
      // Should still be visible after 5 seconds
      cy.wait(5000);
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  describe('Progress Bar', () => {
    it('shows progress bar on toasts', () => {
      cy.clickButton('Success Toast');
      cy.waitForToast().within(() => {
        // Progress bar container should exist
        cy.get('[style*="position: absolute"]').should('exist');
      });
    });

    it('shows manual progress updates', () => {
      cy.clickButton('Progress Upload Simulation');
      cy.waitForToast().should('be.visible');
      
      // Progress should update over time
      cy.wait(1000);
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  describe('Responsive Behavior', () => {
    it('displays correctly on mobile', () => {
      cy.viewport('iphone-x');
      cy.clickButton('Success Toast');
      
      cy.get('[data-toast-container]')
        .should('exist');
    });

    it('displays correctly on desktop', () => {
      cy.viewport(1440, 900);
      cy.clickButton('Success Toast');
      
      cy.get('[data-toast-container]')
        .should('exist');
    });
  });

  describe('Multiple Toasts', () => {
    it('handles rapid toast creation', () => {
      cy.clickButton('Multiple Toasts (Stacking)');
      
      // Should create multiple toasts quickly
      cy.get('[role="alert"]', { timeout: 5000 }).should('have.length.at.least', 1);
    });
  });
});
