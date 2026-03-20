import { Router } from 'express';
import * as childController from '../controllers/childController';
import * as routineController from '../controllers/routineController';
import * as activityLogController from '../controllers/activityLogController';
import { auth } from '../middleware/auth';
import {
  childValidation,
  childIdValidation,
  routineValidation,
  routineIdValidation,
  activityLogValidation,
  logIdValidation,
  handleValidationErrors,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/children
 * @desc    Get all children for current user
 * @access  Private
 */
router.get('/', childController.getChildren);

/**
 * @route   POST /api/children
 * @desc    Create a new child profile
 * @access  Private
 */
router.post(
  '/',
  childValidation,
  handleValidationErrors,
  childController.createChild
);


/**
 * @route   GET /api/children/:childId
 * @desc    Get a single child profile
 * @access  Private
 */
router.get(
  '/:childId',
  childIdValidation,
  handleValidationErrors,
  childController.getChild
);

/**
 * @route   PATCH /api/children/:childId
 * @desc    Update a child profile
 * @access  Private
 */
router.patch(
  '/:childId',
  childIdValidation,
  handleValidationErrors,
  childController.updateChild
);

/**
 * @route   DELETE /api/children/:childId
 * @desc    Delete a child profile
 * @access  Private
 */
router.delete(
  '/:childId',
  childIdValidation,
  handleValidationErrors,
  childController.deleteChild
);

/**
 * @route   POST /api/children/:childId/switch
 * @desc    Switch to a specific child (set as active)
 * @access  Private
 */
router.post(
  '/:childId/switch',
  childIdValidation,
  handleValidationErrors,
  childController.switchChild
);

// ===== Child Routines =====

/**
 * @route   GET /api/children/:childId/routines
 * @desc    Get all routines for a child
 * @access  Private
 */
router.get(
  '/:childId/routines',
  childIdValidation,
  handleValidationErrors,
  routineController.getRoutines
);

/**
 * @route   POST /api/children/:childId/routines
 * @desc    Create a new routine for a child
 * @access  Private
 */
router.post(
  '/:childId/routines',
  childIdValidation,
  routineValidation,
  handleValidationErrors,
  routineController.createRoutine
);

// ===== Child Activity Logs =====

/**
 * @route   GET /api/children/:childId/logs
 * @desc    Get logs with filters (date range, type)
 * @access  Private
 */
router.get(
  '/:childId/logs',
  childIdValidation,
  handleValidationErrors,
  activityLogController.getLogs
);

/**
 * @route   POST /api/children/:childId/logs
 * @desc    Create a new activity log entry
 * @access  Private
 */
router.post(
  '/:childId/logs',
  childIdValidation,
  activityLogValidation,
  handleValidationErrors,
  activityLogController.createLog
);

/**
 * @route   GET /api/children/:childId/logs/today
 * @desc    Get today's logs for a child
 * @access  Private
 */
router.get(
  '/:childId/logs/today',
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
  '/:childId/logs/week',
  childIdValidation,
  handleValidationErrors,
  activityLogController.getWeekLogs
);

export default router;
