import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/context/LanguageContext';

export const OfflineDetector: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { lang } = useLanguage();

  const content = {
    en: {
      offline: 'You are offline',
      offlineMessage: 'Please check your internet connection',
      online: 'Back online',
      onlineMessage: 'Your connection has been restored',
    },
    fa: {
      offline: 'شما آفلاین هستید',
      offlineMessage: 'لطفاً اتصال اینترنت خود را بررسی کنید',
      online: 'آنلاین شدید',
      onlineMessage: 'اتصال شما برقرار شد',
    },
  };

  const currentContent = content[lang];

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success(currentContent.online, {
        description: currentContent.onlineMessage,
        icon: <Wifi className="w-5 h-5 text-emerald-500" />,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error(currentContent.offline, {
        description: currentContent.offlineMessage,
        icon: <WifiOff className="w-5 h-5" />,
        duration: Infinity, // Keep showing until back online
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lang, currentContent]);

  return null; // This component doesn't render anything
};
