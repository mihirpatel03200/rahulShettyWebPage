const { test, expect } = require('../../fixtures/fixtures');
const { products } = require('../../test-data/testData');

test.describe('Cart', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.clear();
  });

  test('add 2 products, verify cart count and contents @smoke @regression', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.header.expectCartCount(0);

    await inventoryPage.addToCart(products.first);
    await inventoryPage.header.expectCartCount(1);
    await inventoryPage.addToCart(products.second);
    await inventoryPage.header.expectCartCount(2);

    await inventoryPage.header.openCart();
    await expect(cartPage.items).toHaveCount(2);
    await cartPage.expectProducts([products.first, products.second]);
  });

  test('remove a product, verify badge and list update @regression', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.first);
    await inventoryPage.addToCart(products.second);
    await inventoryPage.header.expectCartCount(2);

    await inventoryPage.header.openCart();
    await cartPage.remove(products.first);

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.item(products.first)).toHaveCount(0);
    await cartPage.expectProducts([products.second]);
    await cartPage.header.expectCartCount(1);
  });
});
