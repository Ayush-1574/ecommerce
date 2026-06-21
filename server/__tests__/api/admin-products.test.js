import { jest } from '@jest/globals';

jest.unstable_mockModule('../../lib/prisma.js', () => ({
  default: {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const { addProduct, fetchAllProducts, editProduct, deleteProduct } = await import('../../controllers/admin/products-controller.js');
const { default: prisma } = await import('../../lib/prisma.js');

describe('Admin Products Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: { id: 'admin-1', role: 'admin' } };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    test('should create a product with current adminId', async () => {
      req.body = { title: 'Test Product', price: '100' };
      const mockProduct = { id: 'p1', title: 'Test Product', adminId: 'admin-1' };
      prisma.product.create.mockResolvedValue(mockProduct);

      await addProduct(req, res);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Test Product',
          adminId: 'admin-1',
        }),
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('fetchAllProducts', () => {
    test('should filter products by adminId for admin role', async () => {
      req.user = { id: 'admin-1', role: 'admin' };
      prisma.product.findMany.mockResolvedValue([]);

      await fetchAllProducts(req, res);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { adminId: 'admin-1' },
      });
    });

    test('should NOT filter products by adminId for superadmin role', async () => {
      req.user = { id: 'super-1', role: 'superadmin' };
      prisma.product.findMany.mockResolvedValue([]);

      await fetchAllProducts(req, res);

      expect(prisma.product.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('editProduct', () => {
    test('should allow admin to edit their own product', async () => {
      req.params.id = 'p1';
      req.user = { id: 'admin-1', role: 'admin' };
      const mockProduct = { id: 'p1', adminId: 'admin-1' };
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.product.update.mockResolvedValue(mockProduct);

      await editProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(prisma.product.update).toHaveBeenCalled();
    });

    test('should block admin from editing others products', async () => {
      req.params.id = 'p1';
      req.user = { id: 'admin-2', role: 'admin' };
      const mockProduct = { id: 'p1', adminId: 'admin-1' };
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      await editProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "You are not authorized to edit this product"
      }));
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });
});
