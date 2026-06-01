import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/context/LanguageContext';
import { getCookie, setCookie } from '@/app/utils/cookies';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { lang } = useLanguage();

  const content = {
    en: {
      title: 'We use cookies',
      message:
        'We use cookies to improve your experience on our site, including saving your language preference and email for comments. By continuing to use this site, you accept our use of cookies.',
      accept: 'Accept',
      decline: 'Decline',
    },
    fa: {
      title: 'ما از کوکی استفاده می‌کنیم',
      message:
        'ما از کوکی برای بهبود تجربه شما در سایت استفاده می‌کنیم، از جمله ذخیره زبان و ایمیل شما برای نظرات. با ادامه استفاده از این سایت، شما استفاده ما از کوکی را می‌پذیرید.',
      accept: 'پذیرفتن',
      decline: 'رد کردن',
    },
  };

  const currentContent = content[lang];

  useEffect(() => {
    const consent = getCookie('cookie_consent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    setCookie('cookie_consent', 'accepted', 365);
    setIsVisible(false);
  };

  const handleDecline = () => {
    setCookie('cookie_consent', 'declined', 365);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-[200]"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-emerald-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-grow">
                <h3 className="text-white font-bold mb-2">{currentContent.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {currentContent.message}
                </p>
              </div>
              <button
                onClick={handleDecline}
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all"
              >
                {currentContent.accept}
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-4 rounded-xl border border-white/10 transition-all"
              >
                {currentContent.decline}
              </button>
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};