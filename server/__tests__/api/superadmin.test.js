import { jest } from '@jest/globals';

jest.unstable_mockModule('../../lib/prisma.js', () => ({
  default: {
    user: {
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    order: {
      count: jest.fn(),
    },
    product: {
      count: jest.fn(),
    },
  },
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn(),
  },
  hash: jest.fn(),
}));

const { getAllUsers, updateUserRole, deleteUser, createAdmin, getSuperadminStats } = await import('../../controllers/superadmin/superadmin-controller.js');
const { default: prisma } = await import('../../lib/prisma.js');
const { default: bcrypt } = await import('bcryptjs');

describe('Superadmin Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: { id: 'superadmin-1' } };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    test('should return all users successfully', async () => {
      const mockUsers = [{ id: '1', userName: 'test' }];
      prisma.user.findMany.mockResolvedValue(mockUsers);

      await getAllUsers(req, res);

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUsers });
    });

    test('should handle database errors', async () => {
      prisma.user.findMany.mockRejectedValue(new Error('DB Error'));

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Server error' });
    });
  });

  describe('updateUserRole', () => {
    test('should update user role successfully', async () => {
      req.params.id = 'user-2';
      req.body.role = 'admin';
      const updatedUser = { id: 'user-2', role: 'admin' };
      prisma.user.update.mockResolvedValue(updatedUser);

      await updateUserRole(req, res);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-2' },
        data: { role: 'admin' },
        select: { id: true, userName: true, email: true, role: true },
      });
      expect(res.json).toHaveBeenCalledWith({ success: true, data: updatedUser, message: 'Role updated to admin' });
    });

    test('should fail for invalid role', async () => {
      req.params.id = 'user-2';
      req.body.role = 'invalid-role';

      await updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid role' });
    });

    test('should prevent superadmin from demoting themselves', async () => {
      req.params.id = 'superadmin-1';
      req.body.role = 'user';

      await updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'You cannot change your own superadmin role' });
    });
  });

  describe('deleteUser', () => {
    test('should delete user successfully', async () => {
      req.params.id = 'user-2';

      await deleteUser(req, res);

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-2' } });
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'User deleted successfully' });
    });

    test('should prevent self deletion', async () => {
      req.params.id = 'superadmin-1';

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'You cannot delete your own account' });
    });

    test('should handle database errors', async () => {
      req.params.id = 'user-2';
      prisma.user.delete.mockRejectedValue(new Error('DB Error'));

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createAdmin', () => {
    test('should create a new admin successfully', async () => {
      req.body = { userName: 'admin', email: 'admin@test.com', password: 'password123' };
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      const newAdmin = { id: '2', role: 'admin' };
      prisma.user.create.mockResolvedValue(newAdmin);

      await createAdmin(req, res);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: newAdmin, message: 'Admin created successfully' });
    });

    test('should fail if required fields are missing', async () => {
      req.body = { userName: 'admin' };

      await createAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'All fields are required' });
    });

    test('should fail if email already exists', async () => {
      req.body = { userName: 'admin', email: 'admin@test.com', password: 'password123' };
      prisma.user.findUnique.mockResolvedValue({ id: '1' });

      await createAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'A user with this email already exists' });
    });
  });

  describe('getSuperadminStats', () => {
    test('should return all dashboard stats successfully', async () => {
      prisma.user.count.mockResolvedValueOnce(10).mockResolvedValueOnce(2);
      prisma.order.count.mockResolvedValue(50);
      prisma.product.count.mockResolvedValue(100);
      const mockRecentUsers = [{ id: '1' }, { id: '2' }];
      prisma.user.findMany.mockResolvedValue(mockRecentUsers);

      await getSuperadminStats(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          totalUsers: 10,
          totalAdmins: 2,
          totalOrders: 50,
          totalProducts: 100,
          recentUsers: mockRecentUsers,
        },
      });
    });

    test('should handle database errors', async () => {
      prisma.user.count.mockRejectedValue(new Error('DB Error'));

      await getSuperadminStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
