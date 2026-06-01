import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, Menu, X, Globe, Play, Film, Tv, Lightbulb, Heart, ShieldAlert, FileQuestion } from "lucide-react";
import Telegram from "lucide-react/dist/esm/icons/send";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import { useLanguage } from "@/app/context/LanguageContext";
import { apiService } from "@/app/config/api";
import { createMediaUrl } from "@/app/utils/urlUtils";
import { rateLimiter, RATE_LIMITS } from "@/app/utils/rateLimiter";
import { toast } from "sonner";
import { motion as Motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

export const Navbar: React.FC = () => {
  const { t, lang, setLang, dir } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch search suggestions from API with debounce AND rate limiting
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false); // Clear loading state when query is cleared
      return;
    }

    const timeoutId = setTimeout(async () => {
      // Check rate limit before making request
      if (!rateLimiter.checkRateLimit('search-autocomplete', RATE_LIMITS.SEARCH)) {
        const timeUntilReset = rateLimiter.getTimeUntilReset('search-autocomplete', RATE_LIMITS.SEARCH);
        const seconds = Math.ceil(timeUntilReset / 1000);
        toast.error(
          lang === 'en'
            ? `Search rate limit exceeded. Please wait ${seconds} seconds.`
            : `محدودیت جستجو. لطفاً ${seconds} ثانیه صبر کنید.`,
          { duration: 3000 }
        );
        setIsLoadingSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const response = await apiService.search(searchQuery, lang);
        
        // The apiService.search already transforms results via transformMediaItem
        // So we don't need to transform again - just use them directly
        // Limit to 5 suggestions for autocomplete
        setSuggestions((response.results || []).slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch search suggestions:", error);
        setSuggestions([]);
        
        // Only show error toast if it's not a rate limit issue
        if (error instanceof Error && !error.message.includes('rate limit')) {
          toast.error(
            lang === 'en' 
              ? 'Search failed. Please try again.' 
              : 'جستجو ناموفق بود. لطفاً دوباره امتحان کنید.',
            { duration: 2000 }
          );
        }
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, lang]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${lang}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const title = suggestion.title[lang] || suggestion.title.en;
    const mediaUrl = createMediaUrl(suggestion.type, suggestion.id, title, lang, suggestion.slug);
    navigate(mediaUrl);
    setIsSearchOpen(false);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const navLinks = [
    { name: t("home"), path: `/${lang}`, icon: Play },
    { name: t("movies"), path: `/${lang}/movies`, icon: Film },
    { name: t("series"), path: `/${lang}/series`, icon: Tv },
    { name: t("suggestions"), path: `/${lang}/suggestions`, icon: Lightbulb },
    { name: lang === 'en' ? 'Admin' : 'ادمین', path: '/sys-control-7x24', icon: ShieldAlert },
    { name: lang === 'en' ? '404 Page' : 'صفحه ۴۰۴', path: `/${lang}/this-page-does-not-exist`, icon: FileQuestion },
  ];

  const socialLinks: any[] = [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[60] bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-4 md:gap-12">
            <Link to={`/${lang}`} className="group transition-transform hover:scale-105 active:scale-95">
              <Logo size="md" className="hidden md:flex" />
              <Logo size="sm" showText={false} className="md:hidden" />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-emerald-500 ${
                    isActive(link.path) ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 md:gap-4 mr-2 md:mr-4 pr-2 md:pr-4 border-r border-white/10">
               {socialLinks.map((s, idx) => (
                 <a key={idx} href={s.url} className={`text-gray-500 transition-colors ${s.color}`}>
                   <s.icon className="w-4 h-4 md:w-5 md:h-5" />
                 </a>
               ))}
            </div>

            {/* Admin button removed for security */}

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={() => {
                const newLang = lang === "en" ? "fa" : "en";
                setLang(newLang); // Update context immediately
                
                // If the current path starts with /en or /fa, replace it
                const pathParts = location.pathname.split('/');
                if (pathParts[1] === 'en' || pathParts[1] === 'fa') {
                  pathParts[1] = newLang;
                  navigate(pathParts.join('/') + location.search);
                } else {
                  // If not (like on admin page), just stay on same page
                  // The setLang above already updated the cookie and direction
                }
              }}
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs md:text-sm font-black"
            >
              <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" />
              <span>{lang === "en" ? "FA" : "EN"}</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-gray-400 hover:text-white transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-slate-950/95 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-base font-bold transition-all ${
                    isActive(link.path) ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              {/* Admin link removed from mobile menu for security */}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-white/5 p-4 md:p-8 z-50 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder={t("search")}
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                  className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 ${dir === 'rtl' ? 'pr-14 pl-6' : 'pl-14 pr-6'} text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/50 shadow-inner transition-all`}
                />
                <Search className={`absolute ${dir === 'rtl' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-emerald-600 w-6 h-6`} />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className={`absolute ${dir === 'rtl' ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1`}
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
              
              {/* Autocomplete Suggestions */}
              <AnimatePresence>
                {showSuggestions && (isLoadingSuggestions || suggestions.length > 0) && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50 z-[70]"
                  >
                    {isLoadingSuggestions ? (
                      <div className="py-8 px-5">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-400 text-sm font-medium">
                            {lang === 'en' ? 'Searching...' : 'در حال جستجو...'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <ul className="py-2">
                        {suggestions.map((suggestion, index) => {
                          const displayTitle = suggestion.title[lang] || suggestion.title.en;
                          return (
                            <li key={suggestion.id}>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSuggestionClick(suggestion);
                                }}
                                className={`w-full px-4 py-3 hover:bg-emerald-600/20 text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-4 group ${
                                  index !== suggestions.length - 1 ? 'border-b border-white/5' : ''
                                }`}
                              >
                                {/* Poster Image */}
                                <div className="relative w-12 h-16 flex-shrink-0">
                                  {suggestion.poster ? (
                                    <>
                                      {/* Skeleton loader */}
                                      {!loadedImages.has(suggestion.poster) && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg animate-pulse ring-2 ring-white/10" />
                                      )}
                                      {/* Actual image */}
                                      <img 
                                        src={suggestion.poster} 
                                        alt={displayTitle}
                                        loading="eager"
                                        className="absolute inset-0 w-full h-full object-cover rounded-lg ring-2 ring-white/10 group-hover:ring-emerald-500/50 transition-all"
                                        onLoad={() => setLoadedImages(prev => new Set(prev).add(suggestion.poster))}
                                        onError={(e) => {
                                          // Hide the broken image and show fallback
                                          e.currentTarget.style.display = 'none';
                                        }}
                                        style={{ 
                                          opacity: loadedImages.has(suggestion.poster) ? 1 : 0,
                                          transition: 'opacity 0.3s ease-in-out'
                                        }}
                                      />
                                    </>
                                  ) : (
                                    <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center ring-2 ring-white/10">
                                      {suggestion.type === 'movie' ? (
                                        <Film className="w-6 h-6 text-gray-600" />
                                      ) : (
                                        <Tv className="w-6 h-6 text-gray-600" />
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Title and Info */}
                                <div className={`flex-1 min-w-0 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                  <p className="text-base font-semibold truncate">{displayTitle}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500">{suggestion.year}</span>
                                    <span className="text-xs text-gray-600">•</span>
                                    <span className="text-xs text-gray-500 capitalize">
                                      {suggestion.type === 'movie' ? (lang === 'fa' ? 'فیلم' : 'Movie') : (lang === 'fa' ? 'سریال' : 'Series')}
                                    </span>
                                    {suggestion.rating && (
                                      <>
                                        <span className="text-xs text-gray-600">•</span>
                                        <span className="text-xs text-yellow-500 flex items-center gap-1">
                                          ⭐ {suggestion.rating}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Arrow Icon */}
                                <Search className="w-4 h-4 text-emerald-500 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};