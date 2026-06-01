import React, { useState, useEffect } from "react";
import { Play, Info, Star } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { Link } from "react-router";
import { ImageWithFallback } from "@/app/components/ui/ImageWithFallback";
import { motion as Motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { normalizeGenres } from "@/app/utils/helpers";
import { createMediaUrl } from "@/app/utils/urlUtils";
import { Media } from "@/app/data/mockData";

export const Slideshow: React.FC<{ items: Media[] }> = ({ items }) => {
  const { lang, t, dir } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  // Safety check - if no items or current item is undefined, don't render
  if (!items || items.length === 0 || !items[currentIndex] || !items[currentIndex].title) {
    return null;
  }

  const item = items[currentIndex];
  const title = item.title[lang] || item.title.en || 'Untitled';
  const mediaUrl = createMediaUrl(item.type, item.id, title, lang, item.slug);

  return (
    <div className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <Motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={item.backdrop || item.poster}
            alt={item.title[lang] || item.title.en || 'Slideshow'}
            className="w-full h-full object-cover scale-110 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className={`absolute inset-0 bg-gradient-to-${dir === 'rtl' ? 'left' : 'right'} from-slate-950/80 via-transparent to-transparent`} />
        </Motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <Motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {t("trending")}
                </span>
                {item.rating && (
                  <div className="flex items-center gap-1 text-yellow-500 font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-md">
                    <Star className="w-4 h-4 fill-current" />
                    {item.rating}
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-6xl font-black text-white mb-4 leading-tight">
                {item.title[lang] || item.title.en || 'Untitled'}
              </h1>
              <p className="text-sm md:text-lg text-gray-300 mb-8 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-xl">
                {item.description?.[lang] || item.description?.en || ''}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={mediaUrl}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  {t("watchNow")}
                </Link>
                <Link
                  to={mediaUrl}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all"
                >
                  <Info className="w-4 h-4 md:w-5 md:h-5" />
                  {t("details")}
                </Link>
              </div>
            </Motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className={`absolute bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} flex gap-2`}>
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              currentIndex === idx ? "w-8 bg-emerald-600" : "w-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};