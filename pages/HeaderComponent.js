const { expect } = require('@playwright/test');

/** Top navigation shared by every dashboard page. */
class HeaderComponent {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.cartButton = page.locator('button[routerlink="/dashboard/cart"]');
    this.cartBadge = this.cartButton.locator('label');
    this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
  }

  async openCart() {
    await this.cartButton.click();
    await expect(this.page).toHaveURL(/#\/dashboard\/cart/);
  }

  async expectCartCount(count) {
    // The badge is blank (or 0) when the cart is empty.
    await expect(this.cartBadge).toHaveText(count === 0 ? /^\s*0?\s*$/ : new RegExp(`^\\s*${count}\\s*$`));
  }
}

module.exports = { HeaderComponent };
