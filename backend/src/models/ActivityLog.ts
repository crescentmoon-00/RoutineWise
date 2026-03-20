import mongoose, { Document, Schema } from 'mongoose';

export type LogType =
  | 'medication'
  | 'meltdown'
  | 'snack'
  | 'meal'
  | 'mood'
  | 'sleep'
  | 'activity'
  | 'other';

export interface IActivityLog extends Document {
  child: mongoose.Types.ObjectId;
  type: LogType;
  title: string;
  description?: string;
  timestamp: Date;
  duration?: number; // in minutes
  severity?: number; // 1-5 for certain types like meltdowns
  triggers?: string[]; // e.g., ['noise', 'tired']
  mood?: string; // e.g., 'happy', 'sad', 'anxious'
  notes?: string;
  createdBy: mongoose.Types.ObjectId; // parent who created the log
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    child: {
      type: Schema.Types.ObjectId,
      ref: 'Child',
      required: [true, 'Child reference is required'],
    },
    type: {
      type: String,
      enum: ['medication', 'meltdown', 'snack', 'meal', 'mood', 'sleep', 'activity', 'other'],
      required: [true, 'Log type is required'],
    },
    title: {
      type: String,
      required: [true, 'Log title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    duration: {
      type: Number,
      default: null,
    },
    severity: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    triggers: [{
      type: String,
      trim: true,
    }],
    mood: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ActivityLogSchema.index({ child: 1 });
ActivityLogSchema.index({ child: 1, timestamp: -1 });
ActivityLogSchema.index({ child: 1, type: 1 });
ActivityLogSchema.index({ createdBy: 1 });

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
