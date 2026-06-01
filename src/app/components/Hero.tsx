import React from "react";
import { Play, Info, Star, Calendar } from "lucide-react";
import { Media } from "@/app/data/mockData";
import { useLanguage } from "@/app/context/LanguageContext";
import { Link } from "react-router";
import { ImageWithFallback } from "@/app/components/ui/ImageWithFallback";
import { normalizeGenres } from "@/app/utils/helpers";
import { createMediaUrl } from "@/app/utils/urlUtils";
import { motion } from "motion/react";

export const Hero: React.FC<{ item: Media }> = ({ item }) => {
  const { lang, t, dir } = useLanguage();

  if (!item) return null;

  const genres = normalizeGenres(item.genres);
  const genresText = genres.map(g => t(g)).join(' • ');
  const title = item.title[lang] || item.title.en || 'Untitled';
  const description = item.description?.[lang] || item.description?.en || '';
  const mediaUrl = createMediaUrl(item.type, item.id, title, lang, item.slug);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={item.backdrop || item.poster}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-${dir === 'rtl' ? 'left' : 'right'} from-slate-950/80 via-transparent to-transparent`} />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              {t("trending")}
            </span>
            {item.rating && (
              <div className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                {item.rating}
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-gray-300 mb-8 line-clamp-3 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={mediaUrl}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              {t("watchNow")}
            </Link>
            <Link
              to={mediaUrl}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              <Info className="w-5 h-5" />
              {t("details")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
