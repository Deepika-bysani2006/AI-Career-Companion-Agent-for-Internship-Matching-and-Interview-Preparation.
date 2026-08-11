import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import api from '../utils/axios';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md glass-card p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset Password</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your email to receive a password reset link</p>
          </div>

          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center font-bold">
                ✓
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                We sent a password reset link to <span className="font-bold">{email}</span>. Please check your inbox.
              </p>
              <Link to="/login" className="inline-block px-6 py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 text-sm">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Send className="w-4 h-4" /> Send Reset Link</>}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
