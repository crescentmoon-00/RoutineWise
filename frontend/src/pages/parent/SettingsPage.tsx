import { useAuth } from '@/contexts/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black text-on-surface mb-2">
          Settings
        </h1>
        <p className="text-on-surface-variant">
          Manage your account and app preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-surface_container-lowest rounded-[1rem] p-6 mb-6 shadow-[0_20px_50px_rgba(47,92,155,0.1)]">
        <h2 className="text-xl font-bold text-on-surface mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary_container flex items-center justify-center text-white text-2xl font-black">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-bold text-on-surface">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary_container/30 rounded-full text-sm font-medium text-on-secondary-container">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          {user?.subscriptionTier === 'free' ? 'Free Tier' : 'Premium'}
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-surface_container-lowest rounded-[1rem] p-6 mb-6 shadow-[0_20px_50px_rgba(47,92,155,0.1)]">
        <h2 className="text-xl font-bold text-on-surface mb-4">Accessibility</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-on-surface">High Contrast Mode</p>
              <p className="text-sm text-on-surface-variant">Increase visual contrast</p>
            </div>
            <button className="w-14 h-8 bg-surface-container-highest rounded-full relative transition-colors">
              <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-on-surface">Reduced Motion</p>
              <p className="text-sm text-on-surface-variant">Minimize animations</p>
            </div>
            <button className="w-14 h-8 bg-primary rounded-full relative transition-colors">
              <span className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-surface_container-lowest rounded-[1rem] p-6 shadow-[0_20px_50px_rgba(47,92,155,0.1)]">
        <h2 className="text-xl font-bold text-on-surface mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary_container/40 flex items-center justify-center">
                <span>✓</span>
              </div>
              <div>
                <p className="font-medium text-on-surface">Routine Completions</p>
                <p className="text-sm text-on-surface-variant">When routines are finished</p>
              </div>
            </div>
            <button className="w-11 h-6 bg-primary rounded-full relative transition-colors">
              <span className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary_fixed/30 flex items-center justify-center">
                <span>💊</span>
              </div>
              <div>
                <p className="font-medium text-on-surface">Medication Reminders</p>
                <p className="text-sm text-on-surface-variant">Scheduled medication times</p>
              </div>
            </div>
            <button className="w-11 h-6 bg-primary rounded-full relative transition-colors">
              <span className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary_fixed/30 flex items-center justify-center">
                <span>🔔</span>
              </div>
              <div>
                <p className="font-medium text-on-surface">Community Updates</p>
                <p className="text-sm text-on-surface-variant">News and tips</p>
              </div>
            </div>
            <button className="w-11 h-6 bg-surface_container_high rounded-full relative transition-colors">
              <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
