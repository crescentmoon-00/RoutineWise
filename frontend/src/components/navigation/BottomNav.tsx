import { NavLink } from 'react-router-dom';
import { home, calendar, manage_accounts, settings } from '@/icons';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Home', icon: home },
  { path: '/schedules', label: 'Schedule', icon: calendar },
  { path: '/profiles', label: 'Profiles', icon: manage_accounts },
  { path: '/settings', label: 'Settings', icon: settings },
];

export const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-4 mb-4 max-w-md ml-auto mr-auto">
        <div className="bg-surface/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-4px_24px_rgba(25,27,34,0.06)] px-2 py-4">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-200
                  ${isActive
                    ? 'text-primary scale-100'
                    : 'text-on-surface-variant scale-90'
                  }
                `}
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
