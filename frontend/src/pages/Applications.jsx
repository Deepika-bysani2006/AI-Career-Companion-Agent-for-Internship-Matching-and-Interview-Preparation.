import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Send, Clock, CheckCircle2 } from 'lucide-react';
import api from '../utils/axios';

export const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/jobs/user/applications');
        setApps(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Tracked Applications</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor submitted internship applications and status milestones</p>
          </div>

          <div className="space-y-4">
            {apps.map((app) => (
              <div key={app.application_id} className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                    {app.status}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{app.job_title}</h3>
                  <p className="text-xs text-slate-500">{app.company_name}</p>
                </div>

                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Applied on {new Date(app.applied_at).toLocaleDateString()}
                </span>
              </div>
            ))}

            {apps.length === 0 && (
              <div className="glass-card p-12 text-center text-slate-500 text-sm">
                No active applications logged yet. Click "Apply" on any job in Job Search to log progress.
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
