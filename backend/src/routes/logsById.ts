import { Router } from 'express';
import * as activityLogController from '../controllers/activityLogController';
import { auth } from '../middleware/auth';
import {
  logIdValidation,
  handleValidationErrors,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/logs/:logId
 * @desc    Get a single log entry
 * @access  Private
 */
router.get(
  '/:logId',
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
  '/:logId',
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
  '/:logId',
  logIdValidation,
  handleValidationErrors,
  activityLogController.deleteLog
);

export default router;
