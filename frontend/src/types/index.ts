// User & Child Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionTier: 'free' | 'premium';
}

export interface ChildProfile {
  _id: string;
  parent: string;
  name: string;
  dateOfBirth: string;
  avatar?: string;
  status: 'active' | 'transitioning';
  notes?: string;
  routines?: any[];
  logs?: any[];
  rules?: any[];
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Routine & Task Types
export interface Task {
  _id: string;
  task: string;
  icon: string;
  status: 'pending' | 'completed' | 'skipped';
  duration?: number;
  startTime?: string;
  endTime?: string;
}

export interface Routine {
  _id: string;
  name: string;
  type: 'morning' | 'afternoon' | 'evening' | 'custom';
  steps: Task[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Log Types
export type LogType = 'medication' | 'meltdown' | 'snack' | 'mood_shift' | 'sleep' | 'custom';

export interface ActivityLog {
  _id: string;
  childId: string;
  type: LogType;
  timestamp: Date;
  trigger?: string;
  notes?: string;
  severity?: 1 | 2 | 3 | 4 | 5;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Rule Types
export type TriggerVariable = 'sleep_quality' | 'mood' | 'meltdown_count' | 'routine_completion';

export type TriggerCondition = 'low' | 'medium' | 'high' | 'before' | 'after' | 'equals';

export type ActionType = 'suggest_activity' | 'replace_routine' | 'add_reward' | 'skip_activity';

export interface Rule {
  _id: string;
  childId: string;
  name: string;
  triggerVariable: TriggerVariable;
  triggerCondition: TriggerCondition;
  triggerValue?: string | number;
  actionType: ActionType;
  actionValue: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
}
