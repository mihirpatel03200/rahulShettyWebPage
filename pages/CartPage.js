const { expect } = require('@playwright/test');
const { HeaderComponent } = require('./HeaderComponent');
const { messages } = require('../test-data/testData');

class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.items = page.locator('.cartWrap li');
    this.itemNames = this.items.locator('h3');
    this.itemPrices = this.items.locator('.prodTotal p');
    this.emptyMessage = page.getByRole('heading', { name: messages.emptyCart });
    this.totalValue = page.locator('.totalRow').filter({ hasText: 'Total' }).filter({ hasNotText: 'Subtotal' }).locator('.value');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async goto() {
    await this.page.goto('/client/#/dashboard/cart');
    // Either items or the empty-state heading must render.
    await expect(this.items.first().or(this.emptyMessage)).toBeVisible();
  }

  item(productName) {
    return this.items.filter({ has: this.page.locator('h3', { hasText: productName }) });
  }

  async remove(productName) {
    const target = this.item(productName);
    await expect(target).toBeVisible(); // wait for the cart list to render before counting
    const countBefore = await this.items.count();
    await target.locator('.btn-danger').click();
    await expect(this.items).toHaveCount(countBefore - 1);
  }

  /** Empties the shared server-side cart so each test starts clean. */
  async clear() {
    await this.goto();
    let count = await this.items.count();
    while (count > 0) {
      await this.items.first().locator('.btn-danger').click();
      count -= 1;
      await expect(this.items).toHaveCount(count);
    }
    await expect(this.emptyMessage).toBeVisible();
  }

  /** Checks the cart holds exactly these products; the server doesn't guarantee their order. */
  async expectProducts(names) {
    await expect(this.itemNames).toHaveCount(names.length);
    const actual = (await this.itemNames.allInnerTexts()).map((t) => t.trim()).sort();
    expect(actual).toEqual([...names].sort());
  }

  async itemPricesSum() {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.reduce((sum, t) => sum + Number(t.replace(/[^0-9.]/g, '')), 0);
  }

  async total() {
    return Number((await this.totalValue.innerText()).replace(/[^0-9.]/g, ''));
  }

  async checkout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/#\/dashboard\/order/);
  }
}

module.exports = { CartPage };
