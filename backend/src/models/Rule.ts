import mongoose, { Document, Schema } from 'mongoose';

export type TriggerType =
  | 'time_based'
  | 'task_completion'
  | 'behavior'
  | 'mood'
  | 'custom';

export type ActionType =
  | 'add_activity'
  | 'send_notification'
  | 'adjust_schedule'
  | 'award_reward'
  | 'custom';

export interface ITrigger {
  type: TriggerType;
  condition: string; // e.g., "homework completed before 5pm"
  value?: string | number | boolean;
}

export interface IAction {
  type: ActionType;
  description: string; // e.g., "add 20 minutes of tablet time"
  parameters?: Record<string, any>;
}

export interface IRule extends Document {
  child: mongoose.Types.ObjectId;
  parent: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: 'chore' | 'health' | 'school' | 'routine' | 'other';
  trigger: ITrigger;
  actions: IAction[];
  isActive: boolean;
  isAIGenerated: boolean; // Track if created by AI
  createdAt: Date;
  updatedAt: Date;
}

const TriggerSchema = new Schema<ITrigger>(
  {
    type: {
      type: String,
      enum: ['time_based', 'task_completion', 'behavior', 'mood', 'custom'],
      required: true,
    },
    condition: {
      type: String,
      required: [true, 'Trigger condition is required'],
    },
    value: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
);

const ActionSchema = new Schema<IAction>(
  {
    type: {
      type: String,
      enum: ['add_activity', 'send_notification', 'adjust_schedule', 'award_reward', 'custom'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Action description is required'],
    },
    parameters: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const RuleSchema = new Schema<IRule>(
  {
    child: {
      type: Schema.Types.ObjectId,
      ref: 'Child',
      required: [true, 'Child reference is required'],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Parent reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Rule name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Rule description is required'],
    },
    category: {
      type: String,
      enum: ['chore', 'health', 'school', 'routine', 'other'],
      required: [true, 'Rule category is required'],
    },
    trigger: {
      type: TriggerSchema,
      required: [true, 'Trigger is required'],
    },
    actions: {
      type: [ActionSchema],
      required: [true, 'Actions are required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RuleSchema.index({ child: 1 });
RuleSchema.index({ parent: 1 });
RuleSchema.index({ child: 1, isActive: 1 });

export default mongoose.model<IRule>('Rule', RuleSchema);
