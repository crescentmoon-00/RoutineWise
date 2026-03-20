import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { childService } from '@/services/childService';
import { arrow_back } from '@/icons';

export const ChildFormPage = () => {
  const navigate = useNavigate();
  const { childId } = useParams();
  const isEditing = !!childId;

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    avatar: '',
    status: 'active' as 'active' | 'transitioning',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && childId) {
      fetchChild();
    }
  }, [childId, isEditing]);

  const fetchChild = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const child = await childService.getChild(childId!);
      setFormData({
        name: child.name || '',
        dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : '',
        avatar: child.avatar || '',
        status: child.status || 'active',
        notes: child.notes || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load child profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      if (isEditing && childId) {
        await childService.updateChild(childId, formData);
      } else {
        await childService.createChild(formData);
      }

      navigate('/profiles');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to save child profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!childId || !confirm('Are you sure you want to delete this child profile? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await childService.deleteChild(childId);
      navigate('/profiles');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete child profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/profiles')}
          className="p-2 hover:bg-surface_container_low rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">{arrow_back}</span>
        </button>
        <div>
          <h1 className="text-3xl font-black text-on-surface">
            {isEditing ? 'Edit Profile' : 'Create Child Profile'}
          </h1>
          <p className="text-on-surface-variant">
            {isEditing ? 'Update child information' : 'Add a new child to your account'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error_container/30 text-error rounded-xl">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-surface_container-lowest rounded-[1rem] p-8 shadow-[0_20px_50px_rgba(47,92,155,0.1)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary_container flex items-center justify-center text-white text-3xl font-black overflow-hidden">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{formData.name.charAt(0) || '?'}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Profile Photo
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-4 py-2 bg-surface_container_low rounded-xl border border-outline_variant/20 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
              <p className="mt-1 text-xs text-on-surface-variant">
                Enter a URL for the child's photo
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Child's Name *
            </label>
            <input
              type="text"
              required
              placeholder="Enter child's name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-surface_container_low rounded-xl border border-outline_variant/20 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-surface_container_low rounded-xl border border-outline_variant/20 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Status
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'active' })}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                  formData.status === 'active'
                    ? 'bg-secondary_container text-on-secondary-container'
                    : 'bg-surface_container_low text-on-surface-variant hover:bg-surface_container'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'transitioning' })}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                  formData.status === 'transitioning'
                    ? 'bg-tertiary_fixed text-on-tertiary-fixed-variant'
                    : 'bg-surface_container_low text-on-surface-variant hover:bg-surface_container'
                }`}
              >
                Transitioning
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Notes
            </label>
            <textarea
              placeholder="Any additional notes about this child..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-surface_container_low rounded-xl border border-outline_variant/20 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="px-6 py-3 bg-error_container/30 text-error rounded-full font-bold hover:bg-error_container/50 transition-colors disabled:opacity-50"
              >
                Delete Profile
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={() => navigate('/profiles')}
                disabled={isLoading}
                className="px-6 py-3 bg-surface_container_low text-on-surface-variant rounded-full font-bold hover:bg-surface_container transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary_container transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
