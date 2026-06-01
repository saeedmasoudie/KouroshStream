import React from "react";
import { Link } from "react-router";
import { Play, Star } from "lucide-react";
import { Media } from "@/app/data/mockData";
import { useLanguage } from "@/app/context/LanguageContext";
import { ImageWithFallback } from "@/app/components/ui/ImageWithFallback";
import { motion as Motion } from "motion/react";
import { normalizeGenres, getQualityLabel } from "@/app/utils/helpers";
import { createMediaUrl } from "@/app/utils/urlUtils";

export const MediaCard: React.FC<{ item: Media }> = ({ item }) => {
  const { lang, t } = useLanguage();

  // Safety check - if no item, don't render
  if (!item || !item.title) {
    return null;
  }

  // Safely get quality label
  const qualityLabel = getQualityLabel(item.quality);
  
  // Safely get genres as array
  const genres = normalizeGenres(item.genres);
  const genresText = genres.length > 0
    ? genres.map(g => t(g)).join(', ')
    : '';

  // Get the appropriate title based on language
  const title = item.title[lang] || item.title.en || 'Untitled';
  
  // Create SEO-friendly URL
  const mediaUrl = createMediaUrl(item.type, item.id, title, lang, item.slug);

  return (
    <Motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col gap-3"
    >
      <Link to={mediaUrl} className="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-800">
        <ImageWithFallback
          src={item.poster}
          alt={item.title[lang] || item.title.en || 'Media'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
          </div>
        </div>
        {item.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            {item.rating}
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
            {qualityLabel}
          </span>
          {item.type === 'series' && (
            <>
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                {t('series')}
              </span>
              {item.status === 'ongoing' ? (
                <span className="bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                  {t('ongoing')}
                </span>
              ) : (
                <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                  {t('ended')}
                </span>
              )}
            </>
          )}
        </div>
      </Link>
      <div className="px-1">
        <h3 className="text-white font-semibold truncate group-hover:text-emerald-500 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {item.year || 'N/A'} {genresText && `• ${genresText}`}
        </p>
      </div>
    </Motion.div>
  );
};