import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Upload, FileText, CheckCircle, AlertTriangle, Sparkles, Download, RefreshCw } from 'lucide-react';
import api from '../utils/axios';

export const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedResult, setParsedResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF or DOCX file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(60);
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadProgress(100);
      setParsedResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Resume upload and parsing failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Resume Upload & Parser</h1>
            <p className="text-sm text-slate-500 mt-1">Upload your resume in PDF or DOCX format (Max 10MB) for instant ATS evaluation</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Upload Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="glass-card p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Drag & Drop Resume File Here</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Supported Formats: PDF, DOCX (Up to 10MB)</p>

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              id="resume-input"
              className="hidden"
            />
            <label
              htmlFor="resume-input"
              className="inline-block px-6 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              Browse Local File
            </label>

            {file && (
              <div className="mt-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 inline-flex items-center gap-3 text-sm font-semibold text-teal-800 dark:text-teal-200">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          {file && !parsedResult && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-amber-500 hover:opacity-95 shadow-lg flex items-center justify-center gap-2"
            >
              {uploading ? (
                <span>Parsing with AI Engine ({uploadProgress}%)...</span>
              ) : (
                <><Sparkles className="w-5 h-5" /> Execute AI Resume Parser</>
              )}
            </button>
          )}

          {/* Parsed Result Display */}
          {parsedResult && (
            <div className="space-y-6">
              <div className="glass-card p-6 border-l-4 border-teal-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-teal-500" /> Resume Parsed Successfully
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Calculated ATS Compatibility Score</p>
                </div>

                <div className="text-center bg-teal-50 dark:bg-teal-950/60 p-3 rounded-2xl border border-teal-200 dark:border-teal-800 min-w-[120px]">
                  <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                    {parsedResult.ats_score}%
                  </span>
                  <span className="block text-[10px] font-bold uppercase text-slate-400">ATS Rating</span>
                </div>
              </div>

              {/* Extracted Skills Badges */}
              <div className="glass-card p-6">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">Extracted Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {parsedResult.parsed_data.skills?.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
