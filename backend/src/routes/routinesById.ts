import { Router } from 'express';
import * as routineController from '../controllers/routineController';
import { auth } from '../middleware/auth';
import {
  routineIdValidation,
  handleValidationErrors,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/routines/:routineId
 * @desc    Get a single routine
 * @access  Private
 */
router.get(
  '/:routineId',
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
  '/:routineId',
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
  '/:routineId',
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
  '/:routineId/reorder',
  routineIdValidation,
  handleValidationErrors,
  routineController.reorderSteps
);

export default router;
