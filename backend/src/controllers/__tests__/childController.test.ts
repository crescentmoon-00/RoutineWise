import { Request, Response } from 'express';
import {
  createChild,
  getChildren,
  getChild,
  updateChild,
  deleteChild,
  switchChild,
} from '../childController';

// Mock the models module BEFORE importing
jest.mock('../../models', () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  Child: {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
  Routine: jest.fn(),
  ActivityLog: jest.fn(),
  Rule: jest.fn(),
}));

import { User, Child } from '../../models';
const mockUserModel = User as jest.Mocked<any>;
const mockChildModel = Child as jest.Mocked<any>;

describe('Child Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockChild: any;
  let mockUser: any;

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

    // Create a mock child object
    mockChild = {
      _id: '507f1f77bcf86cd799439012',
      parent: '507f1f77bcf86cd799439011',
      name: 'Test Child',
      dateOfBirth: new Date('2015-05-15'),
      avatar: 'avatar-url',
      status: 'active',
      notes: 'Test notes',
      routines: [],
      logs: [],
      rules: [],
      save: jest.fn().mockResolvedValue(true),
    };

    // Create a mock user object
    mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'parent@example.com',
      firstName: 'Parent',
      lastName: 'User',
      subscriptionTier: 'free',
      children: [],
    };

    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createChild', () => {
    it('should create a child successfully', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.body = {
        name: 'Test Child',
        dateOfBirth: '2015-05-15',
        avatar: 'avatar-url',
        status: 'active',
        notes: 'Test notes',
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockChildModel.countDocuments.mockResolvedValue(0);
      mockChildModel.create.mockResolvedValue(mockChild);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

      await createChild(mockReq as Request, mockRes as Response);

      expect(mockUserModel.findById).toHaveBeenCalledWith(mockUser._id);
      expect(mockChildModel.countDocuments).toHaveBeenCalledWith({ parent: mockUser._id });
      expect(mockChildModel.create).toHaveBeenCalledWith({
        parent: mockUser._id,
        name: 'Test Child',
        dateOfBirth: '2015-05-15',
        avatar: 'avatar-url',
        status: 'active',
        notes: 'Test notes',
      });
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, {
        $push: { children: mockChild._id },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Child profile created successfully',
        child: mockChild,
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.body = { name: 'Test Child' };

      await createChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
      expect(mockChildModel.create).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.body = { name: 'Test Child' };

      mockUserModel.findById.mockResolvedValue(null);

      await createChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 403 for free tier with existing child', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.body = { name: 'Test Child' };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockChildModel.countDocuments.mockResolvedValue(1);

      await createChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Free tier limited to 1 child profile. Upgrade to premium for unlimited children.',
      });
    });

    it('should allow premium users to create multiple children', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.body = { name: 'Second Child' };

      const premiumUser = { ...mockUser, subscriptionTier: 'premium' };
      mockUserModel.findById.mockResolvedValue(premiumUser);
      mockChildModel.countDocuments.mockResolvedValue(1);
      mockChildModel.create.mockResolvedValue(mockChild);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(premiumUser);

      await createChild(mockReq as Request, mockRes as Response);

      expect(mockChildModel.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.body = { name: 'Test Child' };

      mockUserModel.findById.mockRejectedValue(new Error('Database error'));

      await createChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create child profile' });
    });
  });

  describe('getChildren', () => {
    it('should get all children for authenticated user', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };

      mockChildModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      } as any);

      await getChildren(mockReq as Request, mockRes as Response);

      expect(mockChildModel.find).toHaveBeenCalledWith({ parent: mockUser._id });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;

      await getChildren(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };

      mockChildModel.find.mockImplementation(() => {
        throw new Error('Database error');
      });

      await getChildren(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch children' });
    });
  });

  describe('getChild', () => {
    it('should get a single child by ID', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: mockChild._id };

      // Create a mock query that chains three populate calls
      const thirdPopulate = {
        populate: jest.fn().mockResolvedValue(mockChild),
      };
      const secondPopulate = {
        populate: jest.fn().mockReturnValue(thirdPopulate),
      };
      const firstPopulate = {
        populate: jest.fn().mockReturnValue(secondPopulate),
      };

      mockChildModel.findOne.mockReturnValue(firstPopulate);

      await getChild(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockUser._id,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ child: mockChild });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };

      await getChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: 'nonexistent-id' };

      // Create a mock query that chains three populate calls and returns null
      const thirdPopulate = {
        populate: jest.fn().mockResolvedValue(null),
      };
      const secondPopulate = {
        populate: jest.fn().mockReturnValue(thirdPopulate),
      };
      const firstPopulate = {
        populate: jest.fn().mockReturnValue(secondPopulate),
      };

      mockChildModel.findOne.mockReturnValue(firstPopulate);

      await getChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });

      await getChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch child profile' });
    });
  });

  describe('updateChild', () => {
    it('should update a child successfully', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: mockChild._id };
      mockReq.body = {
        name: 'Updated Name',
        status: 'transitioning',
      };

      mockChildModel.findOne.mockResolvedValue(mockChild);

      await updateChild(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockUser._id,
      });
      expect(mockChild.name).toBe('Updated Name');
      expect(mockChild.status).toBe('transitioning');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Child profile updated successfully',
        child: mockChild,
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };
      mockReq.body = { name: 'Updated Name' };

      await updateChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: 'nonexistent-id' };
      mockReq.body = { name: 'Updated Name' };

      mockChildModel.findOne.mockResolvedValue(null);

      await updateChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: mockChild._id };
      mockReq.body = { name: 'Updated Name' };

      mockChildModel.findOne.mockRejectedValue(new Error('Database error'));

      await updateChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update child profile' });
    });
  });

  describe('deleteChild', () => {
    it('should delete a child successfully', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockResolvedValue(mockChild);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);
      mockChildModel.findByIdAndDelete.mockResolvedValue(mockChild);

      await deleteChild(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockUser._id,
      });
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, {
        $pull: { children: mockChild._id },
      });
      expect(mockChildModel.findByIdAndDelete).toHaveBeenCalledWith(mockChild._id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Child profile deleted successfully',
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };

      await deleteChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: 'nonexistent-id' };

      mockChildModel.findOne.mockResolvedValue(null);

      await deleteChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockRejectedValue(new Error('Database error'));

      await deleteChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete child profile' });
    });
  });

  describe('switchChild', () => {
    it('should switch to a child successfully', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockResolvedValue(mockChild);

      await switchChild(mockReq as Request, mockRes as Response);

      expect(mockChildModel.findOne).toHaveBeenCalledWith({
        _id: mockChild._id,
        parent: mockUser._id,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Switched to child successfully',
        child: mockChild,
      });
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.params = { childId: mockChild._id };

      await switchChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if child not found', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: 'nonexistent-id' };

      mockChildModel.findOne.mockResolvedValue(null);

      await switchChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Child profile not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.user = { userId: mockUser._id, email: mockUser.email };
      mockReq.params = { childId: mockChild._id };

      mockChildModel.findOne.mockRejectedValue(new Error('Database error'));

      await switchChild(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to switch child' });
    });
  });
});
