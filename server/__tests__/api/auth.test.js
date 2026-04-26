import { jest } from '@jest/globals';

jest.unstable_mockModule('../../lib/prisma.js', () => ({
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(),
    verify: jest.fn(),
  },
  sign: jest.fn(),
  verify: jest.fn(),
}));

const { registerUser, loginUser, logoutUser, authMiddleware } = await import('../../controllers/auth/auth-controller.js');
const { default: prisma } = await import('../../lib/prisma.js');
const { default: bcrypt } = await import('bcryptjs');
const { default: jwt } = await import('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, cookies: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    test('should register a new user successfully', async () => {
      req.body = { userName: 'test', email: 'test@test.com', password: 'password123' };
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue({ id: '1', email: req.body.email });

      await registerUser(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Registration successful' });
    });

    test('should fail if user already exists', async () => {
      req.body = { userName: 'test', email: 'test@test.com', password: 'password123' };
      prisma.user.findUnique.mockResolvedValue({ id: '1' });

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User Already exists with the same email! Please try again' });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    test('should handle database error during registration', async () => {
      req.body = { userName: 'test', email: 'test@test.com', password: 'password123' };
      prisma.user.findUnique.mockRejectedValue(new Error('DB Error'));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Some error occured' });
    });
  });

  describe('loginUser', () => {
    test('should login user successfully', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com', role: 'user', userName: 'test', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      await loginUser(req, res);

      expect(res.cookie).toHaveBeenCalledWith('token', 'mockToken', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged in successfully',
        user: { email: 'test@test.com', role: 'user', id: '1', userName: 'test' },
      });
    });

    test('should fail if user does not exist', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      prisma.user.findUnique.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: false, message: "User doesn't exists! Please register first" });
    });

    test('should fail if password is incorrect', async () => {
      req.body = { email: 'test@test.com', password: 'wrong' };
      prisma.user.findUnique.mockResolvedValue({ id: '1', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Incorrect password! Please try again' });
    });

    test('should handle database error during login', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      prisma.user.findUnique.mockRejectedValue(new Error('DB Error'));

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Some error occured' });
    });
  });

  describe('logoutUser', () => {
    test('should clear cookie and logout successfully', () => {
      logoutUser(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Logged out successfully!' });
    });
  });

  describe('authMiddleware', () => {
    test('should call next if token is valid', async () => {
      req.cookies.token = 'validToken';
      jwt.verify.mockReturnValue({ id: '1', role: 'user' });

      await authMiddleware(req, res, next);

      expect(req.user).toEqual({ id: '1', role: 'user' });
      expect(next).toHaveBeenCalled();
    });

    test('should return 401 if no token is provided', async () => {
      req.cookies.token = undefined;

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unauthorised user!' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if token is invalid', async () => {
      req.cookies.token = 'invalidToken';
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unauthorised user!' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
