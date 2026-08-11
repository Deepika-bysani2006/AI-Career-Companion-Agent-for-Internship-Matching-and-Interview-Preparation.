import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { PlatformBadge } from '../components/PlatformBadge';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
  FileText, Briefcase, Bookmark, Send, Bell, Sparkles, Target, ArrowUpRight, TrendingUp, CheckCircle, Clock
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartsRes, recJobsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/charts'),
          api.get('/jobs/recommendations')
        ]);
        setStats(statsRes.data);
        setCharts(chartsRes.data);
        setRecommendedJobs(recJobsRes.data.slice(0, 4));
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          
          {/* Welcome Header Banner */}
          <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={user?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"}
                  alt={user?.full_name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Welcome back, {user?.full_name || 'Candidate'}!
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Active AI Agent
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mt-1">
                    {user?.college || 'Engineering Institute'} • {user?.branch || 'Computer Science'}
                  </p>
                </div>
              </div>

              <Link
                to="/resumes/upload"
                className="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-amber-400 hover:opacity-95 shadow-md flex items-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4" /> Upload Resume
              </Link>
            </div>
          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card p-5 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATS Resume Score</span>
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {stats?.ats_score || 82.5}%
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                <TrendingUp className="w-3.5 h-3.5" /> +5.4% from last upload
              </span>
            </div>

            <div className="glass-card p-5 border-l-4 border-cyan-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Jobs</span>
                <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600">
                  <Send className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {stats?.applied_jobs || 12}
              </p>
              <span className="text-xs text-slate-500 mt-2 block">Tracked in application matrix</span>
            </div>

            <div className="glass-card p-5 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Internships</span>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <Bookmark className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {stats?.saved_jobs || 8}
              </p>
              <span className="text-xs text-slate-500 mt-2 block">Bookmarked opportunities</span>
            </div>

            <div className="glass-card p-5 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interview Readiness</span>
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {stats?.interview_prep_score || 88.0}%
              </p>
              <span className="text-xs text-slate-500 mt-2 block">Mock interview rating</span>
            </div>
          </div>

          {/* Recharts Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Monthly Applications Bar Chart */}
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                <span>Application Velocity</span>
                <span className="text-xs font-medium text-slate-400">Monthly breakdown</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.monthly_applications || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="applications" fill="#0D9488" radius={[4, 4, 0, 0]} name="Applications" />
                    <Bar dataKey="interviews" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Interviews Scheduled" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ATS Score Trend Line Chart */}
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                <span>ATS Resume Improvement Trend</span>
                <span className="text-xs font-medium text-slate-400">Score progress</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts?.ats_score_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="version" stroke="#94a3b8" />
                    <YAxis domain={[50, 100]} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="score" stroke="#00A8B5" strokeWidth={3} dot={{ r: 6 }} name="ATS Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommended Jobs Widget Section */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Recommended AI Jobs</h3>
                <p className="text-xs text-slate-500">Matched specifically against your parsed resume skills</p>
              </div>
              <Link to="/jobs" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                View All 300+ Jobs <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedJobs.map((job) => (
                <div key={job.job_id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <PlatformBadge platform={job.source_platform} />
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                        {job.match_score}% Match
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{job.job_title}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{job.company_name} • {job.location}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{job.salary_stipend}</span>
                    <Link
                      to={`/jobs/${job.job_id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-teal-600 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};
