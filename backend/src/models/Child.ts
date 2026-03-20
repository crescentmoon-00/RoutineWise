import mongoose, { Document, Schema } from 'mongoose';

export interface IChild extends Document {
  parent: mongoose.Types.ObjectId;
  name: string;
  dateOfBirth: Date;
  avatar?: string;
  status: 'active' | 'transitioning';
  notes?: string;
  routines: mongoose.Types.ObjectId[];
  logs: mongoose.Types.ObjectId[];
  rules: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChildSchema = new Schema<IChild>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Parent reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Child name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    avatar: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'transitioning'],
      default: 'active',
    },
    notes: {
      type: String,
      default: '',
    },
    routines: [{
      type: Schema.Types.ObjectId,
      ref: 'Routine',
    }],
    logs: [{
      type: Schema.Types.ObjectId,
      ref: 'ActivityLog',
    }],
    rules: [{
      type: Schema.Types.ObjectId,
      ref: 'Rule',
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for age calculation
ChildSchema.virtual('age').get(function(this: IChild) {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Indexes
ChildSchema.index({ parent: 1 });
ChildSchema.index({ parent: 1, status: 1 });

export default mongoose.model<IChild>('Child', ChildSchema);
