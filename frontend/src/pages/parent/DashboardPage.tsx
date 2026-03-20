import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useEffect, useState } from 'react';
import { home, schedule, bed, restaurant, sentiment_satisfied, add } from '@/icons';

interface QuickLog {
  type: 'sleep' | 'mood' | 'food' | 'medication';
  title: string;
  icon: string;
  emoji: string;
  bgColor: string;
}

const quickLogs: QuickLog[] = [
  { type: 'sleep', title: 'Sleep', icon: bed, emoji: '🛏️', bgColor: 'bg-primary_fixed/20 hover:bg-primary_fixed/40' },
  { type: 'mood', title: 'Mood', icon: sentiment_satisfied, emoji: '😊', bgColor: 'bg-tertiary_fixed/20 hover:bg-tertiary_fixed/40' },
  { type: 'food', title: 'Food', icon: restaurant, emoji: '🍽️', bgColor: 'bg-secondary_container/40 hover:bg-secondary_container/60' },
  { type: 'medication', title: 'Medication', icon: 'medication', emoji: '💊', bgColor: 'bg-error_container/30 hover:bg-error_container/50' },
];

export const DashboardPage = () => {
  const { user } = useAuth();
  const { currentChild, setCurrentChild } = useApp();
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    // Fetch children when component mounts
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_BASE}/children`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setChildren(data.children || []);
          if (data.children?.length > 0 && !currentChild) {
            setCurrentChild(data.children[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch children:', error);
      }
    };

    fetchChildren();
  }, [currentChild, setCurrentChild]);

  const handleQuickLog = (type: string) => {
    console.log('Quick log:', type);
    // TODO: Implement quick log modal or navigation
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black text-on-surface mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-on-surface-variant">
          {currentChild
            ? `Here's what's happening with ${currentChild.name} today`
            : 'Add a child profile to get started'}
        </p>
      </div>

      {/* Profile Selector (Desktop) */}
      {children.length > 0 && (
        <div className="hidden md:block mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface_container_high rounded-full">
            <span className="text-sm text-on-surface-variant">Viewing:</span>
            <select
              value={currentChild?._id || ''}
              onChange={(e) => {
                const child = children.find(c => c._id === e.target.value);
                if (child) setCurrentChild(child);
              }}
              className="bg-transparent text-sm font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {currentChild ? (
        <>
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Schedule Adherence Card (8 cols = spans 2 on lg grid) */}
            <div className="lg:col-span-2 bg-surface_container-lowest rounded-[1rem] p-6 shadow-[0_20px_50px_rgba(47,92,155,0.1)] hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-on-surface mb-4">Schedule Adherence</h3>
              <div className="flex items-center gap-6">
                {/* Circular Progress */}
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-surface_container_low" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-primary" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-primary">75%</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-sm text-on-surface-variant">Completed Today</p>
                    <p className="text-2xl font-bold text-on-surface">6/8</p>
                  </div>
                  <div className="h-2 bg-surface_container_low rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-xs text-on-surface-variant">Great progress! Keep it up.</p>
                </div>
              </div>
            </div>

            {/* Current Task Focus Card (4 cols) */}
            <div className="bg-gradient-to-br from-primary to-primary_container rounded-[1rem] p-6 shadow-lg text-on-primary relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
              {/* Background decoration */}
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <div className="relative">
                <p className="text-sm text-on-primary/80 mb-2">Current Task</p>
                <h3 className="text-xl font-bold mb-3">Brush Teeth</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🦷</span>
                  <span className="text-sm">Morning Routine • Step 3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-primary/80">Started 5 min ago</span>
                  <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-bold transition-colors">
                    Complete
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Logs Section (12 cols = full width on mobile) */}
            <div className="lg:col-span-1 bg-surface_container-lowest rounded-[1rem] p-6 shadow-[0_20px_50px_rgba(47,92,155,0.1)]">
              <h3 className="text-lg font-bold text-on-surface mb-4">Quick Log</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickLogs.map((log) => (
                  <button
                    key={log.type}
                    onClick={() => handleQuickLog(log.type)}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center gap-2
                      ${log.bgColor} transition-all duration-200 hover:scale-105 active:scale-95
                    `}
                  >
                    <span className="text-3xl">{log.emoji}</span>
                    <span className="text-xs font-medium text-on-surface">{log.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Logs Section (12 cols = full width below) */}
            <div className="md:col-span-2 bg-surface_container-lowest rounded-[1rem] p-6 shadow-[0_20px_50px_rgba(47,92,155,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-on-surface">Recent Logs</h3>
                <button className="text-sm text-primary hover:text-primary_container transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {/* Sleep Log */}
                <div className="flex items-center gap-3 p-3 bg-surface_container_low rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary_fixed/30 flex items-center justify-center text-xl">
                    🛏️
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">Sleep - Good Quality</p>
                    <p className="text-xs text-on-surface-variant">Today, 7:30 AM • 9 hours</p>
                  </div>
                </div>

                {/* Mood Log */}
                <div className="flex items-center gap-3 p-3 bg-surface_container_low rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-tertiary_fixed/30 flex items-center justify-center text-xl">
                    😊
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">Mood - Happy & Calm</p>
                    <p className="text-xs text-on-surface-variant">Yesterday, 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Events Section (12 cols) */}
            <div className="md:col-span-2 bg-surface_container-lowest rounded-[1rem] p-6 shadow-[0_20px_50px_rgba(47,92,155,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-on-surface">Up Next</h3>
                <a href="#" className="text-sm text-primary hover:text-primary_container transition-colors">
                  Full Schedule
                </a>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 text-sm text-on-surface-variant font-medium">8:00 AM</div>
                  <div className="flex-1 p-3 bg-surface_container_low rounded-xl flex items-center gap-3">
                    <span className="text-xl">🥣</span>
                    <div>
                      <p className="text-sm font-medium text-on-surface">Breakfast</p>
                      <p className="text-xs text-on-surface-variant">30 min</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 text-sm text-on-surface-variant font-medium">8:30 AM</div>
                  <div className="flex-1 p-3 bg-surface_container_low rounded-xl flex items-center gap-3">
                    <span className="text-xl">👕</span>
                    <div>
                      <p className="text-sm font-medium text-on-surface">Get Dressed</p>
                      <p className="text-xs text-on-surface-variant">15 min</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 text-sm text-on-surface-variant font-medium">9:00 AM</div>
                  <div className="flex-1 p-3 bg-primary_container/20 rounded-xl flex items-center gap-3 border-l-4 border-primary">
                    <span className="text-xl">🎒</span>
                    <div>
                      <p className="text-sm font-medium text-primary">Pack Backpack</p>
                      <p className="text-xs text-on-surface-variant">10 min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Empty State - No Children */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-surface_container_low rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-primary">{add}</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">No child profiles yet</h2>
          <p className="text-on-surface-variant mb-6 max-w-md mx-auto">
            Create your first child profile to start tracking routines and activities.
          </p>
          <button className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary_container transition-colors">
            Create Child Profile
          </button>
        </div>
      )}
    </div>
  );
};
