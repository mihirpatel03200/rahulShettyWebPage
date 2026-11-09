# Playwright QA practical: Rahul Shetty Academy e-commerce

End-to-end UI tests and an API test written with **Playwright (JavaScript)**.

- UI under test: https://rahulshettyacademy.com/client/#/auth/login
- API under test: https://restful-booker.herokuapp.com

## Setup

Requirements: Node.js 18+.

```bash
npm install
npx playwright install chromium
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
```

Register an account at https://rahulshettyacademy.com/client/#/auth/register and put the email and password in `.env`:

```
USER_EMAIL=you@example.com
USER_PASSWORD=YourPassword@123
```

`.env` is git-ignored. In CI the same values come from GitHub secrets.

## Run commands

| What | Command |
|---|---|
| All tests, headless (default) | `npx playwright test` |
| All tests, headed | `npx playwright test --headed` |
| Smoke only | `npx playwright test --grep @smoke` |
| Regression only | `npx playwright test --grep @regression` |
| API test only | `npx playwright test --project=api` |
| One file | `npx playwright test tests/ui/checkout.spec.js` |
| Debug / UI mode | `npx playwright test --debug` / `npx playwright test --ui` |
| Open HTML report | `npx playwright show-report` |

Traces are recorded **on the first retry** (`trace: 'on-first-retry'`, `retries: 1` locally, `2` on CI). Open one from the HTML report, or with `npx playwright show-trace <trace.zip>`.

## Test cases

| # | Spec | Test | Type | Tags |
|---|---|---|---|---|
| 1 | `tests/ui/login.spec.js` | Valid login, inventory page loads | Positive | @smoke @regression |
| 2 | `tests/ui/login.spec.js` | Data-driven negative login: wrong password, unregistered user, blank email + password, invalid email format; each error message checked | Negative (×4) | @regression |
| 3 | `tests/ui/cart.spec.js` | Add 2 products, check badge count and cart contents | Positive | @smoke @regression |
| 4 | `tests/ui/cart.spec.js` | Remove a product, check badge and list update | Positive | @regression |
| 5 | `tests/ui/priceFilter.spec.js` | Filter by price range, check every price is in range and the low-to-high order matches | Positive | @regression |
| 6 | `tests/ui/checkout.spec.js` | Full checkout: cart total = sum of item prices, checkout total matches, place order, "Thankyou for the order." | E2E | @smoke @regression |
| 7 | `tests/api/booking.spec.js` | `POST /auth` → assert token → `POST /booking` with token → assert response body → `GET` it back | API positive | @smoke @regression @api |
| 8 | `tests/api/booking.spec.js` | `POST /auth` with bad credentials → no token, "Bad credentials" | API negative | @regression @api |

### Changes from the saucedemo brief

The brief was written for saucedemo.com. On this site:

- **No locked-out user** exists, so the data-driven login cases are *wrong password*, *unregistered user*, *blank fields* and *invalid email format*.
- **No sort dropdown** exists, so test 5 uses the **Min/Max price filter** and checks the prices (including their low-to-high order).
- **No `data-test` attributes** exist. Locators use `getByRole` / `getByPlaceholder` first, then stable ids/classes from the app's markup.
- One account means **one server-side cart**, so the suite runs with `workers: 1` and cart tests empty the cart in `beforeEach`.

## Structure

```
├── .github/workflows/playwright.yml   # CI: smoke tests on push / PR
├── fixtures/fixtures.js               # custom fixture that gives tests the page objects
├── pages/                             # Page Object Model
│   ├── LoginPage.js
│   ├── HeaderComponent.js             # cart badge, sign out (shared nav)
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js                # checkout + order confirmation
├── test-data/testData.js              # all test data (users, products, messages, API payloads)
├── tests/
│   ├── auth.setup.js                  # logs in once, saves storage state
│   ├── ui/                            # browser tests (reuse the saved session)
│   └── api/                           # request-fixture tests (no browser)
├── playwright.config.js               # projects: setup → chromium, api; trace, reporter
└── .env.example
```

### Good practices used

- **Page Object Model**, with page objects supplied by a **custom fixture** (`test.extend`).
- **Login is reused through storage state**: the `setup` project logs in once and saves `playwright/.auth/user.json` (the app keeps its JWT in localStorage). The `chromium` project depends on `setup` and loads that state. Login tests clear it to start logged out.
- **Web-first assertions** (`toHaveText`, `toHaveCount`, `toHaveURL`, …) and **no hard waits** (no `waitForTimeout`).
- **Test data in a separate file**, and credentials in environment variables.
- **Tags** (`@smoke`, `@regression`, `@api`) for `--grep`.

## CI (GitHub Actions)

`.github/workflows/playwright.yml` runs `npx playwright test --grep @smoke` on every push or PR to `main`/`master` and uploads the HTML report as a build artifact. Add the repository secrets `USER_EMAIL` and `USER_PASSWORD` first.

## Passing run screenshot

See `docs/test-run.png` (HTML report from a full local run).
