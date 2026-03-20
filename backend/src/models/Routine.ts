import mongoose, { Document, Schema } from 'mongoose';

export interface IRoutineStep {
  _id?: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  duration?: number; // in minutes
  category: 'morning' | 'afternoon' | 'evening' | 'custom';
  order: number;
  startTime?: string; // HH:mm format
}

export interface IRoutine extends Document {
  child: mongoose.Types.ObjectId;
  name: string;
  type: 'morning' | 'afternoon' | 'evening' | 'custom';
  steps: IRoutineStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoutineStepSchema = new Schema<IRoutineStep>(
  {
    name: {
      type: String,
      required: [true, 'Step name is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Step icon is required'],
    },
    duration: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'custom'],
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
      default: null,
    },
  },
  { _id: true }
);

const RoutineSchema = new Schema<IRoutine>(
  {
    child: {
      type: Schema.Types.ObjectId,
      ref: 'Child',
      required: [true, 'Child reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Routine name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'custom'],
      required: [true, 'Routine type is required'],
    },
    steps: [RoutineStepSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RoutineSchema.index({ child: 1 });
RoutineSchema.index({ child: 1, type: 1 });
RoutineSchema.index({ child: 1, isActive: 1 });

export default mongoose.model<IRoutine>('Routine', RoutineSchema);
