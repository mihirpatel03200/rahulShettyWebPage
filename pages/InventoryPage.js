const { expect } = require('@playwright/test');
const { HeaderComponent } = require('./HeaderComponent');

/** Product listing (dashboard) page. */
class InventoryPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.productCards = page.locator('.card-body');
    this.productNames = this.productCards.locator('h5 b');
    this.productPrices = this.productCards.locator('.text-muted');
    this.resultsInfo = page.locator('#res');
    this.minPrice = page.getByPlaceholder('Min Price').filter({ visible: true });
    this.maxPrice = page.getByPlaceholder('Max Price').filter({ visible: true });
    this.toast = page.locator('#toast-container');
  }

  async goto() {
    await this.page.goto('/client/#/dashboard/dash');
    await this.expectLoaded();
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/#\/dashboard\/dash/);
    await expect(this.productCards.first()).toBeVisible();
  }

  card(productName) {
    return this.productCards.filter({ has: this.page.locator('h5 b', { hasText: productName }) });
  }

  async addToCart(productName) {
    await this.card(productName).getByRole('button', { name: 'Add To Cart' }).click();
    await expect(this.toast).toContainText('Product Added To Cart');
  }

  async priceOf(productName) {
    return InventoryPage.parsePrice(await this.card(productName).locator('.text-muted').innerText());
  }

  async filterByPrice(min, max) {
    const before = await this.resultsInfo.innerText();
    await this.minPrice.fill(String(min));
    await this.minPrice.press('Tab'); // input fires (change) on blur
    await this.maxPrice.fill(String(max));
    await this.maxPrice.press('Tab');
    // Web-first wait: the "Showing N results" label updates once the filtered list is back.
    await expect(this.resultsInfo).not.toHaveText(before);
  }

  async allPrices() {
    const texts = await this.productPrices.allInnerTexts();
    return texts.map(InventoryPage.parsePrice);
  }

  static parsePrice(text) {
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}

module.exports = { InventoryPage };
