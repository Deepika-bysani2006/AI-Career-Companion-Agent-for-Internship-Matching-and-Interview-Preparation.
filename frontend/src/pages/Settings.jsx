import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Settings as SettingsIcon, Bell, Shield, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Settings & Preferences</h1>
            <p className="text-sm text-slate-500 mt-1">Configure theme preferences and notification delivery channels</p>
          </div>

          <div className="glass-card p-6 space-y-6 max-w-2xl">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dark Theme Interface</h4>
                <p className="text-xs text-slate-500">Toggle dark mode visual preference</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  darkMode ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {darkMode ? 'Dark Mode On' : 'Light Mode On'}
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Email Digest Alerts</h4>
                <p className="text-xs text-slate-500">Receive weekly career digest and interview reminders</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">New Job Match Notifications</h4>
                <p className="text-xs text-slate-500">Instant notification when a job matches above 85% score</p>
              </div>
              <input
                type="checkbox"
                checked={jobAlerts}
                onChange={(e) => setJobAlerts(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
