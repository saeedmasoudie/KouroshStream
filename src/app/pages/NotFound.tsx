import React from 'react';
import { Link } from 'react-router';
import { Home, Search, Film, Tv } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { motion as Motion } from 'motion/react';
import { SEO } from '@/app/components/SEO';

export const NotFound: React.FC = () => {
  const { lang } = useLanguage();

  const content = {
    en: {
      title: '404',
      subtitle: 'Page Not Found',
      message: "Oops! The page you're looking for doesn't exist or has been moved.",
      goHome: 'Go to Homepage',
      searchContent: 'Search Content',
      browseMovies: 'Browse Movies',
      browseSeries: 'Browse Series',
      suggestions: 'Popular Suggestions',
      suggestion1: 'Check the URL for typos',
      suggestion2: 'Go back to the previous page',
      suggestion3: 'Browse our latest content',
    },
    fa: {
      title: '۴۰۴',
      subtitle: 'صفحه پیدا نشد',
      message: 'اوه! صفحه‌ای که دنبالش می‌گردید وجود ندارد یا منتقل شده است.',
      goHome: 'برو به صفحه اصلی',
      searchContent: 'جستجوی محتوا',
      browseMovies: 'مرور فیلم‌ها',
      browseSeries: 'مرور سریال‌ها',
      suggestions: 'پیشنهادات محبوب',
      suggestion1: 'آدرس را برای اشتباه تایپی بررسی کنید',
      suggestion2: 'به صفحه قبلی برگردید',
      suggestion3: 'محتوای جدید ما را مرور کنید',
    },
  };

  const currentContent = content[lang];

  return (
    <>
      <SEO
        title={lang === 'en' ? '404 - Page Not Found | cinestream' : '۴۰۴ - صفحه پیدا نشد | گرین پیکسل'}
        description={lang === 'en' 
          ? 'The page you\'re looking for doesn\'t exist or has been moved. Return to cinestream homepage or search for movies and series.'
          : 'صفحه‌ای که دنبالش می‌گردید وجود ندارد یا منتقل شده است. به صفحه اصلی گرین پیکسل بازگردید یا برای فیلم و سریال جستجو کنید.'
        }
        lang={lang}
      />
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl w-full text-center">
          <Motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-[120px] md:text-[200px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 animate-pulse">
                {currentContent.title}
              </h1>
            </div>

            {/* Message */}
            <Motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                {currentContent.subtitle}
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {currentContent.message}
              </p>
            </Motion.div>

            {/* Action Buttons */}
            <Motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <Link
                to={`/${lang}`}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
              >
                <Home className="w-5 h-5" />
                {currentContent.goHome}
              </Link>
              <Link
                to={`/${lang}/search`}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/10 transition-all"
              >
                <Search className="w-5 h-5" />
                {currentContent.searchContent}
              </Link>
              <Link
                to={`/${lang}/movies`}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/10 transition-all"
              >
                <Film className="w-5 h-5" />
                {currentContent.browseMovies}
              </Link>
              <Link
                to={`/${lang}/series`}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/10 transition-all"
              >
                <Tv className="w-5 h-5" />
                {currentContent.browseSeries}
              </Link>
            </Motion.div>

            {/* Suggestions */}
            <Motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto"
            >
              <h3 className="text-white font-bold text-xl mb-6">
                {currentContent.suggestions}
              </h3>
              <ul className="space-y-3 text-gray-400 text-left">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{currentContent.suggestion1}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{currentContent.suggestion2}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{currentContent.suggestion3}</span>
                </li>
              </ul>
            </Motion.div>
          </Motion.div>
        </div>
      </div>
    </>
  );
};