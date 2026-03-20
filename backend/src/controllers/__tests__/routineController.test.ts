import { Request, Response } from 'express';
import {
  createRoutine,
  getRoutines,
  getRoutine,
  updateRoutine,
  deleteRoutine,
  reorderSteps,
} from '../routineController';

// Mock the models module BEFORE importing
jest.mock('../../models', () => ({
  Routine: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
  Child: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  User: jest.fn(),
  ActivityLog: jest.fn(),
  Rule: jest.fn(),
}));

import { Routine, Child } from '../../models';
const mockRoutineModel = Routine as jest.Mocked<any>;
const mockChildModel = Child as jest.Mocked<any>;

describe('Routine Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockRoutine: any;
  let mockChild: any;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: undefined,
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();

    // Create a mock routine object
    mockRoutine = {
      _id: '507f1f77bcf86cd799439013',
      child: '507f1f77bcf86cd799439012',
      name: 'Morning Routine',
      type: 'morning',
      steps: [
        {
          _id: '507f1f77bcf86cd799439014',
          name: 'Wake up',
          icon: 'alarm',
          duration: 0,
          category: 'morning',
          order: 0,
        },
        {
          _id: '507f1f77bcf86cd799439015',
          name: 'Brush teeth',
          icon: 'tooth',
          duration: 5,
          category: 'morning',
          order: 1,
        },
      ],
      isActive: true,
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

  describe('createRoutine', () => {
    it('should create a routine successfully', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };
      mockReq.body = {
        name: 'Morning Routine',
        type: 'morning',
        steps: [
          { name: 'Wake up', icon: 'alarm', category: 'morning' },
          { name: 'Brush teeth', icon: 'tooth', duration: 5, category: 'morning' },
        ],
      };

      mockChildModel.findOne.mockResolvedValue(mockChild);
      mockRoutineModel.create.mockResolvedValue(mockRoutine);
      mockChildModel.findByIdAndUpdate.mockResolvedValue(mockChild);

      await createRoutine(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockReq.user.userId,
      });
      expect(mockRoutineModel.create).toHaveBeenCalledWith({
        child: mockChild._id,
        name: 'Morning Routine',
        type: 'morning',
        steps: [
          { name: 'Wake up', icon: 'alarm', category: 'morning', order: 0 },
          { name: 'Brush teeth', icon: 'tooth', duration: 5, category: 'morning', order: 1 },
        ],
        isActive: true,
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Routine created successfully',
        routine: mockRoutine,
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };
      mockReq.body = { name: 'Morning Routine', type: 'morning', steps: [] };

      await createRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: 'nonexistent-id' };
      mockReq.body = { name: 'Morning Routine', type: 'morning', steps: [] };

      mockChildModel.findOne.mockResolvedValue(null);

      await createRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };
      mockReq.body = { name: 'Morning Routine', type: 'morning', steps: [] };

      mockChildModel.findOne.mockRejectedValue(new Error('Database error'));

      await createRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create routine' });
    });
  });

  describe('getRoutines', () => {
    it('should get all routines for a child', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockResolvedValue(mockChild);
      mockRoutineModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockRoutine]),
      } as any);

      await getRoutines(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockReq.user.userId,
      });
      expect(mockRoutineModel.find).toHaveBeenCalledWith({ child: mockChild._id });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ routines: [mockRoutine] });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };

      await getRoutines(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: 'nonexistent-id' };

      mockChildModel.findOne.mockResolvedValue(null);

      await getRoutines(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockRejectedValue(new Error('Database error'));

      await getRoutines(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch routines' });
    });
  });

  describe('getRoutine', () => {
    it('should get a single routine by ID', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };

      mockRoutineModel.findById.mockResolvedValue(mockRoutine);
      mockChildModel.findOne.mockResolvedValue(mockChild);

      await getRoutine(mockReq as Request, mockRes as Response);

      expect(mockRoutineModel.findById).toHaveBeenCalledWith(mockRoutine._id);
      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockRoutine.child,
        parent: mockReq.user.userId,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ routine: mockRoutine });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { routineId: mockRoutine._id };

      await getRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if routine not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: 'nonexistent-id' };

      mockRoutineModel.findById.mockResolvedValue(null);

      await getRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Routine not found' });
    });

    it('should return 403 if access denied', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };

      mockRoutineModel.findById.mockResolvedValue(mockRoutine);
      mockChildModel.findOne.mockResolvedValue(null);

      await getRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };

      mockRoutineModel.findById.mockRejectedValue(new Error('Database error'));

      await getRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch routine' });
    });
  });

  describe('updateRoutine', () => {
    it('should update a routine successfully', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };
      mockReq.body = {
        name: 'Updated Morning Routine',
        isActive: false,
        steps: [
          { name: 'Wake up', icon: 'alarm', category: 'morning' },
          { name: 'Get dressed', icon: 'shirt', category: 'morning' },
        ],
      };

      mockRoutineModel.findById.mockResolvedValue(mockRoutine);
      mockChildModel.findOne.mockResolvedValue(mockChild);

      await updateRoutine(mockReq as Request, mockRes as Response);

      expect(mockRoutine.name).toBe('Updated Morning Routine');
      expect(mockRoutine.isActive).toBe(false);
      expect(mockRoutine.steps.length).toBe(2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Routine updated successfully',
        routine: mockRoutine,
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { routineId: mockRoutine._id };
      mockReq.body = { name: 'Updated Routine' };

      await updateRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if routine not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: 'nonexistent-id' };
      mockReq.body = { name: 'Updated Routine' };

      mockRoutineModel.findById.mockResolvedValue(null);

      await updateRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Routine not found' });
    });

    it('should return 403 if access denied', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };
      mockReq.body = { name: 'Updated Routine' };

      mockRoutineModel.findById.mockResolvedValue(mockRoutine);
      mockChildModel.findOne.mockResolvedValue(null);

      await updateRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };
      mockReq.body = { name: 'Updated Routine' };

      mockRoutineModel.findById.mockRejectedValue(new Error('Database error'));

      await updateRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update routine' });
    });
  });

  describe('deleteRoutine', () => {
    it('should delete a routine successfully', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };

      mockRoutineModel.findById.mockResolvedValue(mockRoutine);
      mockChildModel.findOne.mockResolvedValue(mockChild);
      mockChildModel.findByIdAndUpdate.mockResolvedValue(mockChild);
      mockRoutineModel.findByIdAndDelete.mockResolvedValue(mockRoutine);

      await deleteRoutine(mockReq as Request, mockRes as Response);

      expect(mockRoutineModel.findById).toHaveBeenCalledWith(mockRoutine._id);
      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockRoutine.child,
        parent: mockReq.user.userId,
      });
      expect(mockChildModel.findByIdAndUpdate).toHaveBeenCalledWith(mockRoutine.child, {
        $pull: { routines: mockRoutine._id },
      });
      expect(mockRoutineModel.findByIdAndDelete).toHaveBeenCalledWith(mockRoutine._id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Routine deleted successfully',
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { routineId: mockRoutine._id };

      await deleteRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if routine not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: 'nonexistent-id' };

      mockRoutineModel.findById.mockResolvedValue(null);

      await deleteRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Routine not found' });
    });

    it('should return 403 if access denied', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };

      mockRoutineModel.findById.mockResolvedValue(mockRoutine);
      mockChildModel.findOne.mockResolvedValue(null);

      await deleteRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };

      mockRoutineModel.findById.mockRejectedValue(new Error('Database error'));

      await deleteRoutine(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete routine' });
    });
  });

  describe('reorderSteps', () => {
    it('should reorder steps successfully', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };
      mockReq.body = {
        stepIds: [
          '507f1f77bcf86cd799439015',
          '507f1f77bcf86cd799439014',
        ],
      };

      mockRoutineModel.findById.mockResolvedValue(mockRoutine);
      mockChildModel.findOne.mockResolvedValue(mockChild);

      await reorderSteps(mockReq as Request, mockRes as Response);

      expect(mockRoutine.steps[0].order).toBe(0);
      expect(mockRoutine.steps[1].order).toBe(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Steps reordered successfully',
        routine: mockRoutine,
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { routineId: mockRoutine._id };
      mockReq.body = { stepIds: [] };

      await reorderSteps(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if routine not found', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: 'nonexistent-id' };
      mockReq.body = { stepIds: [] };

      mockRoutineModel.findById.mockResolvedValue(null);

      await reorderSteps(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Routine not found' });
    });

    it('should return 403 if access denied', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };
      mockReq.body = { stepIds: [] };

      mockRoutineModel.findById.mockResolvedValue(mockRoutine);
      mockChildModel.findOne.mockResolvedValue(null);

      await reorderSteps(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: '507f1f77bcf86cd799439011', email: 'parent@example.com' };
      mockReq.params = { routineId: mockRoutine._id };
      mockReq.body = { stepIds: [] };

      mockRoutineModel.findById.mockRejectedValue(new Error('Database error'));

      await reorderSteps(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to reorder steps' });
    });
  });
});
