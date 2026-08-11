import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { BookmarkCheck, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

export const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get('/jobs/user/saved');
        setSavedJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Bookmarked & Saved Internships</h1>
            <p className="text-sm text-slate-500 mt-1">Review saved positions and quickly submit official applications</p>
          </div>

          <div className="space-y-4">
            {savedJobs.map((item) => (
              <div key={item.saved_id} className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    <Link to={`/jobs/${item.job_id}`} className="hover:text-teal-600">
                      {item.job_title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500">{item.company_name} • {item.location}</p>
                </div>

                <a
                  href={item.application_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 flex items-center gap-1.5"
                >
                  Apply Now <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}

            {savedJobs.length === 0 && (
              <div className="glass-card p-12 text-center text-slate-500 text-sm">
                No bookmarked jobs yet. Explore <Link to="/jobs" className="text-teal-600 font-bold">AI Job Search</Link> to save internships!
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
