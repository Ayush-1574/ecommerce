import { addToCart, getCartTotal } from './cart';

test('adds new product to cart', () => {
  const cart = [];
  const product = { id: 1, price: 100 };

  const result = addToCart(cart, product);

  expect(result.length).toBe(1);
  expect(result[0].quantity).toBe(1);
});

test('increments quantity if product exists', () => {
  const cart = [{ id: 1, price: 100, quantity: 1 }];
  const product = { id: 1, price: 100 };

  const result = addToCart(cart, product);

  expect(result[0].quantity).toBe(2);
});

test('calculates total correctly', () => {
  const cart = [
    { id: 1, price: 100, quantity: 2 },
    { id: 2, price: 50, quantity: 1 }
  ];

  expect(getCartTotal(cart)).toBe(250);
});