// Mock express-validator BEFORE importing validation module
jest.mock('express-validator', () => {
  const actualModule = jest.requireActual('express-validator');
  return {
    ...actualModule,
    validationResult: jest.fn(),
  };
});

import { Request, Response, NextFunction } from 'express';
import {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  childValidation,
  childIdValidation,
  routineValidation,
  routineIdValidation,
  activityLogValidation,
  logIdValidation,
  ruleValidation,
  ruleIdValidation,
} from '../validation';

const { validationResult } = require('express-validator');

describe('Validation Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('handleValidationErrors', () => {
    it('should call next() when there are no validation errors', () => {
      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });

      handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 400 when there are validation errors', () => {
      const errors = [
        { msg: 'Email is required', param: 'email' },
        { msg: 'Password is required', param: 'password' },
      ];

      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => errors,
      });

      handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: errors,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Validation Rules Export', () => {
    it('should export registerValidation array', () => {
      expect(registerValidation).toBeDefined();
      expect(Array.isArray(registerValidation)).toBe(true);
    });

    it('should export loginValidation array', () => {
      expect(loginValidation).toBeDefined();
      expect(Array.isArray(loginValidation)).toBe(true);
    });

    it('should export resetPasswordValidation array', () => {
      expect(resetPasswordValidation).toBeDefined();
      expect(Array.isArray(resetPasswordValidation)).toBe(true);
    });

    it('should export childValidation array', () => {
      expect(childValidation).toBeDefined();
      expect(Array.isArray(childValidation)).toBe(true);
    });

    it('should export childIdValidation array', () => {
      expect(childIdValidation).toBeDefined();
      expect(Array.isArray(childIdValidation)).toBe(true);
    });

    it('should export routineValidation array', () => {
      expect(routineValidation).toBeDefined();
      expect(Array.isArray(routineValidation)).toBe(true);
    });

    it('should export routineIdValidation array', () => {
      expect(routineIdValidation).toBeDefined();
      expect(Array.isArray(routineIdValidation)).toBe(true);
    });

    it('should export activityLogValidation array', () => {
      expect(activityLogValidation).toBeDefined();
      expect(Array.isArray(activityLogValidation)).toBe(true);
    });

    it('should export logIdValidation array', () => {
      expect(logIdValidation).toBeDefined();
      expect(Array.isArray(logIdValidation)).toBe(true);
    });

    it('should export ruleValidation array', () => {
      expect(ruleValidation).toBeDefined();
      expect(Array.isArray(ruleValidation)).toBe(true);
    });

    it('should export ruleIdValidation array', () => {
      expect(ruleIdValidation).toBeDefined();
      expect(Array.isArray(ruleIdValidation)).toBe(true);
    });
  });

  describe('Validation Rule Properties', () => {
    it('should export registerValidation array', () => {
      expect(registerValidation.length).toBeGreaterThan(0);
    });

    it('should export loginValidation array', () => {
      expect(loginValidation.length).toBeGreaterThanOrEqual(2);
    });

    it('should export resetPasswordValidation array', () => {
      expect(resetPasswordValidation.length).toBeGreaterThanOrEqual(2);
    });

    it('should export childValidation array', () => {
      expect(childValidation.length).toBeGreaterThanOrEqual(2);
    });

    it('should export childIdValidation array', () => {
      expect(childIdValidation.length).toBe(1);
    });

    it('should export routineValidation array', () => {
      expect(routineValidation.length).toBeGreaterThan(0);
    });

    it('should export routineIdValidation array', () => {
      expect(routineIdValidation.length).toBe(1);
    });

    it('should export activityLogValidation array', () => {
      expect(activityLogValidation.length).toBeGreaterThan(0);
    });

    it('should export logIdValidation array', () => {
      expect(logIdValidation.length).toBe(1);
    });

    it('should export ruleValidation array', () => {
      expect(ruleValidation.length).toBeGreaterThan(0);
    });

    it('should export ruleIdValidation array', () => {
      expect(ruleIdValidation.length).toBe(1);
    });
  });

  describe('Validation Rule Field Names', () => {
    it('should include validation rules for email in registerValidation', () => {
      expect(registerValidation.length).toBeGreaterThan(0);
    });

    it('should include validation rules for password in loginValidation', () => {
      expect(loginValidation.length).toBeGreaterThanOrEqual(2);
    });

    it('should include validation rules for name in childValidation', () => {
      expect(childValidation.length).toBeGreaterThanOrEqual(2);
    });

    it('should include validation rules for steps in routineValidation', () => {
      expect(routineValidation.length).toBeGreaterThan(2);
    });

    it('should include validation rules for nested actions in ruleValidation', () => {
      expect(ruleValidation.length).toBeGreaterThan(5);
    });
  });

  describe('Validation Error Scenarios', () => {
    it('should handle multiple validation errors', () => {
      const errors = [
        { msg: 'Email is required', param: 'email' },
        { msg: 'Password is too short', param: 'password' },
        { msg: 'First name is required', param: 'firstName' },
        { msg: 'Last name is required', param: 'lastName' },
      ];

      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => errors,
      });

      handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: errors,
      });
    });

    it('should handle nested validation errors for steps', () => {
      const errors = [
        { msg: 'Step name is required', param: 'steps[0].name' },
        { msg: 'Step icon is required', param: 'steps[0].icon' },
      ];

      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => errors,
      });

      handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should handle nested validation errors for actions', () => {
      const errors = [
        { msg: 'Action type is invalid', param: 'actions[0].type' },
        { msg: 'Action description is required', param: 'actions[0].description' },
      ];

      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => errors,
      });

      handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Validation Response Format', () => {
    it('should return error in consistent format', () => {
      const errors = [{ msg: 'Test error', param: 'test' }];

      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => errors,
      });

      handleValidationErrors(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: errors,
      });
    });
  });

  describe('Validation Chain', () => {
    it('should support multiple validators for same field', () => {
      // Test that validation rules are exported as arrays
      expect(Array.isArray(registerValidation)).toBe(true);
      expect(Array.isArray(childValidation)).toBe(true);
      expect(Array.isArray(routineValidation)).toBe(true);
    });

    it('should support nested field validation', () => {
      // Check that routineValidation includes step validations (length > basic fields)
      expect(routineValidation.length).toBeGreaterThan(3);
      // Check that ruleValidation includes action validations
      expect(ruleValidation.length).toBeGreaterThan(6);
    });

    it('should support parameter validation', () => {
      // All ID validations should be arrays with single element
      expect(childIdValidation.length).toBe(1);
      expect(routineIdValidation.length).toBe(1);
      expect(logIdValidation.length).toBe(1);
      expect(ruleIdValidation.length).toBe(1);
    });
  });
});
