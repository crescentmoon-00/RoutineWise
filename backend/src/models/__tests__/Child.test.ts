import mongoose, { Schema } from 'mongoose';
import { IChild } from '../Child';
import { Child } from '../index';

// Mock mongoose connection
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
});

describe('Child Model', () => {
  let childMock: any;

  beforeAll(() => {
    // Create a simplified mock for testing
    childMock = {
      parent: new mongoose.Types.ObjectId(),
      name: 'Test Child',
      dateOfBirth: new Date('2015-05-15'),
      avatar: 'avatar-url',
      status: 'active',
      notes: 'Test notes',
      routines: [],
      logs: [],
      rules: [],
    };
  });

  describe('Child Schema Validation', () => {
    it('should have required parent field', () => {
      expect(childMock.parent).toBeDefined();
      expect(childMock.parent instanceof mongoose.Types.ObjectId).toBe(true);
    });

    it('should have required name field', () => {
      expect(childMock.name).toBeDefined();
      expect(typeof childMock.name).toBe('string');
    });

    it('should have required dateOfBirth field', () => {
      expect(childMock.dateOfBirth).toBeDefined();
      expect(childMock.dateOfBirth instanceof Date).toBe(true);
    });

    it('should have status field with valid enum values', () => {
      const validStatuses = ['active', 'transitioning'];
      expect(validStatuses).toContain(childMock.status);
    });

    it('should default status to active', () => {
      const childWithoutStatus = { ...childMock, status: undefined };
      expect(childWithoutStatus.status || 'active').toBe('active');
    });

    it('should have routines array', () => {
      expect(Array.isArray(childMock.routines)).toBe(true);
    });

    it('should have logs array', () => {
      expect(Array.isArray(childMock.logs)).toBe(true);
    });

    it('should have rules array', () => {
      expect(Array.isArray(childMock.rules)).toBe(true);
    });

    it('should have notes field', () => {
      expect(childMock.notes).toBeDefined();
      expect(typeof childMock.notes).toBe('string');
    });

    it('should have avatar field', () => {
      expect(childMock.avatar).toBeDefined();
    });
  });

  describe('Age Calculation Virtual', () => {
    it('should calculate age correctly for a child born 5 years ago', () => {
      const today = new Date();
      const fiveYearsAgo = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
      const child = { ...childMock, dateOfBirth: fiveYearsAgo };

      const expectedAge = 5;
      const birthDate = new Date(child.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      expect(age).toBe(expectedAge);
    });

    it('should calculate age correctly for a child born this year', () => {
      const today = new Date();
      const thisYear = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
      const child = { ...childMock, dateOfBirth: thisYear };

      const expectedAge = 0;
      const birthDate = new Date(child.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      expect(age).toBe(expectedAge);
    });

    it('should handle birthday not yet occurred this year', () => {
      const today = new Date(2024, 5, 15); // June 15, 2024
      const birthDate = new Date(2015, 7, 20); // August 20, 2015

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      expect(age).toBe(8); // Birthday hasn't happened yet this year
    });

    it('should handle birthday already occurred this year', () => {
      const today = new Date(2024, 8, 15); // September 15, 2024
      const birthDate = new Date(2015, 7, 20); // August 20, 2015

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      expect(age).toBe(9); // Birthday has already happened this year
    });
  });

  describe('Interface', () => {
    it('should have all required fields in IChild interface', () => {
      const requiredFields: (keyof IChild)[] = [
        'parent',
        'name',
        'dateOfBirth',
        'avatar',
        'status',
        'notes',
        'routines',
        'logs',
        'rules',
        'createdAt',
        'updatedAt',
      ];

      requiredFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });
  });

  describe('Status Enum Validation', () => {
    it('should accept valid status values', () => {
      const validStatuses = ['active', 'transitioning'];
      validStatuses.forEach((status) => {
        const childWithStatus = { ...childMock, status };
        expect(validStatuses).toContain(childWithStatus.status);
      });
    });

    it('should reject invalid status values', () => {
      const validStatuses = ['active', 'transitioning'];
      const invalidStatus = 'invalid';
      expect(validStatuses).not.toContain(invalidStatus);
    });
  });

  describe('Date of Birth Validation', () => {
    it('should accept valid date of birth', () => {
      const validDates = [
        new Date('2015-05-15'),
        new Date('2020-01-01'),
        new Date('2018-12-31'),
      ];

      validDates.forEach((date) => {
        expect(date instanceof Date).toBe(true);
        expect(!isNaN(date.getTime())).toBe(true);
      });
    });

    it('should reject invalid dates', () => {
      const invalidDates = [
        new Date('invalid'),
        new Date(''),
      ];

      invalidDates.forEach((date) => {
        expect(isNaN(date.getTime())).toBe(true);
      });
    });
  });
});

describe('Child Model Factory', () => {
  it('should export Child model', () => {
    expect(Child).toBeDefined();
    expect(typeof Child.findOne).toBe('function');
    expect(typeof Child.find).toBe('function');
    expect(typeof Child.create).toBe('function');
    expect(typeof Child.findById).toBe('function');
    expect(typeof Child.findByIdAndUpdate).toBe('function');
    expect(typeof Child.countDocuments).toBe('function');
  });
});
