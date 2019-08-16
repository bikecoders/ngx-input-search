import { getGreeting } from '../support/app.po';

describe('demo', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Search Countries');
  });
});
