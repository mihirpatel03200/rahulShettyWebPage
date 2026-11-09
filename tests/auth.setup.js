const { test: setup, expect } = require('../fixtures/fixtures');
const { validUser } = require('../test-data/testData');
const path = require('path');

const STORAGE_STATE = path.join(__dirname, '../playwright/.auth/user.json');

// Tagged so `--grep @smoke` / `--grep @regression` still run this dependency.
setup('authenticate @smoke @regression',async ({ page, loginPage, inventoryPage }) => {
  expect(validUser.email, 'Set USER_EMAIL and USER_PASSWORD in .env (see README)').toBeTruthy();
  await loginPage.goto();
  await loginPage.login(validUser.email, validUser.password);
  await inventoryPage.expectLoaded();
  // The app keeps its JWT in localStorage; storageState captures it.
  await page.context().storageState({ path: STORAGE_STATE });
});
