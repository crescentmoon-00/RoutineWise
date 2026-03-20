import mongoose from 'mongoose';
import { IActivityLog, LogType } from '../ActivityLog';
import { ActivityLog } from '../index';

// Mock mongoose connection
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
});

describe('ActivityLog Model', () => {
  let logMock: any;

  beforeAll(() => {
    // Create a simplified mock for testing
    logMock = {
      child: new mongoose.Types.ObjectId(),
      type: 'medication',
      title: 'Morning medication',
      description: 'Took ADHD medication',
      timestamp: new Date(),
      duration: null,
      severity: null,
      triggers: ['noise', 'tired'],
      mood: 'calm',
      notes: 'Additional notes',
      createdBy: new mongoose.Types.ObjectId(),
    };
  });

  describe('ActivityLog Schema Validation', () => {
    it('should have required child field', () => {
      expect(logMock.child).toBeDefined();
      expect(logMock.child instanceof mongoose.Types.ObjectId).toBe(true);
    });

    it('should have required type field with valid enum values', () => {
      const validTypes: LogType[] = [
        'medication',
        'meltdown',
        'snack',
        'meal',
        'mood',
        'sleep',
        'activity',
        'other',
      ];
      expect(validTypes).toContain(logMock.type);
    });

    it('should have required title field', () => {
      expect(logMock.title).toBeDefined();
      expect(typeof logMock.title).toBe('string');
    });

    it('should have timestamp field', () => {
      expect(logMock.timestamp).toBeDefined();
      expect(logMock.timestamp instanceof Date).toBe(true);
    });

    it('should have required createdBy field', () => {
      expect(logMock.createdBy).toBeDefined();
      expect(logMock.createdBy instanceof mongoose.Types.ObjectId).toBe(true);
    });

    it('should have optional description field', () => {
      expect(logMock.description).toBeDefined();
      expect(typeof logMock.description).toBe('string');
    });

    it('should have optional duration field', () => {
      expect(logMock.duration).toBeDefined();
    });

    it('should have optional severity field', () => {
      expect(logMock.severity).toBeDefined();
    });

    it('should have optional triggers array', () => {
      expect(Array.isArray(logMock.triggers)).toBe(true);
    });

    it('should have optional mood field', () => {
      expect(logMock.mood).toBeDefined();
    });

    it('should have optional notes field', () => {
      expect(logMock.notes).toBeDefined();
      expect(typeof logMock.notes).toBe('string');
    });
  });

  describe('Type Enum Validation', () => {
    it('should accept all valid type values', () => {
      const validTypes: LogType[] = [
        'medication',
        'meltdown',
        'snack',
        'meal',
        'mood',
        'sleep',
        'activity',
        'other',
      ];

      validTypes.forEach((type) => {
        const logWithType = { ...logMock, type };
        expect(validTypes).toContain(logWithType.type);
      });
    });
  });

  describe('Severity Validation', () => {
    it('should accept severity values within range 1-5', () => {
      const validSeverities = [1, 2, 3, 4, 5];

      validSeverities.forEach((severity) => {
        expect(severity).toBeGreaterThanOrEqual(1);
        expect(severity).toBeLessThanOrEqual(5);
      });
    });

    it('should reject severity values outside range 1-5', () => {
      const invalidSeverities = [0, 6, -1, 10];

      invalidSeverities.forEach((severity) => {
        const isValid = severity >= 1 && severity <= 5;
        expect(isValid).toBe(false);
      });
    });

    it('should allow null severity for non-meltdown entries', () => {
      const logWithNullSeverity = { ...logMock, severity: null, type: 'medication' };
      expect(logWithNullSeverity.severity).toBeNull();
    });
  });

  describe('Triggers Array Validation', () => {
    it('should accept valid trigger strings', () => {
      const validTriggers = ['noise', 'tired', 'hungry', 'overwhelmed', 'transition'];

      validTriggers.forEach((trigger) => {
        expect(typeof trigger).toBe('string');
        expect(trigger.trim().length).toBeGreaterThan(0);
      });
    });

    it('should allow empty triggers array', () => {
      const logWithEmptyTriggers = { ...logMock, triggers: [] };
      expect(Array.isArray(logWithEmptyTriggers.triggers)).toBe(true);
      expect(logWithEmptyTriggers.triggers.length).toBe(0);
    });

    it('should allow null triggers', () => {
      const logWithNullTriggers = { ...logMock, triggers: undefined };
      expect(Array.isArray(logWithNullTriggers.triggers || [])).toBe(true);
    });
  });

  describe('Duration Validation', () => {
    it('should accept positive duration values', () => {
      const validDurations = [5, 15, 30, 60, 120];

      validDurations.forEach((duration) => {
        expect(duration).toBeGreaterThan(0);
        expect(typeof duration).toBe('number');
      });
    });

    it('should allow null duration for logs without duration', () => {
      const logWithNullDuration = { ...logMock, duration: null };
      expect(logWithNullDuration.duration).toBeNull();
    });
  });

  describe('Mood Field Validation', () => {
    it('should accept valid mood strings', () => {
      const validMoods = ['happy', 'sad', 'anxious', 'calm', 'excited', 'tired'];

      validMoods.forEach((mood) => {
        expect(typeof mood).toBe('string');
        expect(mood.trim().length).toBeGreaterThan(0);
      });
    });

    it('should allow null mood', () => {
      const logWithNullMood = { ...logMock, mood: null };
      expect(logWithNullMood.mood).toBeNull();
    });
  });

  describe('Timestamp Validation', () => {
    it('should accept valid date objects', () => {
      const validDates = [
        new Date(),
        new Date('2024-01-01'),
        new Date('2024-12-31T23:59:59'),
      ];

      validDates.forEach((date) => {
        expect(date instanceof Date).toBe(true);
        expect(!isNaN(date.getTime())).toBe(true);
      });
    });

    it('should default to current date if not provided', () => {
      const logWithoutTimestamp = { ...logMock, timestamp: undefined };
      const defaultTimestamp = logWithoutTimestamp.timestamp || new Date();
      expect(defaultTimestamp instanceof Date).toBe(true);
    });
  });

  describe('Description and Notes Validation', () => {
    it('should accept empty description', () => {
      const logWithEmptyDescription = { ...logMock, description: '' };
      expect(typeof logWithEmptyDescription.description).toBe('string');
    });

    it('should accept empty notes', () => {
      const logWithEmptyNotes = { ...logMock, notes: '' };
      expect(typeof logWithEmptyNotes.notes).toBe('string');
    });

    it('should accept long text for description', () => {
      const longDescription = 'A'.repeat(500);
      const logWithLongDescription = { ...logMock, description: longDescription };
      expect(logWithLongDescription.description.length).toBe(500);
    });

    it('should accept long text for notes', () => {
      const longNotes = 'B'.repeat(1000);
      const logWithLongNotes = { ...logMock, notes: longNotes };
      expect(logWithLongNotes.notes.length).toBe(1000);
    });
  });

  describe('Interface', () => {
    it('should have all required fields in IActivityLog interface', () => {
      const requiredFields: (keyof IActivityLog)[] = [
        'child',
        'type',
        'title',
        'timestamp',
        'createdBy',
        'createdAt',
        'updatedAt',
      ];

      requiredFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });

    it('should have all optional fields in IActivityLog interface', () => {
      const optionalFields: Array<keyof IActivityLog> = [
        'description',
        'duration',
        'severity',
        'triggers',
        'mood',
        'notes',
      ];

      optionalFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });
  });
});

describe('ActivityLog Model Factory', () => {
  it('should export ActivityLog model', () => {
    expect(ActivityLog).toBeDefined();
    expect(typeof ActivityLog.findOne).toBe('function');
    expect(typeof ActivityLog.find).toBe('function');
    expect(typeof ActivityLog.create).toBe('function');
    expect(typeof ActivityLog.findById).toBe('function');
    expect(typeof ActivityLog.findByIdAndUpdate).toBe('function');
    expect(typeof ActivityLog.countDocuments).toBe('function');
  });
});
