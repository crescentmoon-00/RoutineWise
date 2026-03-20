import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { home, calendar, manage_accounts, settings, help, logout, add } from '@/icons';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: home },
  { path: '/schedules', label: 'Schedules', icon: calendar },
  { path: '/profiles', label: 'Child Profiles', icon: manage_accounts },
  { path: '/settings', label: 'Settings', icon: settings },
];

export const SideNav = () => {
  const { logout: handleLogout } = useAuth();

  const handleLogoutClick = async () => {
    await handleLogout();
    window.location.href = '/login';
  };

  return (
    <nav className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-16 lg:w-64 bg-surface border-r border-outline_variant/20 z-40">
      {/* Logo Section */}
      <div className="p-4 lg:p-6 border-b border-outline_variant/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary_container rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-lg">R</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="font-black text-primary text-lg">RoutineWise</h1>
            <p className="text-xs text-on-surface-variant">Parent Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-2 lg:px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-full transition-all duration-200
              ${isActive
                ? 'bg-primary_container/20 text-primary font-medium'
                : 'text-on-surface-variant hover:bg-surface_container_low hover:text-on-surface'
              }
            `}
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="hidden lg:block">{item.label}</span>
          </NavLink>
        ))}

        {/* Add Child CTA */}
        <NavLink
          to="/profiles/new"
          className="flex items-center gap-3 px-3 py-3 mt-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-2xl">{add}</span>
          <span className="hidden lg:block font-medium">Add Child</span>
        </NavLink>
      </div>

      {/* Bottom Section - Help & Logout */}
      <div className="p-2 lg:p-4 border-t border-outline_variant/20 space-y-1">
        <button
          className="w-full flex items-center gap-3 px-3 py-3 rounded-full text-on-surface-variant hover:bg-surface_container_low hover:text-on-surface transition-all duration-200"
        >
          <span className="material-symbols-outlined text-2xl">{help}</span>
          <span className="hidden lg:block">Help</span>
        </button>

        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-full text-on-surface-variant hover:bg-error_container/20 hover:text-error transition-all duration-200"
        >
          <span className="material-symbols-outlined text-2xl">{logout}</span>
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </nav>
  );
};
