import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Upload,
  Search,
  FileCheck,
  Edit,
  Briefcase,
  Bookmark,
  Send,
  Video,
  Target,
  MapPin,
  MessageSquare,
  Bell,
  Settings,
  Shield,
  User
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Resume Upload', path: '/resumes/upload', icon: Upload },
    { label: 'Resume Analysis', path: '/resumes/analysis', icon: Search },
    { label: 'Resume Builder', path: '/resume-builder', icon: FileCheck },
    { label: 'Cover Letter Builder', path: '/cover-letter', icon: Edit },
    { label: 'AI Job Search', path: '/jobs', icon: Briefcase },
    { label: 'Saved Jobs', path: '/jobs/saved', icon: Bookmark },
    { label: 'Applications', path: '/applications', icon: Send },
    { label: 'Mock Interview Prep', path: '/interview', icon: Video },
    { label: 'Skill Gap Analysis', path: '/skill-gap', icon: Target },
    { label: 'Learning Roadmap', path: '/roadmap', icon: MapPin },
    { label: 'AI Career Chatbot', path: '/ai-chat', icon: MessageSquare },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile & Account', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
      {/* User Quick Info */}
      <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
        <img
          src={user?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
          alt={user?.full_name}
          className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.full_name || 'Candidate'}</h4>
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-teal-700 bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 rounded-md capitalize">
            {user?.role || 'Student'}
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="space-y-1 flex-1">
        <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Career Core Modules
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border border-teal-200/60 dark:border-teal-800/60 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Admin Navigation link if admin role */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="px-3 text-[11px] font-bold text-rose-500 uppercase tracking-wider mb-2">
              System Control
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 border border-rose-200'
                    : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                }`
              }
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};
