import { Request, Response } from 'express';
import { Child, User } from '../models';

/**
 * Create a new child profile
 */
export const createChild = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { name, dateOfBirth, avatar, status, notes } = req.body;

    // Check subscription tier for free users
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Free tier: max 1 child
    if (user.subscriptionTier === 'free') {
      const childCount = await Child.countDocuments({ parent: req.user.userId });
      if (childCount >= 1) {
        res.status(403).json({
          error: 'Free tier limited to 1 child profile. Upgrade to premium for unlimited children.',
        });
        return;
      }
    }

    // Create child profile
    const child = await Child.create({
      parent: req.user.userId,
      name,
      dateOfBirth,
      avatar: avatar || null,
      status: status || 'active',
      notes: notes || '',
    });

    // Add child to user's children array
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { children: child._id },
    });

    res.status(201).json({
      message: 'Child profile created successfully',
      child,
    });
  } catch (error) {
    console.error('Create child error:', error);
    res.status(500).json({ error: 'Failed to create child profile' });
  }
};

/**
 * Get all children for the current user
 */
export const getChildren = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const children = await Child.find({ parent: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('routines')
      .populate('logs')
      .populate('rules');

    res.status(200).json({ children });
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
};

/**
 * Get a single child profile by ID
 */
export const getChild = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { childId } = req.params;

    const child = await Child.findOne({
      _id: childId,
      parent: req.user.userId,
    })
      .populate('routines')
      .populate('logs')
      .populate('rules');

    if (!child) {
      res.status(404).json({ error: 'Child profile not found' });
      return;
    }

    res.status(200).json({ child });
  } catch (error) {
    console.error('Get child error:', error);
    res.status(500).json({ error: 'Failed to fetch child profile' });
  }
};

/**
 * Update a child profile
 */
export const updateChild = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { childId } = req.params;
    const { name, dateOfBirth, avatar, status, notes } = req.body;

    // Verify child belongs to user
    const child = await Child.findOne({
      _id: childId,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(404).json({ error: 'Child profile not found' });
      return;
    }

    // Update fields
    if (name !== undefined) child.name = name;
    if (dateOfBirth !== undefined) child.dateOfBirth = new Date(dateOfBirth);
    if (avatar !== undefined) child.avatar = avatar;
    if (status !== undefined) child.status = status;
    if (notes !== undefined) child.notes = notes;

    await child.save();

    res.status(200).json({
      message: 'Child profile updated successfully',
      child,
    });
  } catch (error) {
    console.error('Update child error:', error);
    res.status(500).json({ error: 'Failed to update child profile' });
  }
};

/**
 * Delete a child profile
 */
export const deleteChild = async (req: Request, res: Response): Promise<void> => {
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

    // Remove child from user's children array
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { children: childId },
    });

    // Delete the child (will cascade delete routines, logs, rules via middleware if needed)
    await Child.findByIdAndDelete(childId);

    res.status(200).json({
      message: 'Child profile deleted successfully',
    });
  } catch (error) {
    console.error('Delete child error:', error);
    res.status(500).json({ error: 'Failed to delete child profile' });
  }
};

/**
 * Switch between children (helper endpoint for frontend)
 */
export const switchChild = async (req: Request, res: Response): Promise<void> => {
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

    // In a real app, this might update a session or context
    // For now, just return the child data
    res.status(200).json({
      message: 'Switched to child successfully',
      child,
    });
  } catch (error) {
    console.error('Switch child error:', error);
    res.status(500).json({ error: 'Failed to switch child' });
  }
};
