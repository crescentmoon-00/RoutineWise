import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  extractToken,
  setTokenCookie,
  clearTokenCookie,
} from '../auth';
import { Response } from 'express';

// Mock console.error to keep test output clean
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Auth Utils', () => {
  const mockResponse = () => {
    const res: Partial<Response> = {
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    return res;
  };

  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(20);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword456!';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it('should return false for empty password', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword('', hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
      };

      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include payload in token', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
      };

      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
      };

      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyToken(invalidToken)).toThrow('Invalid or expired token');
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt';

      expect(() => verifyToken(malformedToken)).toThrow('Invalid or expired token');
    });

    it('should throw error for expired token', () => {
      // Create an expired token by using a very short expiration
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { userId: '123', email: 'test@example.com' },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
        { expiresIn: '-1h' }
      );

      expect(() => verifyToken(expiredToken)).toThrow('Invalid or expired token');
    });
  });

  describe('setTokenCookie', () => {
    it('should set token as httpOnly cookie', () => {
      const res = mockResponse() as Response;
      const token = 'test-token';

      setTokenCookie(res, token);

      expect(res.cookie).toHaveBeenCalledWith('token', token, {
        httpOnly: true,
        secure: false, // NODE_ENV is not 'production' in tests
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    });
  });

  describe('clearTokenCookie', () => {
    it('should clear token cookie', () => {
      const res = mockResponse() as Response;

      clearTokenCookie(res);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
    });
  });

  describe('extractToken', () => {
    it('should extract token from Authorization header', () => {
      const req = {
        headers: {
          authorization: 'Bearer test-token-123',
        },
        cookies: {},
      };

      const token = extractToken(req);
      expect(token).toBe('test-token-123');
    });

    it('should extract token from cookie if no header', () => {
      const req = {
        headers: {},
        cookies: {
          token: 'cookie-token-456',
        },
      };

      const token = extractToken(req);
      expect(token).toBe('cookie-token-456');
    });

    it('should prioritize header over cookie', () => {
      const req = {
        headers: {
          authorization: 'Bearer header-token',
        },
        cookies: {
          token: 'cookie-token',
        },
      };

      const token = extractToken(req);
      expect(token).toBe('header-token');
    });

    it('should return null if no token found', () => {
      const req = {
        headers: {},
        cookies: {},
      };

      const token = extractToken(req);
      expect(token).toBeNull();
    });

    it('should return null for malformed Authorization header', () => {
      const req = {
        headers: {
          authorization: 'InvalidFormat token',
        },
        cookies: {},
      };

      const token = extractToken(req);
      expect(token).toBeNull();
    });
  });
});
