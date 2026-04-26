import { describe, test, expect, jest } from '@jest/globals';
import { applyCoupon } from '../controllers/shop/coupon-controller.js';

// Mock response object
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Replace prisma methods for isolated testing if needed
// For now, we just test the shape of the controller

describe('Shop Coupon Controller', () => {
  test('returns 400 if no code is provided', async () => {
    const req = { body: { cartTotalAmount: 100 } };
    const res = mockRes();

    await applyCoupon(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Coupon code is required"
      })
    );
  });

  test('returns 400 if cart total is invalid', async () => {
    const req = { body: { code: 'SAVE10', cartTotalAmount: 'abc' } };
    const res = mockRes();

    await applyCoupon(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Invalid cart total amount"
      })
    );
  });
});
