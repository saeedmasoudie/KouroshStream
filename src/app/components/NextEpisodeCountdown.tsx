import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { motion as Motion } from 'motion/react';

interface NextEpisodeCountdownProps {
  releaseDayOfWeek: number | null; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  releaseTime?: string | null; // Format: "HH:MM" (24-hour format)
  status?: string;
}

export const NextEpisodeCountdown: React.FC<NextEpisodeCountdownProps> = ({ 
  releaseDayOfWeek, 
  releaseTime = '00:00',
  status 
}) => {
  const { lang, t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [nextEpisodeDate, setNextEpisodeDate] = useState<Date | null>(null);

  // Calculate next episode date based on day of week and time
  const calculateNextEpisodeDate = (dayOfWeek: number, time: string = '00:00'): Date => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    // Get current day of week (0 = Sunday)
    const currentDay = now.getDay();
    
    // Calculate days until next release
    let daysUntilRelease = dayOfWeek - currentDay;
    
    if (daysUntilRelease < 0) {
      // Release day has passed this week, target next week
      daysUntilRelease += 7;
    } else if (daysUntilRelease === 0) {
      // Release is today, check if time has passed
      const releaseDateTime = new Date(now);
      releaseDateTime.setHours(hours, minutes, 0, 0);
      
      if (now >= releaseDateTime) {
        // Time has passed, target next week
        daysUntilRelease = 7;
      }
    }
    
    // Create the next episode date
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntilRelease);
    nextDate.setHours(hours, minutes, 0, 0);
    
    return nextDate;
  };

  useEffect(() => {
    if (releaseDayOfWeek === null || releaseDayOfWeek === undefined || status !== 'ongoing') {
      return;
    }

    // Calculate the next episode date
    const nextDate = calculateNextEpisodeDate(releaseDayOfWeek, releaseTime || '00:00');
    setNextEpisodeDate(nextDate);

    const calculateTimeLeft = () => {
      const difference = nextDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        return;
      }

      setIsExpired(false);
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [releaseDayOfWeek, releaseTime, status]);

  if (releaseDayOfWeek === null || releaseDayOfWeek === undefined || status !== 'ongoing') {
    return null;
  }

  if (isExpired) {
    return (
      <Motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-yellow-500" />
          <p className="text-lg font-bold text-yellow-400">
            {lang === 'en' ? 'New episode should be available now! Check back soon.' : 'قسمت جدید باید اکنون در دسترس باشد! به زودی بررسی کنید.'}
          </p>
        </div>
      </Motion.div>
    );
  }

  if (!timeLeft || !nextEpisodeDate) {
    return null;
  }

  // Day names for display
  const dayNames = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    fa: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه']
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-600/30 rounded-2xl p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {lang === 'en' ? 'Next Episode Releases In' : 'قسمت بعدی منتشر می‌شود در'}
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-4 text-center">
          <div className="text-xl sm:text-3xl font-bold text-emerald-400 mb-1">
            {timeLeft.days}
          </div>
          <div className="text-[10px] sm:text-sm text-gray-400 truncate">
            {lang === 'en' ? 'Days' : 'روز'}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-4 text-center">
          <div className="text-xl sm:text-3xl font-bold text-emerald-400 mb-1">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-sm text-gray-400 truncate">
            {lang === 'en' ? 'Hours' : 'ساعت'}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-4 text-center">
          <div className="text-xl sm:text-3xl font-bold text-emerald-400 mb-1">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-sm text-gray-400 truncate">
            {lang === 'en' ? 'Mins' : 'دقیقه'}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-4 text-center">
          <div className="text-xl sm:text-3xl font-bold text-emerald-400 mb-1">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-sm text-gray-400 truncate">
            {lang === 'en' ? 'Secs' : 'ثانیه'}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        {lang === 'en' ? 'New episodes release every' : 'قسمت‌های جدید هر'} {' '}
        <span className="text-emerald-400 font-medium">
          {dayNames[lang as 'en' | 'fa'][releaseDayOfWeek]}
        </span>
        {releaseTime && releaseTime !== '00:00' && (
          <>
            {' '}{lang === 'en' ? 'at' : 'در ساعت'}{' '}
            <span className="text-emerald-400 font-medium">{releaseTime}</span>
          </>
        )}
      </div>

      <div className="mt-2 text-center text-xs text-gray-500">
        {lang === 'en' ? 'Next Episode' : 'قسمت بعدی'}: {' '}
        <span className="text-emerald-400">
          {nextEpisodeDate.toLocaleString(lang === 'en' ? 'en-US' : 'fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </Motion.div>
  );
};