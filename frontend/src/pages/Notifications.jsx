import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Bell, CheckCheck, Trash2, Shield, Briefcase, Info } from 'lucide-react';
import api from '../utils/axios';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications/clear');
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Notification Center</h1>
              <p className="text-sm text-slate-500 mt-1">Real-time alerts for job matches, application updates, and interview schedules</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleMarkAllRead}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 glass-card hover:bg-slate-100 flex items-center gap-1.5"
              >
                <CheckCheck className="w-4 h-4 text-teal-500" /> Mark All Read
              </button>
              <button
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.notification_id}
                className={`glass-card p-5 border-l-4 ${n.is_read ? 'border-slate-300 dark:border-slate-700' : 'border-teal-500 bg-teal-50/20 dark:bg-teal-950/20'} flex items-start gap-4`}
              >
                <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 mt-0.5">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="glass-card p-12 text-center text-slate-500 text-sm">
                No active notifications.
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
