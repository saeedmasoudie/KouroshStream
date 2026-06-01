import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export const DemoBanner: React.FC = () => {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('demo_banner_dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('demo_banner_dismissed', 'true');
    setIsDismissed(true);
  };

  if (isDismissed || !isVisible) return null;

  const text = {
    en: 'This is a demo template project - Not a real streaming website',
    fa: 'این یک پروژه نمونه است - نه یک وبسایت واقعی',
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Info className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-medium text-center flex-1">
            {text[lang]}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
