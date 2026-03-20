import { Outlet } from 'react-router-dom';
import { SideNav } from '@/components/navigation/SideNav';
import { BottomNav } from '@/components/navigation/BottomNav';
import { TopAppBar } from '@/components/navigation/TopAppBar';

export const ParentLayout = () => {
  return (
    <div className="min-h-screen bg-surface md:pl-16 lg:pl-64 pb-24 md:pb-0">
      {/* Desktop Side Navigation */}
      <SideNav />

      {/* Mobile Top App Bar */}
      <TopAppBar />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Main Content Area */}
      <main className="md:ml-0 lg:ml-0 pt-16 md:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
