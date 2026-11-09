const { test, expect } = require('../../fixtures/fixtures');
const { priceFilter } = require('../../test-data/testData');

// This site has no "sort by price" dropdown (that was a saucedemo feature),
// so the price test uses the Min/Max price filter instead and checks the prices
// that come back, including their low-to-high order.
test.describe('Products by price', () => {
  test('filter by price range returns only products within range @regression', async ({ inventoryPage }) => {
    await inventoryPage.goto();
    const allBefore = await inventoryPage.allPrices();
    const expected = allBefore.filter((p) => p >= priceFilter.min && p <= priceFilter.max).sort((a, b) => a - b);
    expect(expected.length, 'test data should match at least one product').toBeGreaterThan(0);

    await inventoryPage.filterByPrice(priceFilter.min, priceFilter.max);
    await expect(inventoryPage.productCards).toHaveCount(expected.length);

    const prices = await inventoryPage.allPrices();
    for (const price of prices) {
      expect(price).toBeGreaterThanOrEqual(priceFilter.min);
      expect(price).toBeLessThanOrEqual(priceFilter.max);
    }
    // Same prices as expected when ordered low to high.
    expect([...prices].sort((a, b) => a - b)).toEqual(expected);
  });
});
