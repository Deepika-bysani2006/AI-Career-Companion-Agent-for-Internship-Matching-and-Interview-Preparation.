import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { PlatformBadge } from '../components/PlatformBadge';
import { Search, Filter, Bookmark, ExternalLink, Sparkles, MapPin, Building2, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

export const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const platforms = ['All', 'LinkedIn', 'Naukri', 'Unstop', 'Internshala', 'Indeed', 'Google', 'Microsoft', 'IBM', 'Amazon'];

  const fetchJobs = async (currentSearch = search, currentSource = source) => {
    setLoading(true);
    try {
      const res = await api.get('/jobs', {
        params: {
          search: currentSearch || undefined,
          source: currentSource === 'All' ? undefined : currentSource,
          job_type: jobType === 'All' ? undefined : jobType,
          remote_only: remoteOnly
        }
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Job search fetch error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(search, source);
  }, [source, jobType, remoteOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(search, source);
  };

  const handlePlatformClick = (platform) => {
    setSource(platform);
    fetchJobs(search, platform);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Job Search & Mock Scraper Engine</h1>
            <p className="text-sm text-slate-500 mt-1">Search over 1,000 active internships across LinkedIn, Naukri, Unstop & Internshala</p>
          </div>

          {/* Search & Filters Bar */}
          <div className="glass-card p-4 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by job title, company name, or technology (e.g. Python, React, IBM)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 text-sm flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
              
              {/* Platform Source Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-400 uppercase mr-1">Platform Source:</span>
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePlatformClick(p)}
                    className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                      source === p
                        ? 'bg-slate-900 text-white dark:bg-teal-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  Remote Only
                </label>
              </div>
            </div>
          </div>

          {/* Job List */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-slate-500 mt-4">Querying 1000+ PostgreSQL listings...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">SHOWING {jobs.length} LISTINGS</p>
              
              {jobs.map((job) => (
                <div key={job.job_id} className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-teal-500/50 transition-colors">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <PlatformBadge platform={job.source_platform} />
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {job.job_type || job.work_mode}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      <Link to={`/jobs/${job.job_id}`} className="hover:text-teal-600 transition-colors">
                        {job.job_title}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company_name}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{job.salary_stipend}</span>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.required_skills?.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/40">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <Link
                      to={`/jobs/${job.job_id}`}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-slate-900 dark:bg-slate-800 hover:bg-teal-600 transition-colors text-center"
                    >
                      View Job Details
                    </Link>

                    <a
                      href={job.apply_url || job.application_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
                    >
                      Apply <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
