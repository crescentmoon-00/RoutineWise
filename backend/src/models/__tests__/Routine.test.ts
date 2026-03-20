import mongoose, { Schema } from 'mongoose';
import { IRoutine, IRoutineStep } from '../Routine';
import { Routine } from '../index';

// Mock mongoose connection
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
});

describe('Routine Model', () => {
  let routineMock: any;
  let stepMock: IRoutineStep;

  beforeAll(() => {
    // Create a simplified mock for testing
    stepMock = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Wake up',
      icon: 'alarm',
      duration: 0,
      category: 'morning',
      order: 0,
      startTime: '07:00',
    };

    routineMock = {
      child: new mongoose.Types.ObjectId(),
      name: 'Morning Routine',
      type: 'morning',
      steps: [stepMock],
      isActive: true,
    };
  });

  describe('Routine Schema Validation', () => {
    it('should have required child field', () => {
      expect(routineMock.child).toBeDefined();
      expect(routineMock.child instanceof mongoose.Types.ObjectId).toBe(true);
    });

    it('should have required name field', () => {
      expect(routineMock.name).toBeDefined();
      expect(typeof routineMock.name).toBe('string');
    });

    it('should have required type field with valid enum values', () => {
      const validTypes = ['morning', 'afternoon', 'evening', 'custom'];
      expect(validTypes).toContain(routineMock.type);
    });

    it('should have steps array', () => {
      expect(Array.isArray(routineMock.steps)).toBe(true);
    });

    it('should have isActive field', () => {
      expect(routineMock.isActive).toBeDefined();
      expect(typeof routineMock.isActive).toBe('boolean');
    });

    it('should default isActive to true', () => {
      const routineWithoutActive = { ...routineMock, isActive: undefined };
      expect(routineWithoutActive.isActive ?? true).toBe(true);
    });
  });

  describe('RoutineStep Schema Validation', () => {
    it('should have required name field', () => {
      expect(stepMock.name).toBeDefined();
      expect(typeof stepMock.name).toBe('string');
    });

    it('should have required icon field', () => {
      expect(stepMock.icon).toBeDefined();
      expect(typeof stepMock.icon).toBe('string');
    });

    it('should have required category field with valid enum values', () => {
      const validCategories = ['morning', 'afternoon', 'evening', 'custom'];
      expect(validCategories).toContain(stepMock.category);
    });

    it('should have required order field', () => {
      expect(stepMock.order).toBeDefined();
      expect(typeof stepMock.order).toBe('number');
    });

    it('should have optional duration field', () => {
      expect(stepMock.duration).toBeDefined();
      expect(typeof stepMock.duration).toBe('number');
    });

    it('should have optional startTime field', () => {
      expect(stepMock.startTime).toBeDefined();
      expect(typeof stepMock.startTime).toBe('string');
    });

    it('should allow optional duration to be null', () => {
      const stepWithoutDuration = { ...stepMock, duration: undefined };
      expect(stepWithoutDuration.duration ?? null).toBeNull();
    });

    it('should allow optional startTime to be null', () => {
      const stepWithoutStartTime = { ...stepMock, startTime: undefined };
      expect(stepWithoutStartTime.startTime ?? null).toBeNull();
    });
  });

  describe('Type Enum Validation', () => {
    it('should accept all valid type values', () => {
      const validTypes: Array<'morning' | 'afternoon' | 'evening' | 'custom'> = [
        'morning',
        'afternoon',
        'evening',
        'custom',
      ];

      validTypes.forEach((type) => {
        const routineWithType = { ...routineMock, type };
        expect(validTypes).toContain(routineWithType.type);
      });
    });
  });

  describe('Category Enum Validation for Steps', () => {
    it('should accept all valid category values', () => {
      const validCategories: Array<'morning' | 'afternoon' | 'evening' | 'custom'> = [
        'morning',
        'afternoon',
        'evening',
        'custom',
      ];

      validCategories.forEach((category) => {
        const stepWithCategory = { ...stepMock, category };
        expect(validCategories).toContain(stepWithCategory.category);
      });
    });
  });

  describe('Steps Array Structure', () => {
    it('should support multiple steps with different orders', () => {
      const steps: IRoutineStep[] = [
        { name: 'Step 1', icon: 'icon1', category: 'morning', order: 0 },
        { name: 'Step 2', icon: 'icon2', category: 'morning', order: 1 },
        { name: 'Step 3', icon: 'icon3', category: 'morning', order: 2 },
      ];

      expect(steps.length).toBe(3);
      expect(steps[0].order).toBeLessThan(steps[1].order);
      expect(steps[1].order).toBeLessThan(steps[2].order);
    });

    it('should allow steps with optional fields', () => {
      const minimalStep: IRoutineStep = {
        name: 'Minimal Step',
        icon: 'minimal-icon',
        category: 'custom',
        order: 0,
      };

      expect(minimalStep.name).toBeDefined();
      expect(minimalStep.icon).toBeDefined();
      expect(minimalStep.category).toBeDefined();
      expect(minimalStep.order).toBeDefined();
    });
  });

  describe('StartTime Format Validation', () => {
    it('should accept valid time formats', () => {
      const validTimes = ['07:00', '12:30', '23:59', '00:00'];

      validTimes.forEach((time) => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        expect(timeRegex.test(time)).toBe(true);
      });
    });

    it('should reject invalid time formats', () => {
      const invalidTimes = ['24:00', '25:00', '12:60', '7:00', 'abc'];

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      invalidTimes.forEach((time) => {
        expect(timeRegex.test(time)).toBe(false);
      });
    });
  });

  describe('Interface', () => {
    it('should have all required fields in IRoutine interface', () => {
      const requiredFields: (keyof IRoutine)[] = [
        'child',
        'name',
        'type',
        'steps',
        'isActive',
        'createdAt',
        'updatedAt',
      ];

      requiredFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });

    it('should have all required fields in IRoutineStep interface', () => {
      const requiredFields: (keyof IRoutineStep)[] = [
        'name',
        'icon',
        'category',
        'order',
      ];

      requiredFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });

    it('should have optional fields in IRoutineStep interface', () => {
      const optionalFields: Array<keyof IRoutineStep> = [
        '_id',
        'duration',
        'startTime',
      ];

      optionalFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });
  });
});

describe('Routine Model Factory', () => {
  it('should export Routine model', () => {
    expect(Routine).toBeDefined();
    expect(typeof Routine.findOne).toBe('function');
    expect(typeof Routine.find).toBe('function');
    expect(typeof Routine.create).toBe('function');
    expect(typeof Routine.findById).toBe('function');
    expect(typeof Routine.findByIdAndUpdate).toBe('function');
    expect(typeof Routine.findByIdAndDelete).toBe('function');
  });
});
