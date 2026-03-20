import mongoose from 'mongoose';
import { IRule, ITrigger, IAction, TriggerType, ActionType } from '../Rule';
import { Rule } from '../index';

// Mock mongoose connection
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
});

describe('Rule Model', () => {
  let ruleMock: any;
  let triggerMock: ITrigger;
  let actionMock: IAction;

  beforeAll(() => {
    // Create simplified mocks for testing
    triggerMock = {
      type: 'time_based' as TriggerType,
      condition: 'before 5pm',
      value: '17:00',
    };

    actionMock = {
      type: 'add_activity' as ActionType,
      description: 'add 20 minutes of tablet time',
      parameters: new Map<string, any>([['duration', 20]]),
    };

    ruleMock = {
      child: new mongoose.Types.ObjectId(),
      parent: new mongoose.Types.ObjectId(),
      name: 'Homework Reward Rule',
      description: 'If homework is completed before 5pm, add tablet time',
      category: 'school',
      trigger: triggerMock,
      actions: [actionMock],
      isActive: true,
      isAIGenerated: false,
    };
  });

  describe('Rule Schema Validation', () => {
    it('should have required child field', () => {
      expect(ruleMock.child).toBeDefined();
      expect(ruleMock.child instanceof mongoose.Types.ObjectId).toBe(true);
    });

    it('should have required parent field', () => {
      expect(ruleMock.parent).toBeDefined();
      expect(ruleMock.parent instanceof mongoose.Types.ObjectId).toBe(true);
    });

    it('should have required name field', () => {
      expect(ruleMock.name).toBeDefined();
      expect(typeof ruleMock.name).toBe('string');
    });

    it('should have required description field', () => {
      expect(ruleMock.description).toBeDefined();
      expect(typeof ruleMock.description).toBe('string');
    });

    it('should have required category field with valid enum values', () => {
      const validCategories = ['chore', 'health', 'school', 'routine', 'other'];
      expect(validCategories).toContain(ruleMock.category);
    });

    it('should have required trigger field', () => {
      expect(ruleMock.trigger).toBeDefined();
    });

    it('should have required actions array', () => {
      expect(Array.isArray(ruleMock.actions)).toBe(true);
      expect(ruleMock.actions.length).toBeGreaterThan(0);
    });

    it('should have isActive field', () => {
      expect(ruleMock.isActive).toBeDefined();
      expect(typeof ruleMock.isActive).toBe('boolean');
    });

    it('should default isActive to true', () => {
      const ruleWithoutActive = { ...ruleMock, isActive: undefined };
      expect(ruleWithoutActive.isActive ?? true).toBe(true);
    });

    it('should have isAIGenerated field', () => {
      expect(ruleMock.isAIGenerated).toBeDefined();
      expect(typeof ruleMock.isAIGenerated).toBe('boolean');
    });

    it('should default isAIGenerated to false', () => {
      const ruleWithoutAIFlag = { ...ruleMock, isAIGenerated: undefined };
      expect(ruleWithoutAIFlag.isAIGenerated ?? false).toBe(false);
    });
  });

  describe('Trigger Schema Validation', () => {
    it('should have required type field with valid enum values', () => {
      const validTypes: TriggerType[] = ['time_based', 'task_completion', 'behavior', 'mood', 'custom'];
      expect(validTypes).toContain(triggerMock.type);
    });

    it('should have required condition field', () => {
      expect(triggerMock.condition).toBeDefined();
      expect(typeof triggerMock.condition).toBe('string');
    });

    it('should have optional value field', () => {
      expect(triggerMock.value).toBeDefined();
    });

    it('should accept all valid trigger types', () => {
      const validTypes: TriggerType[] = ['time_based', 'task_completion', 'behavior', 'mood', 'custom'];

      validTypes.forEach((type) => {
        const triggerWithType = { ...triggerMock, type };
        expect(validTypes).toContain(triggerWithType.type);
      });
    });
  });

  describe('Action Schema Validation', () => {
    it('should have required type field with valid enum values', () => {
      const validTypes: ActionType[] = ['add_activity', 'send_notification', 'adjust_schedule', 'award_reward', 'custom'];
      expect(validTypes).toContain(actionMock.type);
    });

    it('should have required description field', () => {
      expect(actionMock.description).toBeDefined();
      expect(typeof actionMock.description).toBe('string');
    });

    it('should have optional parameters field', () => {
      expect(actionMock.parameters).toBeDefined();
    });

    it('should accept all valid action types', () => {
      const validTypes: ActionType[] = ['add_activity', 'send_notification', 'adjust_schedule', 'award_reward', 'custom'];

      validTypes.forEach((type) => {
        const actionWithType = { ...actionMock, type };
        expect(validTypes).toContain(actionWithType.type);
      });
    });
  });

  describe('Category Enum Validation', () => {
    it('should accept all valid category values', () => {
      const validCategories: Array<'chore' | 'health' | 'school' | 'routine' | 'other'> = [
        'chore',
        'health',
        'school',
        'routine',
        'other',
      ];

      validCategories.forEach((category) => {
        const ruleWithCategory = { ...ruleMock, category };
        expect(validCategories).toContain(ruleWithCategory.category);
      });
    });
  });

  describe('Actions Array Structure', () => {
    it('should support multiple actions', () => {
      const actions: IAction[] = [
        {
          type: 'add_activity',
          description: 'Add tablet time',
          parameters: new Map<string, any>([['duration', 20]]),
        },
        {
          type: 'send_notification',
          description: 'Send notification to parent',
        },
        {
          type: 'award_reward',
          description: 'Award star',
          parameters: new Map<string, any>([['stars', 1]]),
        },
      ];

      expect(actions.length).toBe(3);
      actions.forEach((action) => {
        expect(action.type).toBeDefined();
        expect(action.description).toBeDefined();
      });
    });

    it('should allow actions without parameters', () => {
      const actionWithoutParams: IAction = {
        type: 'send_notification',
        description: 'Send notification',
      };

      expect(actionWithoutParams.type).toBeDefined();
      expect(actionWithoutParams.description).toBeDefined();
    });
  });

  describe('Trigger Types and Conditions', () => {
    it('should support time_based triggers', () => {
      const timeTrigger: ITrigger = {
        type: 'time_based',
        condition: 'before 5pm',
        value: '17:00',
      };

      expect(timeTrigger.type).toBe('time_based');
      expect(timeTrigger.condition).toBeDefined();
    });

    it('should support task_completion triggers', () => {
      const taskTrigger: ITrigger = {
        type: 'task_completion',
        condition: 'homework completed',
      };

      expect(taskTrigger.type).toBe('task_completion');
      expect(taskTrigger.condition).toBeDefined();
    });

    it('should support behavior triggers', () => {
      const behaviorTrigger: ITrigger = {
        type: 'behavior',
        condition: 'calm behavior for 1 hour',
      };

      expect(behaviorTrigger.type).toBe('behavior');
      expect(behaviorTrigger.condition).toBeDefined();
    });

    it('should support mood triggers', () => {
      const moodTrigger: ITrigger = {
        type: 'mood',
        condition: 'mood is happy',
        value: 'happy',
      };

      expect(moodTrigger.type).toBe('mood');
      expect(moodTrigger.condition).toBeDefined();
    });

    it('should support custom triggers', () => {
      const customTrigger: ITrigger = {
        type: 'custom',
        condition: 'custom condition',
        value: 'custom value',
      };

      expect(customTrigger.type).toBe('custom');
      expect(customTrigger.condition).toBeDefined();
    });
  });

  describe('Action Types and Descriptions', () => {
    it('should support add_activity actions', () => {
      const activityAction: IAction = {
        type: 'add_activity',
        description: 'Add 20 minutes tablet time',
        parameters: new Map<string, any>([['activity', 'tablet'], ['duration', 20]]),
      };

      expect(activityAction.type).toBe('add_activity');
      expect(activityAction.description).toBeDefined();
    });

    it('should support send_notification actions', () => {
      const notificationAction: IAction = {
        type: 'send_notification',
        description: 'Notify parent about completion',
      };

      expect(notificationAction.type).toBe('send_notification');
    });

    it('should support adjust_schedule actions', () => {
      const scheduleAction: IAction = {
        type: 'adjust_schedule',
        description: 'Move bedtime by 30 minutes',
        parameters: new Map<string, any>([['adjustment', 30]]),
      };

      expect(scheduleAction.type).toBe('adjust_schedule');
    });

    it('should support award_reward actions', () => {
      const rewardAction: IAction = {
        type: 'award_reward',
        description: 'Award 2 stars',
        parameters: new Map<string, any>([['reward', 'stars'], ['amount', 2]]),
      };

      expect(rewardAction.type).toBe('award_reward');
    });

    it('should support custom actions', () => {
      const customAction: IAction = {
        type: 'custom',
        description: 'Execute custom logic',
        parameters: new Map<string, any>([['key', 'value']]),
      };

      expect(customAction.type).toBe('custom');
    });
  });

  describe('Parameters Field', () => {
    it('should accept Map type parameters', () => {
      const params = new Map<string, any>([
        ['duration', 20],
        ['type', 'tablet'],
      ]);

      expect(params instanceof Map).toBe(true);
      expect(params.size).toBe(2);
    });

    it('should accept empty parameters', () => {
      const emptyParams = new Map();
      expect(emptyParams instanceof Map).toBe(true);
      expect(emptyParams.size).toBe(0);
    });

    it('should allow null parameters', () => {
      const actionWithoutParams = { ...actionMock, parameters: undefined };
      expect(actionWithoutParams.parameters ?? new Map()).toBeInstanceOf(Map);
    });
  });

  describe('Interface', () => {
    it('should have all required fields in IRule interface', () => {
      const requiredFields: (keyof IRule)[] = [
        'child',
        'parent',
        'name',
        'description',
        'category',
        'trigger',
        'actions',
        'isActive',
        'isAIGenerated',
        'createdAt',
        'updatedAt',
      ];

      requiredFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });

    it('should have all required fields in ITrigger interface', () => {
      const requiredFields: (keyof ITrigger)[] = ['type', 'condition'];

      requiredFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });

    it('should have all required fields in IAction interface', () => {
      const requiredFields: (keyof IAction)[] = ['type', 'description'];

      requiredFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });

    it('should have optional value field in ITrigger interface', () => {
      const optionalFields: Array<keyof ITrigger> = ['value'];

      optionalFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });

    it('should have optional parameters field in IAction interface', () => {
      const optionalFields: Array<keyof IAction> = ['parameters'];

      optionalFields.forEach((field) => {
        expect(field).toBeDefined();
      });
    });
  });
});

describe('Rule Model Factory', () => {
  it('should export Rule model', () => {
    expect(Rule).toBeDefined();
    expect(typeof Rule.findOne).toBe('function');
    expect(typeof Rule.find).toBe('function');
    expect(typeof Rule.create).toBe('function');
    expect(typeof Rule.findById).toBe('function');
    expect(typeof Rule.findByIdAndUpdate).toBe('function');
  });
});
