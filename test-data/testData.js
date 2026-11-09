// All test data lives here; specs never hard-code values.
// Real credentials come from environment variables (.env locally, secrets in CI).

const validUser = {
  email: process.env.USER_EMAIL || '',
  password: process.env.USER_PASSWORD || '',
};

const messages = {
  incorrectCredentials: 'Incorrect email or password.',
  emailRequired: '*Email is required',
  passwordRequired: '*Password is required',
  invalidEmail: '*Enter Valid Email',
  emptyCart: 'No Products in Your Cart !',
  orderThankYou: 'Thankyou for the order.',
};

// Data-driven negative login cases.
const invalidLogins = [
  {
    title: 'wrong password',
    email: validUser.email || 'someone@example.com',
    password: 'Wrong@Pass123',
    toast: messages.incorrectCredentials,
  },
  {
    title: 'unregistered user',
    email: `not.registered.${Date.now()}@example.com`,
    password: 'Any@Pass123',
    toast: messages.incorrectCredentials,
  },
  {
    title: 'blank email and password',
    email: '',
    password: '',
    fieldErrors: [messages.emailRequired, messages.passwordRequired],
  },
  {
    title: 'invalid email format',
    email: 'not-an-email',
    password: 'Any@Pass123',
    fieldErrors: [messages.invalidEmail],
  },
];

const products = {
  first: 'ZARA COAT 3',
  second: 'ADIDAS ORIGINAL',
};

const priceFilter = { min: 10000, max: 40000 };

const checkout = {
  countryQuery: 'ind',
  country: 'India',
};

const restfulBooker = {
  baseURL: 'https://restful-booker.herokuapp.com',
  // Public demo credentials published in the Restful-Booker API docs.
  auth: { username: 'admin', password: 'password123' },
  booking: {
    firstname: 'Mihir',
    lastname: 'QA',
    totalprice: 250,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
  },
};

module.exports = { validUser, messages, invalidLogins, products, priceFilter, checkout, restfulBooker };
