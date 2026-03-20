import { Router } from 'express';
import * as childController from '../controllers/childController';
import { auth } from '../middleware/auth';
import {
  childValidation,
  childIdValidation,
  handleValidationErrors,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(auth);

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
 * @route   GET /api/children
 * @desc    Get all children for current user
 * @access  Private
 */
router.get('/', childController.getChildren);

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

export default router;
