import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param } from 'express-validator';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
    return;
  }
  next();
};

// Auth validation rules
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// Child profile validation rules
export const childValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Child name is required'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please enter a valid date of birth'),
  body('status')
    .optional()
    .isIn(['active', 'transitioning'])
    .withMessage('Status must be either active or transitioning'),
];

export const childIdValidation = [
  param('childId')
    .isMongoId()
    .withMessage('Invalid child ID'),
];

// Routine validation rules
export const routineValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Routine name is required'),
  body('type')
    .isIn(['morning', 'afternoon', 'evening', 'custom'])
    .withMessage('Routine type must be morning, afternoon, evening, or custom'),
  body('steps')
    .isArray()
    .withMessage('Steps must be an array'),
  body('steps.*.name')
    .trim()
    .notEmpty()
    .withMessage('Each step must have a name'),
  body('steps.*.icon')
    .trim()
    .notEmpty()
    .withMessage('Each step must have an icon'),
  body('steps.*.category')
    .isIn(['morning', 'afternoon', 'evening', 'custom'])
    .withMessage('Each step category must be valid'),
];

export const routineIdValidation = [
  param('routineId')
    .isMongoId()
    .withMessage('Invalid routine ID'),
];

// Activity log validation rules
export const activityLogValidation = [
  body('type')
    .isIn(['medication', 'meltdown', 'snack', 'meal', 'mood', 'sleep', 'activity', 'other'])
    .withMessage('Invalid log type'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Log title is required'),
  body('timestamp')
    .optional()
    .isISO8601()
    .withMessage('Timestamp must be a valid date'),
  body('severity')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Severity must be between 1 and 5'),
];

export const logIdValidation = [
  param('logId')
    .isMongoId()
    .withMessage('Invalid log ID'),
];

// Rule validation rules
export const ruleValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Rule name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Rule description is required'),
  body('category')
    .isIn(['chore', 'health', 'school', 'routine', 'other'])
    .withMessage('Invalid rule category'),
  body('trigger')
    .notEmpty()
    .withMessage('Trigger is required'),
  body('trigger.type')
    .isIn(['time_based', 'task_completion', 'behavior', 'mood', 'custom'])
    .withMessage('Invalid trigger type'),
  body('trigger.condition')
    .trim()
    .notEmpty()
    .withMessage('Trigger condition is required'),
  body('actions')
    .isArray({ min: 1 })
    .withMessage('At least one action is required'),
  body('actions.*.type')
    .isIn(['add_activity', 'send_notification', 'adjust_schedule', 'award_reward', 'custom'])
    .withMessage('Invalid action type'),
  body('actions.*.description')
    .trim()
    .notEmpty()
    .withMessage('Each action must have a description'),
];

export const ruleIdValidation = [
  param('ruleId')
    .isMongoId()
    .withMessage('Invalid rule ID'),
];
