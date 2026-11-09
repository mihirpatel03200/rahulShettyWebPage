const { test, expect } = require('../../fixtures/fixtures');
const { products, checkout, messages, validUser } = require('../../test-data/testData');

test.describe('Checkout', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.clear();
  });

  test('full checkout end-to-end, verify total and thank-you message @smoke @regression', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.goto();
    const price1 = await inventoryPage.priceOf(products.first);
    const price2 = await inventoryPage.priceOf(products.second);
    await inventoryPage.addToCart(products.first);
    await inventoryPage.addToCart(products.second);
    await inventoryPage.header.expectCartCount(2);

    // Cart total = sum of product prices
    await inventoryPage.header.openCart();
    await cartPage.expectProducts([products.first, products.second]);
    const expectedTotal = price1 + price2;
    expect(await cartPage.itemPricesSum()).toBe(expectedTotal);
    expect(await cartPage.total()).toBe(expectedTotal);

    // Checkout page shows the same items and total
    await cartPage.checkout();
    await checkoutPage.expectProducts([products.first, products.second]);
    expect(await checkoutPage.itemPricesSum()).toBe(expectedTotal);
    await expect(checkoutPage.shippingEmail).toHaveText(validUser.email);

    await checkoutPage.selectCountry(checkout.countryQuery, checkout.country);
    await checkoutPage.placeOrder();

    // Confirmation
    await expect(checkoutPage.thankYouHeading).toHaveText(messages.orderThankYou, { ignoreCase: true });
    await expect(checkoutPage.orderIds).toHaveCount(2); // one order id per product
    await expect(checkoutPage.confirmedLines.filter({ hasText: products.first })).toBeVisible();
    await expect(checkoutPage.confirmedLines.filter({ hasText: products.second })).toBeVisible();
  });
});
