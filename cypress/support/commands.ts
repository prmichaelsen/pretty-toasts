/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for toast to appear
       * @example cy.waitForToast()
       */
      waitForToast(): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Click a button by its text content
       * @example cy.clickButton('Show Success Toast')
       */
      clickButton(text: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('waitForToast', () => {
  return cy.get('[role="alert"]', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('clickButton', (text: string) => {
  cy.contains('button', text).click();
});

export {};
