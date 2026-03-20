import { useAuth } from '@/contexts/AuthContext';
import { notifications, account_circle, logout as logoutIcon, settings } from '@/icons';
import { useState } from 'react';

export const TopAppBar = () => {
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogoutClick = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-xl z-30 px-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary_container rounded-lg flex items-center justify-center">
          <span className="text-white font-black text-sm">R</span>
        </div>
        <div>
          <h1 className="font-black text-primary text-sm">RoutineWise</h1>
        </div>
      </div>

      {/* Profile Switcher (simplified for mobile) */}
      <button
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface_container_high text-on-surface"
      >
        <span className="text-sm font-medium">
          {user?.firstName || 'Parent'}
        </span>
        <span className="material-symbols-outlined">{account_circle}</span>
      </button>

      {/* Profile Dropdown Menu */}
      {profileMenuOpen && (
        <div className="fixed top-16 right-4 left-4 bg-surface-container-lowest rounded-xl shadow-lg border border-outline_variant/20 py-2 z-50">
          <div className="px-4 py-2 border-b border-outline_variant/20">
            <p className="text-sm font-medium text-on-surface">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-on-surface-variant">{user?.email}</p>
          </div>

          <button className="w-full px-4 py-2 text-left text-sm text-on-surface-variant hover:bg-surface_container_low flex items-center gap-2">
            <span className="material-symbols-outlined">{notifications}</span>
            Notifications
          </button>

          <button className="w-full px-4 py-2 text-left text-sm text-on-surface-variant hover:bg-surface_container_low flex items-center gap-2">
            <span className="material-symbols-outlined">{settings}</span>
            Settings
          </button>

          <button
            onClick={handleLogoutClick}
            className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error_container/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">{logoutIcon}</span>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};
