import { login } from './auth';

test('valid login', () => {
  const res = login('admin', '1234');
  expect(res.success).toBe(true);
});

test('invalid login', () => {
  const res = login('admin', 'wrong');
  expect(res.success).toBe(false);
});