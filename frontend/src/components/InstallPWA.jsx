import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner on iOS if not already installed as standalone
    if (iosDevice && !window.navigator.standalone) {
      const dismissed = localStorage.getItem('skillbridge_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted SkillBridge PWA installation');
      }
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('skillbridge_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="glass-card p-4 rounded-2xl shadow-2xl border border-teal-500/40 bg-slate-900/95 text-white flex items-center gap-3 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-amber-500 flex items-center justify-center flex-shrink-0 text-white shadow-md">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Install SkillBridge App</h4>
          <p className="text-[11px] text-slate-300 mt-0.5 truncate">
            {isIOS 
              ? 'Tap Share icon & choose "Add to Home Screen"' 
              : 'Install on mobile home screen for 1-click access'}
          </p>
        </div>

        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-1 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Install
          </button>
        )}

        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
