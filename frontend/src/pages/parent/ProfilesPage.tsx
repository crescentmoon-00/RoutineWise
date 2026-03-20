import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { childService } from '@/services/childService';
import { add, edit } from '@/icons';

interface Child {
  _id: string;
  name: string;
  dateOfBirth: string;
  avatar?: string;
  status: 'active' | 'transitioning';
  notes?: string;
}

export const ProfilesPage = () => {
  const navigate = useNavigate();
  const { setCurrentChild } = useApp();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const data = await childService.getChildren();
      setChildren(data);
    } catch (error) {
      console.error('Failed to fetch children:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleViewSchedule = (child: Child) => {
    setCurrentChild(child as any);
    navigate('/schedules');
  };

  const handleAddChild = () => {
    navigate('/profiles/new');
  };

  const handleEditChild = (childId: string) => {
    navigate(`/profiles/${childId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black text-on-surface mb-2">
          Child Profiles
        </h1>
        <p className="text-on-surface-variant">
          Manage your child profiles and their routines
        </p>
      </div>

      {/* Stats Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly Engagement Card */}
        <div className="bg-gradient-to-br from-primary to-primary_container rounded-[1rem] p-6 text-on-primary relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-sm text-on-primary/80 mb-2">Weekly Engagement</p>
            <p className="text-5xl font-black mb-2">85%</p>
            <p className="text-sm text-on-primary/90">Great consistency this week!</p>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="md:col-span-2 bg-surface_container_low rounded-[1rem] p-6">
          <h3 className="text-lg font-bold text-on-surface mb-4">Quick Insights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary_fixed_dim" />
              <span className="text-sm text-on-surface-variant">Routines: 4 active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary_fixed_dim" />
              <span className="text-sm text-on-surface-variant">Logs: 12 this week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-tertiary_fixed_dim" />
              <span className="text-sm text-on-surface-variant">Rules: 3 active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-error_container" />
              <span className="text-sm text-on-surface-variant">Alerts: 0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Profile Card */}
        <button
          onClick={handleAddChild}
          className="group relative bg-surface_container_low rounded-[2rem] p-8 border-2 border-dashed border-outline_variant/30 hover:border-primary/50 hover:bg-surface_container transition-all duration-200"
        >
          <div className="flex flex-col items-center justify-center min-h-[280px]">
            <div className="w-20 h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
              <span className="material-symbols-outlined text-4xl text-primary">{add}</span>
            </div>
            <p className="text-lg font-bold text-primary">Add New Profile</p>
            <p className="text-sm text-on-surface-variant mt-2">Create a profile for your child</p>
          </div>
        </button>

        {/* Child Profile Cards */}
        {children.map((child) => (
          <div
            key={child._id}
            className="bg-surface_container-lowest rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(47,92,155,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
          >
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-4">
              {/* Avatar */}
              <div className="relative">
                {child.avatar ? (
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary_container/30"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary_container flex items-center justify-center text-white text-3xl font-black">
                    {child.name.charAt(0)}
                  </div>
                )}

                {/* Status Badge */}
                <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-bold ${
                  child.status === 'active'
                    ? 'bg-secondary_container text-on-secondary-container'
                    : 'bg-tertiary_fixed text-on-tertiary-fixed-variant'
                }`}>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      {child.status === 'active' ? 'check_circle' : 'hourglass_empty'}
                    </span>
                    {child.status === 'active' ? 'Active' : 'Transitioning'}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => handleEditChild(child._id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-surface_container_low rounded-full transition-all"
              >
                <span className="material-symbols-outlined text-xl">{edit}</span>
              </button>
            </div>

            {/* Child Info */}
            <h3 className="text-2xl font-bold text-on-surface mb-1">{child.name}</h3>
            <p className="text-lg text-on-surface-variant mb-4">
              Age {calculateAge(child.dateOfBirth)}
            </p>

            {/* Notes Preview */}
            {child.notes && (
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
                {child.notes}
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleViewSchedule(child)}
                className="w-full py-3 px-4 bg-surface_container_high hover:bg-primary_fixed hover:text-on-primary rounded-full text-sm font-medium transition-all duration-200"
              >
                View Schedule
              </button>

              <button
                onClick={() => handleEditChild(child._id)}
                className="w-full py-3 px-4 bg-surface_container_low hover:bg-surface_container rounded-full text-sm font-medium text-on-surface-variant transition-all duration-200"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {children.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-surface_container_low rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-primary">{add}</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">No child profiles yet</h2>
          <p className="text-on-surface-variant mb-6 max-w-md mx-auto">
            Create your first child profile to start tracking routines and activities.
          </p>
          <button
            onClick={handleAddChild}
            className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary_container transition-colors"
          >
            Create Child Profile
          </button>
        </div>
      )}
    </div>
  );
};
