import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Have questions about SkillBridge AI Internship Agent? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Information</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Reach out to our support team for setup assistance, college partnerships, or technical inquiries.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Email Us</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">support@skillbridge.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Call Us</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">+91 (080) 4567-8900</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Location</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Tech Innovation Park, Bengaluru, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 mx-auto flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent!</h3>
                <p className="text-sm text-slate-500">Thank you for reaching out. Our team will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea required rows="4" placeholder="How can we help you?" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"></textarea>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
