import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Shield, Users, Briefcase, Building2, FileText, Activity, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../utils/axios';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleToggleUser = async (userId) => {
    try {
      await api.put(`/admin/user/${userId}/toggle-status`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_verified: !u.is_verified } : u))
      );
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
          <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-rose-600" />
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin System Panel</h1>
              </div>
              <p className="text-sm text-slate-500 mt-1">Platform administration, user management, and system telemetry</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              Admin Mode Active
            </span>
          </div>

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card p-5 border-l-4 border-rose-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
                <Users className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{stats?.total_users || users.length}</p>
            </div>

            <div className="glass-card p-5 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Jobs</span>
                <Briefcase className="w-5 h-5 text-teal-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{stats?.total_jobs || 300}</p>
            </div>

            <div className="glass-card p-5 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Companies</span>
                <Building2 className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{stats?.total_companies || 10}</p>
            </div>

            <div className="glass-card p-5 border-l-4 border-cyan-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Resumes Uploaded</span>
                <FileText className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{stats?.total_resumes_uploaded || 15}</p>
            </div>
          </div>

          {/* User Management Table */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">User Accounts Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">College</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{u.full_name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="py-3 px-4 uppercase font-bold text-teal-600">{u.role}</td>
                      <td className="py-3 px-4 text-slate-500">{u.college || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.is_verified ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}`}>
                          {u.is_verified ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          className="px-2.5 py-1 rounded text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
