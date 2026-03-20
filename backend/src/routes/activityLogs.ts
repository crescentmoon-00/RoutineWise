import { Router } from 'express';
import * as activityLogController from '../controllers/activityLogController';
import { auth } from '../middleware/auth';
import {
  childIdValidation,
  logIdValidation,
  activityLogValidation,
  handleValidationErrors,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(auth);

/**
 * @route   POST /api/children/:childId/logs
 * @desc    Create a new activity log entry
 * @access  Private
 */
router.post(
  '/children/:childId/logs',
  childIdValidation,
  activityLogValidation,
  handleValidationErrors,
  activityLogController.createLog
);

/**
 * @route   GET /api/children/:childId/logs
 * @desc    Get logs with filters (date range, type)
 * @access  Private
 */
router.get(
  '/children/:childId/logs',
  childIdValidation,
  handleValidationErrors,
  activityLogController.getLogs
);

/**
 * @route   GET /api/children/:childId/logs/today
 * @desc    Get today's logs for a child
 * @access  Private
 */
router.get(
  '/children/:childId/logs/today',
  childIdValidation,
  handleValidationErrors,
  activityLogController.getTodayLogs
);

/**
 * @route   GET /api/children/:childId/logs/week
 * @desc    Get logs for the past week
 * @access  Private
 */
router.get(
  '/children/:childId/logs/week',
  childIdValidation,
  handleValidationErrors,
  activityLogController.getWeekLogs
);

/**
 * @route   GET /api/logs/:logId
 * @desc    Get a single log entry
 * @access  Private
 */
router.get(
  '/logs/:logId',
  logIdValidation,
  handleValidationErrors,
  activityLogController.getLog
);

/**
 * @route   PATCH /api/logs/:logId
 * @desc    Update a log entry
 * @access  Private
 */
router.patch(
  '/logs/:logId',
  logIdValidation,
  handleValidationErrors,
  activityLogController.updateLog
);

/**
 * @route   DELETE /api/logs/:logId
 * @desc    Delete a log entry
 * @access  Private
 */
router.delete(
  '/logs/:logId',
  logIdValidation,
  handleValidationErrors,
  activityLogController.deleteLog
);

export default router;
