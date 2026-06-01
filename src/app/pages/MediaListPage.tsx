import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Media } from "@/app/data/mockData";
import { MediaCard } from "@/app/components/MediaCard";
import { Search, Filter, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { motion as Motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { MediaCardSkeleton } from "@/app/components/SkeletonLoader";
import { apiService } from "@/app/config/api";
import { EmptyState } from "@/app/components/EmptyState";
import { SEO } from "@/app/components/SEO";

interface MediaListPageProps {
  type: "movie" | "series";
}

export const MediaListPage: React.FC<MediaListPageProps> = ({ type }) => {
  const { t, lang, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Comprehensive genre list
  const genres = [
    "all", "action", "adventure", "animation", "anime", "biography", "comedy", 
    "crime", "documentary", "drama", "family", "fantasy", "history",
    "horror", "music", "mystery", "romance", "sciFi", "sport", 
    "thriller", "war", "western"
  ];

  // Year options (last 50 years)
  const currentYear = new Date().getFullYear();
  const years = ["all", ...Array.from({ length: 50 }, (_, i) => (currentYear - i).toString())];

  // Common countries with short codes and full names
  const countries = [
    { code: "all", name: { en: "All Countries", fa: "همه کشورها" } },
    { code: "US", name: { en: "United States", fa: "آمریکا" } },
    { code: "GB", name: { en: "United Kingdom", fa: "انگلستان" } },
    { code: "CA", name: { en: "Canada", fa: "کانادا" } },
    { code: "FR", name: { en: "France", fa: "فرانسه" } },
    { code: "DE", name: { en: "Germany", fa: "آلمان" } },
    { code: "IT", name: { en: "Italy", fa: "ایتالیا" } },
    { code: "ES", name: { en: "Spain", fa: "اسپانیا" } },
    { code: "JP", name: { en: "Japan", fa: "ژاپن" } },
    { code: "KR", name: { en: "South Korea", fa: "کره جنوبی" } },
    { code: "CN", name: { en: "China", fa: "چین" } },
    { code: "IN", name: { en: "India", fa: "هند" } },
    { code: "AU", name: { en: "Australia", fa: "استرالیا" } },
    { code: "BR", name: { en: "Brazil", fa: "برزیل" } },
    { code: "MX", name: { en: "Mexico", fa: "مکزیک" } },
    { code: "RU", name: { en: "Russia", fa: "روسیه" } },
    { code: "TR", name: { en: "Turkey", fa: "ترکیه" } },
    { code: "IR", name: { en: "Iran", fa: "ایران" } },
    { code: "other", name: { en: "Other", fa: "سایر" } }
  ];

  // Rating options
  const ratings = [
    { value: "all", label: lang === 'fa' ? "همه امتیازها" : "All Ratings" },
    { value: "9", label: "9+ ⭐" },
    { value: "8", label: "8+ ⭐" },
    { value: "7", label: "7+ ⭐" },
    { value: "6", label: "6+ ⭐" },
    { value: "5", label: "5+ ⭐" },
  ];

  // Quality options (for movies only)
  const qualities = ["all", "4K", "1080p", "720p", "HD", "CAM"];

  // Fetch Media List from Cloudflare Worker
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getMediaList({
          type,
          genre: selectedGenre === 'all' ? undefined : selectedGenre,
          year: selectedYear === 'all' ? undefined : selectedYear,
          country: selectedCountry === 'all' ? undefined : selectedCountry,
          min_rating: selectedRating === 'all' ? undefined : parseFloat(selectedRating),
          quality: selectedQuality === 'all' ? undefined : selectedQuality,
          sort: sortBy as any,
          page: currentPage
        });
        
        // Check if response has pagination object (new format)
        if (response.pagination) {
          setMediaList(response.items || []);
          setTotalCount(response.pagination.total || 0);
        } else {
          // Fallback to old format
          setMediaList(response.items || []);
          setTotalCount(response.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch media list:", error);
        setMediaList([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [type, selectedGenre, selectedYear, selectedCountry, selectedRating, selectedQuality, sortBy, currentPage]);

  // Client-side search filtering
  const filteredData = useMemo(() => {
    if (!searchQuery) return mediaList;
    const q = searchQuery.toLowerCase();
    return mediaList.filter(
      (item) =>
        item.title.en.toLowerCase().includes(q) ||
        item.title.fa.includes(q)
    );
  }, [mediaList, searchQuery]);

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSelectedGenre('all');
    setSelectedYear('all');
    setSelectedCountry('all');
    setSelectedRating('all');
    setSelectedQuality('all');
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    selectedGenre !== 'all' || 
    selectedYear !== 'all' || 
    selectedCountry !== 'all' || 
    selectedRating !== 'all' || 
    (type === 'movie' && selectedQuality !== 'all') ||
    searchQuery !== '';

  return (
    <div className="pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO 
        title={type === 'movie' 
          ? (lang === 'fa' ? 'دانلود فیلم رایگان بدون سانسور | تماشای آنلاین فیلم با کیفیت بالا' : 'Watch & Download Free Movies | Full HD & Safe Streaming')
          : (lang === 'fa' ? 'دانلود سریال جدید بدون سانسور | تماشای آنلاین سریال با زیرنویس' : 'Watch & Download New TV Series | Full Seasons & Safe Streaming')
        }
        description={type === 'movie'
          ? (lang === 'fa' ? 'لیست جدیدترین فیلم‌های سینمایی بدون سانسور با لینک مستقیم و ترافیک نیم‌بها. پخش آنلاین رایگان، کیفیت‌های مختلف و لینک‌های امن.' : 'Browse the latest collection of full movies available for free streaming and download. Safe, virus-free links with high-quality options.')
          : (lang === 'fa' ? 'مجموعه کامل سریال‌های خارجی و ایرانی بدون سانسور. دانلود فصل‌های کامل با زیرنویس چسبیده و پخش آنلاین با سرعت بالا.' : 'Watch your favorite TV shows and series online for free. Download full seasons with soft subtitles. 100% safe and secure platform.')
        }
        lang={lang}
      />
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-white border-l-4 border-emerald-600 pl-4 uppercase tracking-wider" dir="ltr">
            {type === "movie" ? t("movies") : t("series")}
          </h1>
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {t("filters")}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600/50 transition-all`}
            />
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-6 overflow-hidden lg:block"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-lg font-bold text-white">{t("filters")}</h2>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm font-bold transition-all"
                  >
                    <X className="w-4 h-4" />
                    {lang === 'fa' ? 'پاک کردن همه' : 'Clear All'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Genre Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 block">
                    {lang === 'fa' ? 'ژانر' : 'Genre'}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedGenre}
                      onChange={(e) => {
                        setSelectedGenre(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600/50 transition-all"
                      style={{ direction: dir }}
                    >
                      {genres.map((g) => (
                        <option key={g} value={g} className="bg-slate-900 text-white">
                          {t(g)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none`} />
                  </div>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 block">
                    {lang === 'fa' ? 'سال' : 'Year'}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600/50 transition-all"
                      style={{ direction: dir }}
                    >
                      {years.map((y) => (
                        <option key={y} value={y} className="bg-slate-900 text-white">
                          {y === "all" ? t("all") : y}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none`} />
                  </div>
                </div>

                {/* Country Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 block">
                    {lang === 'fa' ? 'کشور' : 'Country'}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600/50 transition-all"
                      style={{ direction: dir }}
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                          {c.name[lang]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none`} />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 block">
                    {lang === 'fa' ? 'امتیاز IMDb' : 'IMDb Rating'}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRating}
                      onChange={(e) => {
                        setSelectedRating(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600/50 transition-all"
                      style={{ direction: dir }}
                    >
                      {ratings.map((r) => (
                        <option key={r.value} value={r.value} className="bg-slate-900 text-white">
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none`} />
                  </div>
                </div>

                {/* Quality Filter (Movies Only) */}
                {type === 'movie' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 block">
                      {lang === 'fa' ? 'کیفیت' : 'Quality'}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedQuality}
                        onChange={(e) => {
                          setSelectedQuality(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600/50 transition-all"
                        style={{ direction: dir }}
                      >
                        {qualities.map((q) => (
                          <option key={q} value={q} className="bg-slate-900 text-white">
                            {q === "all" ? t("all") : q}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none`} />
                    </div>
                  </div>
                )}
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>{t("sortBy")}:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'newest', label: lang === 'fa' ? 'جدیدترین' : 'Newest' },
              { value: 'popular', label: lang === 'fa' ? 'محبوب‌ترین' : 'Popular' },
              { value: 'rating', label: lang === 'fa' ? 'بالاترین امتیاز' : 'Top Rated' },
            ].map((sort) => (
              <button
                key={sort.value}
                onClick={() => {
                  setSortBy(sort.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  sortBy === sort.value
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-gray-400">{lang === 'fa' ? 'فیلترهای فعال:' : 'Active filters:'}</span>
          {selectedGenre !== 'all' && (
            <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg text-sm font-semibold">
              {t(selectedGenre)}
            </span>
          )}
          {selectedYear !== 'all' && (
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-semibold">
              {selectedYear}
            </span>
          )}
          {selectedCountry !== 'all' && (
            <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg text-sm font-semibold">
              {countries.find(c => c.code === selectedCountry)?.name[lang]}
            </span>
          )}
          {selectedRating !== 'all' && (
            <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-lg text-sm font-semibold">
              {selectedRating}+ ⭐
            </span>
          )}
          {type === 'movie' && selectedQuality !== 'all' && (
            <span className="px-3 py-1 bg-pink-600/20 text-pink-400 rounded-lg text-sm font-semibold">
              {selectedQuality}
            </span>
          )}
        </Motion.div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: itemsPerPage }, (_, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <MediaCardSkeleton />
            </Motion.div>
          ))}
        </div>
      ) : filteredData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredData.map((item, index) => (
            <Motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <MediaCard item={item} />
            </Motion.div>
          ))}
        </div>
      ) : (
        <EmptyState 
          type="filter" 
          action={{ 
            label: lang === 'fa' ? 'پاکسازی فیلترها' : 'Clear Filters', 
            onClick: clearAllFilters
          }} 
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && !isLoading && filteredData.length > 0 && (
        <div className="mt-12 space-y-6">
          {/* Results Counter */}
          <div className="text-center text-gray-400 text-sm">
            {t("showing")} {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} {t("of")} {totalCount} {t("results")}
          </div>
          
          {/* Pagination Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {t("prev")}
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                      currentPage === pageNum
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};