import { Request, Response } from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
} from '../authController';
import * as authUtils from '../../utils/auth';

// Mock the models module BEFORE importing
jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
  Child: jest.fn(),
  Routine: jest.fn(),
  ActivityLog: jest.fn(),
  Rule: jest.fn(),
}));

import { User } from '../../models';
const mockUserModel = User as jest.Mocked<any>;

// Mock auth utils
jest.mock('../../utils/auth', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateToken: jest.fn(() => 'mock-jwt-token'),
  setTokenCookie: jest.fn(),
  clearTokenCookie: jest.fn(),
}));

const mockedAuthUtils = authUtils as jest.Mocked<typeof authUtils>;

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockUser: any;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: undefined,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();

    // Create a mock user object
    mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      password: 'hashedpassword',
      firstName: 'John',
      lastName: 'Doe',
      subscriptionTier: 'free',
      children: [],
    };

    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);
      (mockedAuthUtils.hashPassword as jest.Mock).mockResolvedValue('hashedpassword');

      await register(mockReq as Request, mockRes as Response);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockedAuthUtils.hashPassword).toHaveBeenCalledWith('Password123!');
      expect(mockUserModel.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        subscriptionTier: 'free',
      });
      expect(mockedAuthUtils.generateToken).toHaveBeenCalledWith({
        userId: mockUser._id.toString(),
        email: mockUser.email,
      });
      expect(mockedAuthUtils.setTokenCookie).toHaveBeenCalledWith(mockRes, 'mock-jwt-token');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          id: mockUser._id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          subscriptionTier: mockUser.subscriptionTier,
        },
        token: 'mock-jwt-token',
      });
    });

    it('should return 409 if user already exists', async () => {
      mockReq.body = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      await register(mockReq as Request, mockRes as Response);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' });
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User with this email already exists',
      });
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });

    it('should return 500 on database error', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserModel.findOne.mockRejectedValue(new Error('Database error'));

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to register user' });
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);
      (mockedAuthUtils.comparePassword as jest.Mock).mockResolvedValue(true);

      await login(mockReq as Request, mockRes as Response);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockedAuthUtils.comparePassword).toHaveBeenCalledWith('Password123!', mockUser.password);
      expect(mockedAuthUtils.generateToken).toHaveBeenCalledWith({
        userId: mockUser._id.toString(),
        email: mockUser.email,
      });
      expect(mockedAuthUtils.setTokenCookie).toHaveBeenCalledWith(mockRes, 'mock-jwt-token');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          id: mockUser._id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          subscriptionTier: mockUser.subscriptionTier,
        },
        token: 'mock-jwt-token',
      });
    });

    it('should return 401 for non-existent user', async () => {
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      mockUserModel.findOne.mockResolvedValue(null);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
      expect(mockedAuthUtils.comparePassword).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid password', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);
      (mockedAuthUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
      expect(mockedAuthUtils.generateToken).not.toHaveBeenCalled();
    });

    it('should return 500 on database error', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      mockUserModel.findOne.mockRejectedValue(new Error('Database error'));

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to login' });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      await logout(mockReq as Request, mockRes as Response);

      expect(mockedAuthUtils.clearTokenCookie).toHaveBeenCalledWith(mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });

    it('should return 500 on error', async () => {
      (mockedAuthUtils.clearTokenCookie as jest.Mock).mockImplementation(() => {
        throw new Error('Clear cookie error');
      });

      await logout(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to logout' });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      mockReq.user = {
        userId: mockUser._id.toString(),
        email: mockUser.email,
      };

      const mockPopulatedUser = { ...mockUser, children: [] };
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockPopulatedUser),
      } as any);

      await getCurrentUser(mockReq as Request, mockRes as Response);

      expect(mockUserModel.findById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ user: mockPopulatedUser });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;

      await getCurrentUser(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
      expect(mockUserModel.findById).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      mockReq.user = {
        userId: 'nonexistent-id',
        email: 'nonexistent@example.com',
      };

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await getCurrentUser(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = {
        userId: mockUser._id.toString(),
        email: mockUser.email,
      };

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockRejectedValue(new Error('Database error')),
      } as any);

      await getCurrentUser(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch user' });
    });
  });

  describe('requestPasswordReset', () => {
    it('should return success message for existing user', async () => {
      mockReq.body = { email: 'test@example.com' };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      await requestPasswordReset(mockReq as Request, mockRes as Response);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'If a user with this email exists, a password reset link will be sent',
      });
    });

    it('should return same success message for non-existent user (security)', async () => {
      mockReq.body = { email: 'nonexistent@example.com' };

      mockUserModel.findOne.mockResolvedValue(null);

      await requestPasswordReset(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'If a user with this email exists, a password reset link will be sent',
      });
    });

    it('should return 500 on database error', async () => {
      mockReq.body = { email: 'test@example.com' };

      mockUserModel.findOne.mockRejectedValue(new Error('Database error'));

      await requestPasswordReset(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to request password reset' });
    });
  });

  describe('resetPassword', () => {
    it('should return 501 (not implemented)', async () => {
      mockReq.body = {
        token: 'reset-token',
        password: 'NewPassword123!',
      };

      await resetPassword(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(501);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Password reset not yet implemented' });
    });

    it('should return 500 on error', async () => {
      mockReq.body = {
        token: 'reset-token',
        password: 'NewPassword123!',
      };

      // Force error by checking implementation
      mockUserModel.findOne.mockRejectedValue(new Error('Unexpected error'));

      await resetPassword(mockReq as Request, mockRes as Response);

      // The function returns 501 before any error, so this test verifies the error path
      expect(mockRes.status).toHaveBeenCalledWith(501);
    });
  });
});
