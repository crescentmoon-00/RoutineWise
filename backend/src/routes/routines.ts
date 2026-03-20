import { Router } from 'express';
import * as routineController from '../controllers/routineController';
import { auth } from '../middleware/auth';
import {
  childIdValidation,
  routineValidation,
  routineIdValidation,
  handleValidationErrors,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(auth);

/**
 * @route   POST /api/children/:childId/routines
 * @desc    Create a new routine for a child
 * @access  Private
 */
router.post(
  '/children/:childId/routines',
  childIdValidation,
  routineValidation,
  handleValidationErrors,
  routineController.createRoutine
);

/**
 * @route   GET /api/children/:childId/routines
 * @desc    Get all routines for a child
 * @access  Private
 */
router.get(
  '/children/:childId/routines',
  childIdValidation,
  handleValidationErrors,
  routineController.getRoutines
);

/**
 * @route   GET /api/routines/:routineId
 * @desc    Get a single routine
 * @access  Private
 */
router.get(
  '/routines/:routineId',
  routineIdValidation,
  handleValidationErrors,
  routineController.getRoutine
);

/**
 * @route   PATCH /api/routines/:routineId
 * @desc    Update a routine
 * @access  Private
 */
router.patch(
  '/routines/:routineId',
  routineIdValidation,
  handleValidationErrors,
  routineController.updateRoutine
);

/**
 * @route   DELETE /api/routines/:routineId
 * @desc    Delete a routine
 * @access  Private
 */
router.delete(
  '/routines/:routineId',
  routineIdValidation,
  handleValidationErrors,
  routineController.deleteRoutine
);

/**
 * @route   POST /api/routines/:routineId/reorder
 * @desc    Reorder routine steps
 * @access  Private
 */
router.post(
  '/routines/:routineId/reorder',
  routineIdValidation,
  handleValidationErrors,
  routineController.reorderSteps
);

export default router;
