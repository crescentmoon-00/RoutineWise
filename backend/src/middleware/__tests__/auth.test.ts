import { Request, Response, NextFunction } from 'express';
import { auth, optionalAuth } from '../auth';
import { generateToken } from '../../utils/auth';

// Mock the auth utils
jest.mock('../../utils/auth', () => ({
  extractToken: jest.fn(),
  verifyToken: jest.fn(),
  generateToken: (payload: any) => `mock-token-${payload.userId}`,
}));

const { extractToken, verifyToken } = require('../../utils/auth');

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('auth middleware', () => {
    it('should call next() with valid token', () => {
      const mockPayload = { userId: '123', email: 'test@example.com' };
      const token = 'valid-token';

      (extractToken as jest.Mock).mockReturnValue(token);
      (verifyToken as jest.Mock).mockReturnValue(mockPayload);

      auth(mockReq as Request, mockRes as Response, mockNext);

      expect(extractToken).toHaveBeenCalledWith(mockReq);
      expect(verifyToken).toHaveBeenCalledWith(token);
      expect(mockReq.user).toEqual({
        userId: mockPayload.userId,
        email: mockPayload.email,
      });
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 401 if no token found', () => {
      (extractToken as jest.Mock).mockReturnValue(null);

      auth(mockReq as Request, mockRes as Response, mockNext);

      expect(extractToken).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Authentication required' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      const token = 'invalid-token';

      (extractToken as jest.Mock).mockReturnValue(token);
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      auth(mockReq as Request, mockRes as Response, mockNext);

      expect(extractToken).toHaveBeenCalledWith(mockReq);
      expect(verifyToken).toHaveBeenCalledWith(token);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is expired', () => {
      const token = 'expired-token';

      (extractToken as jest.Mock).mockReturnValue(token);
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token expired');
      });

      auth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth middleware', () => {
    it('should call next() with user data when valid token provided', () => {
      const mockPayload = { userId: '123', email: 'test@example.com' };
      const token = 'valid-token';

      (extractToken as jest.Mock).mockReturnValue(token);
      (verifyToken as jest.Mock).mockReturnValue(mockPayload);

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(extractToken).toHaveBeenCalledWith(mockReq);
      expect(verifyToken).toHaveBeenCalledWith(token);
      expect(mockReq.user).toEqual({
        userId: mockPayload.userId,
        email: mockPayload.email,
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() without user data when no token provided', () => {
      (extractToken as jest.Mock).mockReturnValue(null);

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(extractToken).toHaveBeenCalledWith(mockReq);
      expect(verifyToken).not.toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() without user data when token is invalid', () => {
      const token = 'invalid-token';

      (extractToken as jest.Mock).mockReturnValue(token);
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(extractToken).toHaveBeenCalledWith(mockReq);
      expect(verifyToken).toHaveBeenCalledWith(token);
      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should call next() without user data when token is expired', () => {
      const token = 'expired-token';

      (extractToken as jest.Mock).mockReturnValue(token);
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token expired');
      });

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
