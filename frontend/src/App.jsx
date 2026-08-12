import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { InstallPWA } from './components/InstallPWA';

// Public Pages
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

// Protected Student Pages
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { ResumeUpload } from './pages/ResumeUpload';
import { ResumeAnalysis } from './pages/ResumeAnalysis';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { CoverLetterBuilder } from './pages/CoverLetterBuilder';
import { JobSearch } from './pages/JobSearch';
import { JobDetails } from './pages/JobDetails';
import { SavedJobs } from './pages/SavedJobs';
import { Applications } from './pages/Applications';
import { InterviewPrep } from './pages/InterviewPrep';
import { SkillGapAnalysis } from './pages/SkillGapAnalysis';
import { LearningRoadmap } from './pages/LearningRoadmap';
import { AIChatAssistant } from './pages/AIChatAssistant';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';

// Protected Admin Page
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/resumes/upload" element={<ResumeUpload />} />
              <Route path="/resumes/analysis" element={<ResumeAnalysis />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/cover-letter" element={<CoverLetterBuilder />} />
              <Route path="/jobs" element={<JobSearch />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/jobs/saved" element={<SavedJobs />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/interview" element={<InterviewPrep />} />
              <Route path="/skill-gap" element={<SkillGapAnalysis />} />
              <Route path="/roadmap" element={<LearningRoadmap />} />
              <Route path="/ai-chat" element={<AIChatAssistant />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Admin Route */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
          <InstallPWA />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
