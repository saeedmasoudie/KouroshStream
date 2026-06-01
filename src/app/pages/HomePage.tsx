import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { motion as Motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { HeroSkeleton, ContentSectionSkeleton } from "@/app/components/SkeletonLoader";
import { apiService } from "@/app/config/api";
import { EmptyState } from "@/app/components/EmptyState";
import { Slideshow } from "@/app/components/Slideshow";
import { MediaCard } from "@/app/components/MediaCard";
import { SEO } from "@/app/components/SEO";

export const HomePage: React.FC = () => {
  const { t, dir, lang } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [homepageData, setHomepageData] = useState<{
    featured: any[];
    newestMovies: any[];
    newestSeries: any[];
    trending: any[];
  }>({
    featured: [],
    newestMovies: [],
    newestSeries: [],
    trending: [],
  });
  
  // Fetch Homepage Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getHomepageData();
        
        setHomepageData({
          featured: data.featured || [],
          newestMovies: data.newestMovies || [],
          newestSeries: data.newestSeries || [],
          trending: data.trending || [],
        });
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
        // Show empty arrays on error
        setHomepageData({
          featured: [],
          newestMovies: [],
          newestSeries: [],
          trending: [],
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="pb-20">
        <HeroSkeleton />
        <ContentSectionSkeleton />
        <ContentSectionSkeleton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContentSectionSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <SEO
        title={lang === 'en' ? 'cinestream - Watch Online Free & Download Safe Full Movies' : 'گرین پیکسل - تماشای آنلاین رایگان و دانلود امن فیلم و سریال بدون سانسور'}
        description={lang === 'en' 
          ? 'Discover safe links for free online streaming and full movie downloads. 100% virus-free experience with soft subtitles you can disable anytime. Highest quality available.'
          : 'بهترین مرجع تماشای آنلاین و دانلود رایگان فیلم و سریال بدون سانسور با لینک مستقیم. لینک‌های امن و بدون ویروس، زیرنویس چسبیده (سافت‌ساب) قابل غیرفعال کردن و نسخه کامل.'
        }
        keywords={lang === 'en'
          ? 'free movies, watch online free, download movies safe, full movies, no virus movies, soft subtitles, cinestream, latest tv series'
          : 'دانلود فیلم رایگان, تماشای آنلاین فیلم, فیلم بدون سانسور, دانلود سریال جدید, لینک امن, زیرنویس سافت ساب, نسخه کامل فیلم, گرین پیکسل'
        }
        lang={lang}
        isHomePage={true}
        canonicalUrl={`https://cinestream.com/${lang}`}
        alternateUrls={[
          { lang: 'en', url: 'https://cinestream.com/en' },
          { lang: 'fa', url: 'https://cinestream.com/fa' }
        ]}
      />
      <Slideshow items={homepageData.featured} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-20">
        {/* Newest Movies */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-8 bg-emerald-600 rounded-full" />
              {t("newest")} {t("movies")}
            </h2>
            <Link to="/movies" className="text-emerald-500 text-sm font-bold hover:gap-2 transition-all flex items-center gap-1 group">
              {t("watchNow")}
              <ChevronRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
            </Link>
          </div>
          {homepageData.newestMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {homepageData.newestMovies.map((item, index) => (
                <Motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MediaCard item={item} />
                </Motion.div>
              ))}
            </div>
          ) : (
            <EmptyState message={t("noResults") || "No movies available yet."} />
          )}
        </section>

        {/* Newest Series */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-8 bg-emerald-400 rounded-full" />
              {t("newest")} {t("series")}
            </h2>
            <Link to="/series" className="text-emerald-500 text-sm font-bold hover:gap-2 transition-all flex items-center gap-1 group">
              {t("watchNow")}
              <ChevronRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
            </Link>
          </div>
          {homepageData.newestSeries.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {homepageData.newestSeries.map((item, index) => (
                <Motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MediaCard item={item} />
                </Motion.div>
              ))}
            </div>
          ) : (
            <EmptyState message={t("noResults") || "No series available yet."} />
          )}
        </section>

        {/* Trending Section */}
        <section className="bg-white/5 p-8 md:p-12 rounded-[2rem] border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-[100px] -z-10" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 blur-[100px] -z-10" />
           
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-white">{t("trending")}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {homepageData.trending.map((item, index) => (
              <Motion.div
                key={item.id + '-trend'}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <MediaCard item={item} />
              </Motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};