const { test, expect } = require('@playwright/test');
const { restfulBooker } = require('../../test-data/testData');

test.use({ baseURL: restfulBooker.baseURL });

test.describe('Restful-Booker API', () => {
  test('auth token, then create a booking with it @smoke @regression @api', async ({ request }) => {
    // 1. Get a token
    const authRes = await request.post('/auth', { data: restfulBooker.auth });
    expect(authRes.ok()).toBeTruthy();
    const { token } = await authRes.json();
    expect(token).toEqual(expect.any(String));
    expect(token.length).toBeGreaterThan(5);

    // 2. Create a booking, sending the token as the auth cookie
    const createRes = await request.post('/booking', {
      data: restfulBooker.booking,
      headers: { Accept: 'application/json', Cookie: `token=${token}` },
    });
    expect(createRes.status()).toBe(200);
    const body = await createRes.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toEqual(restfulBooker.booking);

    // 3. Read it back to prove it was stored
    const getRes = await request.get(`/booking/${body.bookingid}`, { headers: { Accept: 'application/json' } });
    expect(getRes.ok()).toBeTruthy();
    expect(await getRes.json()).toEqual(restfulBooker.booking);
  });

  test('auth with bad credentials returns no token @regression @api', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});
