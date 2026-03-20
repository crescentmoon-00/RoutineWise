import { Request, Response } from 'express';
import { Routine, Child } from '../models';

/**
 * Create a new routine
 */
export const createRoutine = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { childId } = req.params;
    const { name, type, steps } = req.body;

    // Verify child belongs to user
    const child = await Child.findOne({
      _id: childId,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(404).json({ error: 'Child profile not found' });
      return;
    }

    // Create routine with ordered steps
    const orderedSteps = steps.map((step: any, index: number) => ({
      ...step,
      order: index,
    }));

    const routine = await Routine.create({
      child: childId as string,
      name,
      type,
      steps: orderedSteps,
      isActive: true,
    });

    // Add routine to child's routines array
    await Child.findByIdAndUpdate(childId as string, {
      $push: { routines: routine._id },
    });

    res.status(201).json({
      message: 'Routine created successfully',
      routine,
    });
  } catch (error) {
    console.error('Create routine error:', error);
    res.status(500).json({ error: 'Failed to create routine' });
  }
};

/**
 * Get all routines for a child
 */
export const getRoutines = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { childId } = req.params;

    // Verify child belongs to user
    const child = await Child.findOne({
      _id: childId,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(404).json({ error: 'Child profile not found' });
      return;
    }

    const routines = await Routine.find({ child: childId })
      .sort({ type: 1, createdAt: -1 });

    res.status(200).json({ routines });
  } catch (error) {
    console.error('Get routines error:', error);
    res.status(500).json({ error: 'Failed to fetch routines' });
  }
};

/**
 * Get a single routine by ID
 */
export const getRoutine = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { routineId } = req.params;

    // Find routine and verify child belongs to user
    const routine = await Routine.findById(routineId);

    if (!routine) {
      res.status(404).json({ error: 'Routine not found' });
      return;
    }

    const child = await Child.findOne({
      _id: routine.child,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.status(200).json({ routine });
  } catch (error) {
    console.error('Get routine error:', error);
    res.status(500).json({ error: 'Failed to fetch routine' });
  }
};

/**
 * Update a routine
 */
export const updateRoutine = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { routineId } = req.params;
    const { name, type, steps, isActive } = req.body;

    // Find routine and verify child belongs to user
    const routine = await Routine.findById(routineId);

    if (!routine) {
      res.status(404).json({ error: 'Routine not found' });
      return;
    }

    const child = await Child.findOne({
      _id: routine.child,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update fields
    if (name !== undefined) routine.name = name;
    if (type !== undefined) routine.type = type;
    if (isActive !== undefined) routine.isActive = isActive;
    if (steps !== undefined) {
      routine.steps = steps.map((step: any, index: number) => ({
        ...step,
        order: index,
      }));
    }

    await routine.save();

    res.status(200).json({
      message: 'Routine updated successfully',
      routine,
    });
  } catch (error) {
    console.error('Update routine error:', error);
    res.status(500).json({ error: 'Failed to update routine' });
  }
};

/**
 * Delete a routine
 */
export const deleteRoutine = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { routineId } = req.params;

    // Find routine and verify child belongs to user
    const routine = await Routine.findById(routineId);

    if (!routine) {
      res.status(404).json({ error: 'Routine not found' });
      return;
    }

    const child = await Child.findOne({
      _id: routine.child,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Remove routine from child's routines array
    await Child.findByIdAndUpdate(routine.child, {
      $pull: { routines: routineId },
    });

    // Delete the routine
    await Routine.findByIdAndDelete(routineId);

    res.status(200).json({
      message: 'Routine deleted successfully',
    });
  } catch (error) {
    console.error('Delete routine error:', error);
    res.status(500).json({ error: 'Failed to delete routine' });
  }
};

/**
 * Reorder routine steps
 */
export const reorderSteps = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { routineId } = req.params;
    const { stepIds } = req.body; // Array of step IDs in new order

    // Find routine and verify child belongs to user
    const routine = await Routine.findById(routineId);

    if (!routine) {
      res.status(404).json({ error: 'Routine not found' });
      return;
    }

    const child = await Child.findOne({
      _id: routine.child,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Reorder steps based on provided IDs
    const reorderedSteps = stepIds.map((stepId: string, index: number) => {
      const step = routine.steps.find((s) => s._id?.toString() === stepId);
      if (step) {
        // Create a new step object with updated order
        return {
          _id: step._id,
          name: step.name,
          icon: step.icon,
          duration: step.duration,
          category: step.category,
          order: index,
          startTime: step.startTime,
        };
      }
      return null;
    }).filter((s: any): s is any => s !== null);

    routine.steps = reorderedSteps;
    await routine.save();

    res.status(200).json({
      message: 'Steps reordered successfully',
      routine,
    });
  } catch (error) {
    console.error('Reorder steps error:', error);
    res.status(500).json({ error: 'Failed to reorder steps' });
  }
};
