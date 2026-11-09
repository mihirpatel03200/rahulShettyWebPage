const { expect } = require('@playwright/test');

/** Checkout (order) page plus the order-confirmation ("thanks") page. */
class CheckoutPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.itemTitles = page.locator('.item__title');
    this.itemPrices = page.locator('.item__price');
    this.countryInput = page.getByPlaceholder('Select Country');
    this.countryOptions = page.locator('.ta-results button');
    this.shippingEmail = page.locator('.user__name label');
    this.placeOrderButton = page.locator('.action__submit');
    // Confirmation page
    this.thankYouHeading = page.locator('.hero-primary');
    this.orderIds = page.locator('.em-spacer-1 .ng-star-inserted');
    this.confirmedLines = page.locator('.line-item.product-info-column');
  }

  /** Checks the order lists exactly these products, in any order. */
  async expectProducts(names) {
    await expect(this.itemTitles).toHaveCount(names.length);
    const actual = (await this.itemTitles.allInnerTexts()).map((t) => t.trim()).sort();
    expect(actual).toEqual([...names].sort());
  }

  async itemPricesSum() {
    await expect(this.itemPrices.first()).toBeVisible();
    const texts = await this.itemPrices.allInnerTexts();
    return texts.reduce((sum, t) => sum + Number(t.replace(/[^0-9.]/g, '')), 0);
  }

  async selectCountry(query, country) {
    await this.countryInput.pressSequentially(query, { delay: 100 });
    await this.countryOptions.filter({ hasText: new RegExp(`^\\s*${country}\\s*$`) }).click();
    await expect(this.countryInput).toHaveValue(country);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    await expect(this.page).toHaveURL(/#\/dashboard\/thanks/);
  }
}

module.exports = { CheckoutPage };
