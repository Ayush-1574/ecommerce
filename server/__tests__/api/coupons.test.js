import { jest } from '@jest/globals';

jest.unstable_mockModule('../../lib/prisma.js', () => ({
  default: {
    coupon: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const { createCoupon, fetchAllCoupons, editCoupon, deleteCoupon } = await import('../../controllers/admin/coupon-controller.js');
const { default: prisma } = await import('../../lib/prisma.js');

describe('Admin Coupons Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('createCoupon', () => {
    test('should create a new coupon successfully', async () => {
      req.body = { code: 'SAVE10', discountValue: 10 };
      prisma.coupon.findUnique.mockResolvedValue(null);
      prisma.coupon.create.mockResolvedValue({ id: 'c1', ...req.body });

      await createCoupon(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(prisma.coupon.create).toHaveBeenCalled();
    });

    test('should fail if coupon code already exists', async () => {
      req.body = { code: 'SAVE10' };
      prisma.coupon.findUnique.mockResolvedValue({ id: 'c1', code: 'SAVE10' });

      await createCoupon(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Coupon code already exists"
      }));
    });
  });

  describe('fetchAllCoupons', () => {
    test('should fetch all coupons', async () => {
      prisma.coupon.findMany.mockResolvedValue([{ code: 'C1' }]);

      await fetchAllCoupons(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(action => action.payload.data).toBeDefined;
    });
  });

  describe('deleteCoupon', () => {
    test('should delete existing coupon', async () => {
      req.params.id = 'c1';
      prisma.coupon.findUnique.mockResolvedValue({ id: 'c1' });
      prisma.coupon.delete.mockResolvedValue({});

      await deleteCoupon(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(prisma.coupon.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
    });
  });
});
