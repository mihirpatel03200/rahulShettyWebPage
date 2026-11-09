const { expect } = require('@playwright/test');

class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('email@example.com');
    this.passwordInput = page.getByPlaceholder('enter your passsword');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.toast = page.locator('#toast-container');
    this.fieldErrors = page.locator('.invalid-feedback');
  }

  async goto() {
    await this.page.goto('/client/#/auth/login');
    await expect(this.loginButton).toBeVisible();
  }

  async login(email, password) {
    if (email) await this.emailInput.fill(email);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectToast(text) {
    await expect(this.toast).toContainText(text);
  }

  async expectFieldErrors(texts) {
    for (const text of texts) {
      await expect(this.page.getByText(text, { exact: true })).toBeVisible();
    }
  }
}

module.exports = { LoginPage };
