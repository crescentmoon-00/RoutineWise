import { Request, Response } from 'express';
import {
  createLog,
  getLogs,
  getTodayLogs,
  getWeekLogs,
  getLog,
  updateLog,
  deleteLog,
} from '../activityLogController';

// Mock the models module BEFORE importing
jest.mock('../../models', () => ({
  ActivityLog: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  },
  Child: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  User: jest.fn(),
  Routine: jest.fn(),
  Rule: jest.fn(),
}));

import { ActivityLog, Child } from '../../models';
const mockActivityLogModel = ActivityLog as jest.Mocked<any>;
const mockChildModel = Child as jest.Mocked<any>;

describe('ActivityLog Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockLog: any;
  let mockChild: any;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: undefined,
      params: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();

    // Create a mock activity log object
    mockLog = {
      _id: '507f1f77bcf86cd799439016',
      child: '507f1f77bcf86cd799439012',
      type: 'medication',
      title: 'Morning medication',
      description: 'Took ADHD medication',
      timestamp: new Date(),
      duration: null,
      severity: null,
      triggers: [],
      mood: 'calm',
      notes: '',
      createdBy: '507f1f77bcf86cd799439011',
      save: jest.fn().mockResolvedValue(true),
    };

    // Create a mock child object
    mockChild = {
      _id: '507f1f77bcf86cd799439012',
      parent: '507f1f77bcf86cd799439011',
      name: 'Test Child',
    };

    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createLog', () => {
    it('should create a log successfully', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };
      mockReq.body = {
        type: 'medication',
        title: 'Morning medication',
        description: 'Took ADHD medication',
        mood: 'calm',
      };

      mockChildModel.findOne.mockResolvedValue(mockChild);
      mockActivityLogModel.create.mockResolvedValue(mockLog);
      mockChildModel.findByIdAndUpdate.mockResolvedValue(mockChild);

      await createLog(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockReq.user.userId,
      });
      expect(mockActivityLogModel.create).toHaveBeenCalledWith({
        child: mockChild._id,
        type: 'medication',
        title: 'Morning medication',
        description: 'Took ADHD medication',
        timestamp: expect.any(Date),
        duration: null,
        severity: null,
        triggers: [],
        mood: 'calm',
        notes: '',
        createdBy: mockReq.user.userId,
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Log entry created successfully',
        log: mockLog,
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };
      mockReq.body = { type: 'medication', title: 'Test' };

      await createLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: 'nonexistent-id' };
      mockReq.body = { type: 'medication', title: 'Test' };

      mockChildModel.findOne.mockResolvedValue(null);

      await createLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };
      mockReq.body = { type: 'medication', title: 'Test' };

      mockChildModel.findOne.mockRejectedValue(new Error('Database error'));

      await createLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create log entry' });
    });
  });

  describe('getLogs', () => {
    it('should get logs with filters', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };
      mockReq.query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        type: 'medication',
        limit: '20',
        offset: '0',
      };

      mockChildModel.findOne.mockResolvedValue(mockChild);
      mockActivityLogModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([mockLog]),
      } as any);
      mockActivityLogModel.countDocuments.mockResolvedValue(1);

      await getLogs(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockReq.user.userId,
      });
      expect(mockActivityLogModel.find).toHaveBeenCalledWith({
        child: mockChild._id,
        timestamp: {
          $gte: new Date('2024-01-01'),
          $lte: new Date('2024-01-31'),
        },
        type: 'medication',
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };

      await getLogs(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: 'nonexistent-id' };

      mockChildModel.findOne.mockResolvedValue(null);

      await getLogs(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockRejectedValue(new Error('Database error'));

      await getLogs(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch logs' });
    });
  });

  describe('getTodayLogs', () => {
    it('should get today logs successfully', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockResolvedValue(mockChild);
      mockActivityLogModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([mockLog]),
      } as any);

      await getTodayLogs(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockReq.user.userId,
      });
      expect(mockActivityLogModel.find).toHaveBeenCalledWith({
        child: mockChild._id,
        timestamp: {
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ logs: [mockLog] });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };

      await getTodayLogs(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: 'nonexistent-id' };

      mockChildModel.findOne.mockResolvedValue(null);

      await getTodayLogs(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockRejectedValue(new Error('Database error'));

      await getTodayLogs(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to fetch today's logs" });
    });
  });

  describe('getWeekLogs', () => {
    it('should get week logs successfully', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockResolvedValue(mockChild);
      mockActivityLogModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([mockLog]),
      } as any);

      await getWeekLogs(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockReq.user.userId,
      });
      expect(mockActivityLogModel.find).toHaveBeenCalledWith({
        child: mockChild._id,
        timestamp: {
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ logs: [mockLog] });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };

      await getWeekLogs(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: 'nonexistent-id' };

      mockChildModel.findOne.mockResolvedValue(null);

      await getWeekLogs(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockRejectedValue(new Error('Database error'));

      await getWeekLogs(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch week logs' });
    });
  });

  describe('getLog', () => {
    it('should get a single log by ID', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: mockLog._id };

      mockActivityLogModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockLog),
      } as any);
      mockChildModel.findOne.mockResolvedValue(mockChild);

      await getLog(mockReq as Request, mockRes as Response);

      expect(mockActivityLogModel.findById).toHaveBeenCalledWith(mockLog._id);
      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockLog.child,
        parent: mockReq.user.userId,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ log: mockLog });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { logId: mockLog._id };

      await getLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if log not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: 'nonexistent-id' };

      mockActivityLogModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await getLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Log entry not found' });
    });

    it('should return 403 if access denied', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: mockLog._id };

      mockActivityLogModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockLog),
      } as any);
      mockChildModel.findOne.mockResolvedValue(null);

      await getLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: mockLog._id };

      mockActivityLogModel.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error')),
      } as any);

      await getLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch log entry' });
    });
  });

  describe('updateLog', () => {
    it('should update a log successfully', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: mockLog._id };
      mockReq.body = {
        title: 'Updated title',
        mood: 'happy',
        notes: 'Updated notes',
      };

      mockActivityLogModel.findById.mockResolvedValue(mockLog);
      mockChildModel.findOne.mockResolvedValue(mockChild);

      await updateLog(mockReq as Request, mockRes as Response);

      expect(mockLog.title).toBe('Updated title');
      expect(mockLog.mood).toBe('happy');
      expect(mockLog.notes).toBe('Updated notes');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Log entry updated successfully',
        log: mockLog,
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { logId: mockLog._id };
      mockReq.body = { title: 'Updated' };

      await updateLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if log not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: 'nonexistent-id' };
      mockReq.body = { title: 'Updated' };

      mockActivityLogModel.findById.mockResolvedValue(null);

      await updateLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Log entry not found' });
    });

    it('should return 403 if access denied', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: mockLog._id };
      mockReq.body = { title: 'Updated' };

      mockActivityLogModel.findById.mockResolvedValue(mockLog);
      mockChildModel.findOne.mockResolvedValue(null);

      await updateLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: mockLog._id };
      mockReq.body = { title: 'Updated' };

      mockActivityLogModel.findById.mockRejectedValue(new Error('Database error'));

      await updateLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update log entry' });
    });
  });

  describe('deleteLog', () => {
    it('should delete a log successfully', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: mockLog._id };

      mockActivityLogModel.findById.mockResolvedValue(mockLog);
      mockChildModel.findOne.mockResolvedValue(mockChild);
      mockChildModel.findByIdAndUpdate.mockResolvedValue(mockChild);
      mockActivityLogModel.findByIdAndDelete.mockResolvedValue(mockLog);

      await deleteLog(mockReq as Request, mockRes as Response);

      expect(mockActivityLogModel.findById).toHaveBeenCalledWith(mockLog._id);
      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockLog.child,
        parent: mockReq.user.userId,
      });
      expect(mockChildModel.findByIdAndUpdate).toHaveBeenCalledWith(mockLog.child, {
        $pull: { logs: mockLog._id },
      });
      expect(mockActivityLogModel.findByIdAndDelete).toHaveBeenCalledWith(mockLog._id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Log entry deleted successfully',
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { logId: mockLog._id };

      await deleteLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if log not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: 'nonexistent-id' };

      mockActivityLogModel.findById.mockResolvedValue(null);

      await deleteLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Log entry not found' });
    });

    it('should return 403 if access denied', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: mockLog._id };

      mockActivityLogModel.findById.mockResolvedValue(mockLog);
      mockChildModel.findOne.mockResolvedValue(null);

      await deleteLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { logId: mockLog._id };

      mockActivityLogModel.findById.mockRejectedValue(new Error('Database error'));

      await deleteLog(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete log entry' });
    });
  });
});
