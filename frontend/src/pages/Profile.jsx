import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, GraduationCap, BookOpen, Save, Key, Trash2 } from 'lucide-react';
import api from '../utils/axios';

export const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [college, setCollege] = useState(user?.college || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [year, setYear] = useState(user?.year || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/user/profile', {
        full_name: fullName,
        phone,
        college,
        branch,
        year
      });
      updateUserProfile(res.data);
      setMsg('Profile details updated successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/change-password', {
        old_password: oldPassword,
        new_password: newPassword
      });
      setMsg('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile & Account Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your candidate identity, college information, and security credentials</p>
          </div>

          {msg && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold text-center dark:bg-teal-950/60 dark:border-teal-800 dark:text-teal-300">
              {msg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Profile Update Form */}
            <form onSubmit={handleUpdateProfile} className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" /> Candidate Information
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Profile Details
              </button>
            </form>

            {/* Security & Password */}
            <form onSubmit={handleChangePassword} className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" /> Security Credentials
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none"
                />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-teal-600 flex items-center justify-center gap-2">
                <Key className="w-4 h-4" /> Change Password
              </button>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
