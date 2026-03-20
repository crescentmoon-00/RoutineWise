import { Request, Response } from 'express';
import { ActivityLog, Child } from '../models';
import { startOfDay, endOfDay, subDays } from 'date-fns';

/**
 * Create a new activity log entry
 */
export const createLog = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { childId } = req.params;
    const {
      type,
      title,
      description,
      timestamp,
      duration,
      severity,
      triggers,
      mood,
      notes,
    } = req.body;

    // Verify child belongs to user
    const child = await Child.findOne({
      _id: childId,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(404).json({ error: 'Child profile not found' });
      return;
    }

    // Create log entry
    const log = await ActivityLog.create({
      child: childId as string,
      type,
      title,
      description: description || '',
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      duration: duration || null,
      severity: severity || null,
      triggers: triggers || [],
      mood: mood || null,
      notes: notes || '',
      createdBy: req.user.userId,
    });

    // Add log to child's logs array
    await Child.findByIdAndUpdate(childId as string, {
      $push: { logs: log._id },
    });

    res.status(201).json({
      message: 'Log entry created successfully',
      log,
    });
  } catch (error) {
    console.error('Create log error:', error);
    res.status(500).json({ error: 'Failed to create log entry' });
  }
};

/**
 * Get logs with filters
 */
export const getLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { childId } = req.params;
    const {
      startDate,
      endDate,
      type,
      limit = '50',
      offset = '0',
    } = req.query;

    // Verify child belongs to user
    const child = await Child.findOne({
      _id: childId,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(404).json({ error: 'Child profile not found' });
      return;
    }

    // Build query
    const query: any = { child: childId };

    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate as string);
      }
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Execute query with pagination
    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string))
      .populate('createdBy', 'firstName lastName email');

    // Get total count for pagination
    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      logs,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

/**
 * Get logs for today
 */
export const getTodayLogs = async (req: Request, res: Response): Promise<void> => {
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

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const logs = await ActivityLog.find({
      child: childId,
      timestamp: { $gte: startOfToday, $lte: endOfToday },
    })
      .sort({ timestamp: -1 })
      .populate('createdBy', 'firstName lastName');

    res.status(200).json({ logs });
  } catch (error) {
    console.error('Get today logs error:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s logs' });
  }
};

/**
 * Get logs for the past week
 */
export const getWeekLogs = async (req: Request, res: Response): Promise<void> => {
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

    const today = new Date();
    const weekAgo = subDays(today, 7);
    const startOfWeek = startOfDay(weekAgo);
    const endOfToday = endOfDay(today);

    const logs = await ActivityLog.find({
      child: childId,
      timestamp: { $gte: startOfWeek, $lte: endOfToday },
    })
      .sort({ timestamp: -1 })
      .populate('createdBy', 'firstName lastName');

    res.status(200).json({ logs });
  } catch (error) {
    console.error('Get week logs error:', error);
    res.status(500).json({ error: 'Failed to fetch week logs' });
  }
};

/**
 * Get a single log entry
 */
export const getLog = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { logId } = req.params;

    // Find log and verify child belongs to user
    const log = await ActivityLog.findById(logId).populate('createdBy', 'firstName lastName email');

    if (!log) {
      res.status(404).json({ error: 'Log entry not found' });
      return;
    }

    const child = await Child.findOne({
      _id: log.child,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.status(200).json({ log });
  } catch (error) {
    console.error('Get log error:', error);
    res.status(500).json({ error: 'Failed to fetch log entry' });
  }
};

/**
 * Update a log entry
 */
export const updateLog = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { logId } = req.params;
    const {
      type,
      title,
      description,
      timestamp,
      duration,
      severity,
      triggers,
      mood,
      notes,
    } = req.body;

    // Find log and verify child belongs to user
    const log = await ActivityLog.findById(logId);

    if (!log) {
      res.status(404).json({ error: 'Log entry not found' });
      return;
    }

    const child = await Child.findOne({
      _id: log.child,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update fields
    if (type !== undefined) log.type = type;
    if (title !== undefined) log.title = title;
    if (description !== undefined) log.description = description;
    if (timestamp !== undefined) log.timestamp = new Date(timestamp);
    if (duration !== undefined) log.duration = duration;
    if (severity !== undefined) log.severity = severity;
    if (triggers !== undefined) log.triggers = triggers;
    if (mood !== undefined) log.mood = mood;
    if (notes !== undefined) log.notes = notes;

    await log.save();

    res.status(200).json({
      message: 'Log entry updated successfully',
      log,
    });
  } catch (error) {
    console.error('Update log error:', error);
    res.status(500).json({ error: 'Failed to update log entry' });
  }
};

/**
 * Delete a log entry
 */
export const deleteLog = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { logId } = req.params;

    // Find log and verify child belongs to user
    const log = await ActivityLog.findById(logId);

    if (!log) {
      res.status(404).json({ error: 'Log entry not found' });
      return;
    }

    const child = await Child.findOne({
      _id: log.child,
      parent: req.user.userId,
    });

    if (!child) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Remove log from child's logs array
    await Child.findByIdAndUpdate(log.child, {
      $pull: { logs: logId },
    });

    // Delete the log
    await ActivityLog.findByIdAndDelete(logId);

    res.status(200).json({
      message: 'Log entry deleted successfully',
    });
  } catch (error) {
    console.error('Delete log error:', error);
    res.status(500).json({ error: 'Failed to delete log entry' });
  }
};
