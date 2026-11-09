const { test, expect } = require('../../fixtures/fixtures');
const { validUser, invalidLogins } = require('../../test-data/testData');

// Login tests must start logged out, so they ignore the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('valid login opens the inventory page @smoke @regression', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);

    await expect(loginPage.toast).toContainText('Login Successfully');
    await inventoryPage.expectLoaded();
    await expect(inventoryPage.productCards).not.toHaveCount(0);
    await expect(inventoryPage.header.signOutButton).toBeVisible();
    await expect(page).toHaveTitle(/Let's Shop/);
  });

  for (const data of invalidLogins) {
    test(`negative login: ${data.title} @regression`, async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login(data.email, data.password);

      if (data.toast) await loginPage.expectToast(data.toast);
      if (data.fieldErrors) await loginPage.expectFieldErrors(data.fieldErrors);
      await expect(page).toHaveURL(/#\/auth\/login/);
    });
  }
});
