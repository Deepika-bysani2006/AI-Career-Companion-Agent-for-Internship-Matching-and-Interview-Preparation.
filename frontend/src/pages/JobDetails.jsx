import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { PlatformBadge } from '../components/PlatformBadge';
import { MapPin, Building2, ExternalLink, Bookmark, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '../utils/axios';

export const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Job Search
          </Link>

          <div className="glass-card p-8 border-l-4 border-teal-500 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <PlatformBadge platform={job.source_platform} />
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{job.job_title}</h1>
                <p className="text-sm font-semibold text-slate-500">{job.company_name} • {job.location}</p>
              </div>

              <a
                href={job.application_url}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-amber-500 hover:opacity-95 shadow-lg flex items-center justify-center gap-2"
              >
                Apply on Official Site <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase block">Job Type</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.job_type}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block">Stipend / Salary</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{job.salary_stipend}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block">Experience</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.experience_required}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block">Deadline</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.last_date}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Job Description</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{job.job_description}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Required Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.required_skills?.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
