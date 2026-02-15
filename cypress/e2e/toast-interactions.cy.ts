describe('Toast Interactions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Toast Display', () => {
    it('shows success toast when button is clicked', () => {
      cy.clickButton('Success');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'Success!');
    });

    it('shows error toast when button is clicked', () => {
      cy.clickButton('Error');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'Error!');
    });

    it('shows warning toast when button is clicked', () => {
      cy.clickButton('Warning');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'Warning!');
    });

    it('shows info toast when button is clicked', () => {
      cy.clickButton('Info');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'Info');
    });
  });

  describe('Toast Stacking', () => {
    it('stacks multiple toasts', () => {
      cy.clickButton('Success');
      cy.clickButton('Error');
      cy.clickButton('Warning');
      
      cy.get('[role="alert"]').should('have.length', 3);
    });

    it('positions toasts in a stack', () => {
      cy.clickButton('Success');
      cy.clickButton('Error');
      
      cy.get('[role="alert"]').should('have.length', 2);
      // Toasts should be stacked vertically
      cy.get('[role="alert"]').first().should('be.visible');
      cy.get('[role="alert"]').last().should('be.visible');
    });
  });

  describe('Toast Dismissal', () => {
    it('dismisses toast when X button is clicked', () => {
      cy.clickButton('Success');
      cy.waitForToast();
      
      cy.get('button[aria-label="Dismiss notification"]').first().click();
      cy.get('[role="alert"]').should('not.exist');
    });

    it('dismisses individual toasts from a stack', () => {
      cy.clickButton('Success');
      cy.clickButton('Error');
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
        .and('contain', 'This is a very long message');
    });

    it('displays toasts without messages', () => {
      cy.clickButton('No Message');
      cy.waitForToast()
        .should('be.visible')
        .and('contain', 'No Message');
    });
  });

  describe('Toast Durations', () => {
    it('shows toast with short duration', () => {
      cy.clickButton('Short Duration');
      cy.waitForToast().should('be.visible');
      
      // Should disappear after 2 seconds
      cy.wait(2500);
      cy.get('[role="alert"]').should('not.exist');
    });

    it('shows toast with long duration', () => {
      cy.clickButton('Long Duration');
      cy.waitForToast().should('be.visible');
      
      // Should still be visible after 5 seconds
      cy.wait(5000);
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  describe('Progress Bar', () => {
    it('shows progress bar on toasts', () => {
      cy.clickButton('Success');
      cy.waitForToast().within(() => {
        // Progress bar container should exist
        cy.get('[style*="position: absolute"]').should('exist');
      });
    });

    it('shows manual progress updates', () => {
      cy.clickButton('Progress Upload');
      cy.waitForToast().should('be.visible');
      
      // Progress should update over time
      cy.wait(1000);
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  describe('Responsive Behavior', () => {
    it('displays correctly on mobile', () => {
      cy.viewport('iphone-x');
      cy.clickButton('Success');
      
      cy.get('[data-toast-container]')
        .should('be.visible')
        .and('have.css', 'position', 'fixed');
    });

    it('displays correctly on desktop', () => {
      cy.viewport(1440, 900);
      cy.clickButton('Success');
      
      cy.get('[data-toast-container]')
        .should('be.visible')
        .and('have.css', 'position', 'fixed');
    });
  });

  describe('Multiple Toasts', () => {
    it('handles rapid toast creation', () => {
      cy.clickButton('Multiple');
      
      // Should create multiple toasts quickly
      cy.get('[role="alert"]', { timeout: 5000 }).should('have.length.at.least', 1);
    });
  });
});
