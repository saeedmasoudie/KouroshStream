import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router';
import { Play, Download, Star, Calendar, Clock, Film, Tv, Globe, ChevronDown, ChevronUp, X, ExternalLink, AlertTriangle, Eye, MessageSquare, User, Mail, Send, Shield, UserCheck, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getCookie, setCookie } from '@/app/utils/cookies';
import { AnimatePresence } from 'framer-motion';
import { Media } from '@/app/data/mockData';
import { normalizeGenres } from '@/app/utils/helpers';
import { DetailPageSkeleton } from '@/app/components/SkeletonLoader';
import { EpisodeRow } from '@/app/components/EpisodeRow';
import { useLanguage } from '@/app/context/LanguageContext';
import { motion as Motion } from 'motion/react';
import { extractSlugFromPath, slugify, createMediaUrl } from '@/app/utils/urlUtils';
import { SEO } from '@/app/components/SEO';
import { NextEpisodeCountdown } from '@/app/components/NextEpisodeCountdown';
import { ImageWithFallback } from '@/app/components/ui/ImageWithFallback';
import { apiService, API_CONFIG } from '@/app/config/api';
import { Turnstile } from '@/app/components/ui/Turnstile';

const API_URL = 'https://cinestream-media-detail.ericluck.workers.dev';

export const DetailPage: React.FC = () => {
  const { lang: urlLang, slug } = useParams<{ lang: string; slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t, dir } = useLanguage();
  const [item, setItem] = useState<Media | null>(null);
  const [activeSeason, setActiveSeason] = useState(1);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [streamModal, setStreamModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: "",
    title: "",
  });
  const [showPlayerWarning, setShowPlayerWarning] = useState(true);
  
  // Comment Form State - Load email from cookies
  const [commentData, setCommentData] = useState(() => {
    const savedEmail = getCookie('user_email');
    const savedName = getCookie('user_name');
    return { 
      name: savedName || "", 
      email: savedEmail || "", 
      text: "",
      rating: 0, // 0 means no rating selected
      isSpoiler: false
    };
  });
  
  const [comments, setComments] = useState<any[]>([]);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});

  // Lock body scroll when modals are open
  useEffect(() => {
    if (streamModal.isOpen || showTrailer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [streamModal.isOpen, showTrailer]);

  useEffect(() => {
    const fetchData = async () => {
      // Determine type from URL path
      const pathParts = location.pathname.split('/');
      // path is usually /en/movie/slug or /fa/series/slug
      // parts: ["", "en", "movie", "slug"]
      let type: 'movie' | 'series' | undefined;
      if (pathParts.includes('movie')) type = 'movie';
      else if (pathParts.includes('series')) type = 'series';
      
      if (!slug) return;
      
      if (!type) {
        console.error('❌ Could not determine media type from URL!');
        toast.error('Invalid URL: Cannot determine if this is a movie or series');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await apiService.getMediaDetail(slug, type);
        
        // Parse cast_json and cast_fa_json fields if they exist
        if (data.media?.cast_json && typeof data.media.cast_json === 'string') {
          try {
            data.media.cast_json = JSON.parse(data.media.cast_json);
          } catch (e) {
            console.error('Failed to parse cast_json:', e);
          }
        }
        if (data.media?.cast_fa_json && typeof data.media.cast_fa_json === 'string') {
          try {
            data.media.cast_fa_json = JSON.parse(data.media.cast_fa_json);
          } catch (e) {
            console.error('Failed to parse cast_fa_json:', e);
          }
        }
        
        setItem(data.media);
        setComments(data.comments || []);
        
        // DEBUG: Log countdown-related fields
        if (data.media?.type === 'series') {
          console.log('🔍 Series Countdown Debug:', {
            type: data.media.type,
            status: data.media.status,
            release_day_of_week: data.media.release_day_of_week,
            release_time: data.media.release_time,
            willShowCountdown: data.media.type === 'series' && data.media.status === 'ongoing' && data.media.release_day_of_week != null
          });
        }
        
        // Track view (IP-based, no cookies needed)
        if (data.media?.id) {
          apiService.trackView(data.media.id);
        }
      } catch (error) {
        console.error('Failed to fetch media detail:', error);
        toast.error('Failed to load media details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, location.pathname]);

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast.error(t('pleaseSolveCaptcha') || 'Please complete the captcha verification');
      return;
    }
    
    if (!commentData.name || !commentData.email || !commentData.text) {
      toast.error(t('fillAllFields') || 'Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(commentData.email)) {
      toast.error(t('invalidEmail') || 'Please enter a valid email address');
      return;
    }

    // Validate comment length
    if (commentData.text.length < 3) {
      toast.error(t('commentTooShort') || 'Comment must be at least 3 characters long');
      return;
    }

    if (commentData.text.length > 1000) {
      toast.error(t('commentTooLong') || 'Comment must be less than 1000 characters');
      return;
    }

    try {
      console.log('📤 Submitting comment:', {
        media_id: item?.id,
        media_type: item?.type,
        name: commentData.name,
        email: commentData.email,
        commentLength: commentData.text.length,
        hasCaptcha: !!captchaToken
      });

      const response = await apiService.submitComment({
        media_id: item?.id || '',
        media_type: item?.type || 'movie',
        parent_id: replyTo?.id,
        name: commentData.name,
        email: commentData.email,
        comment: commentData.text,
        rating: commentData.rating > 0 ? commentData.rating : undefined, // Only send rating if selected
        captcha: captchaToken,
      });
      
      console.log('✅ Comment response:', response);
      
      // Save name and email to cookies for future use
      setCookie('user_name', commentData.name, 365);
      setCookie('user_email', commentData.email, 365);
      
      // Show success message with approval notice
      const successMessage = response.message || 'Thank you! Your comment has been submitted and is awaiting approval by our team.';
      toast.success(successMessage, {
        duration: 5000, // Show for 5 seconds
      });
      
      // Reset form (keep name and email, clear text and rating)
      setCommentData({ 
        ...commentData, 
        text: '', 
        rating: 0,
        isSpoiler: false 
      });
      setCaptchaToken('');
      setReplyTo(null);
      
      // Reset the Turnstile widget
      window.turnstile?.reset();
    } catch (error) {
      console.error('❌ Failed to submit comment:', error);
      
      // Try to parse error message
      let errorMessage = t('commentFailed') || 'Failed to submit comment';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Reset captcha on error
      setCaptchaToken('');
      window.turnstile?.reset();
    }
  };

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No results found</h2>
          <p className="text-gray-400 mb-6">The media you're looking for doesn't exist.</p>
          <Link to={`/${lang}`} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-colors">
            {t('backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  const title = item.title[lang] || item.title.en;
  const description = item.description[lang] || item.description.en;
  const genres = normalizeGenres(item.genres);
  
  // Marketing enhanced title for SEO
  const seoTitle = lang === 'fa'
    ? `${title} ${t('noCensoring')} و ${t('fullMovie')} | ${t('watchOnlineFree')}`
    : `Watch ${title} Online Free | ${t('fullMovie')} & ${t('safeDownload')}`;

  // Marketing enhanced description for SEO
  const seoDescription = lang === 'fa'
    ? `تماشای آنلاین و دانلود فیلم ${title} با لینک مستقیم و ترافیک نیم‌بها. نسخه کامل، بدون سانسور و با زیرنویس چسبیده (سافت‌ساب) قابل غیرفعال کردن. لینک‌های امن و بدون ویروس.`
    : `Watch and download ${title} full movie online for free. Safe and direct links, highest quality possible, with soft subtitles that can be disabled. No virus, 100% safe streaming experience.`;

  // Cast data - use structured data if available
  const rawCast = lang === 'fa' && item.cast_fa_json ? item.cast_fa_json : item.cast_json;
  const castData = Array.isArray(rawCast) ? rawCast : [];

  // Construct alternate URLs for both languages
  const baseUrl = 'https://cinestream.com';
  const pathSegment = item.type === 'movie' ? 'movie' : 'series';
  const slugEn = item.slug?.en || slug;
  const slugFa = item.slug?.fa || slug;
  const alternateUrls = [
    { lang: 'en', url: `${baseUrl}/en/${pathSegment}/${slugEn}` },
    { lang: 'fa', url: `${baseUrl}/fa/${pathSegment}/${slugFa}` }
  ];

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={item.poster}
        type="video.movie"
        mediaType={item.type}
        rating={item.rating}
        year={item.year}
        genres={genres}
        director={lang === 'fa' && item.director_fa ? item.director_fa : item.director}
        cast={castData}
        lang={lang}
        canonicalUrl={`${baseUrl}/${lang}/${pathSegment}/${lang === 'fa' ? slugFa : slugEn}`}
        alternateUrls={alternateUrls}
      />
      
      <div className="min-h-screen pb-20">
        {/* Hero Section with Backdrop */}
        <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
          <ImageWithFallback
            src={item.backdrop || item.poster}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className={`absolute inset-0 bg-gradient-to-${dir === 'rtl' ? 'left' : 'right'} from-slate-950/90 via-slate-950/40 to-transparent`} />

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 md:pb-20 w-full">
              <Motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row gap-8"
              >
                {/* Poster */}
                <div className="hidden md:block flex-shrink-0">
                  <div className="w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10">
                    <ImageWithFallback
                      src={item.poster}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-end">
                  <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                    {title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {item.rating && (
                      <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-xl font-bold">
                        <Star className="w-5 h-5 fill-current" />
                        {item.rating}
                      </div>
                    )}
                    {item.year && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-5 h-5" />
                        {item.year}
                      </div>
                    )}
                    {item.views && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Eye className="w-5 h-5" />
                        {item.views.toLocaleString()} {t('views')}
                      </div>
                    )}
                    {genres.length > 0 && (
                      <div className="flex gap-2">
                        {genres.slice(0, 3).map((genre) => (
                          <span key={genre} className="px-3 py-1 bg-white/10 rounded-lg text-sm">
                            {t(genre)}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Marketing Badges */}
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg text-sm font-black border border-emerald-600/30">
                        {t('noCensoring')}
                      </span>
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-black border border-blue-600/30">
                        {t('fullMovie')}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-lg mb-6 max-w-3xl line-clamp-3">
                    {description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {item.trailerUrl && (
                      <button
                        onClick={() => setShowTrailer(true)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl transition-all font-bold"
                      >
                        <Play className="w-5 h-5" />
                        {t('trailer')}
                      </button>
                    )}
                    {item.streamUrl && (
                      <button
                        onClick={() => setStreamModal({ isOpen: true, url: item.streamUrl || '', title })}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-all font-bold"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        {t('watchNow')}
                      </button>
                    )}
                  </div>
                </div>
              </Motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cast */}
              {castData && castData.length > 0 && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-emerald-500" />
                    {t('mainCast')}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {castData.slice(0, 6).map((actor: any, index: number) => (
                      <div key={index} className="group relative">
                        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 transition-all group-hover:bg-white/10 group-hover:scale-105 cursor-pointer">
                          {actor.image || actor.avatar ? (
                            <ImageWithFallback
                              src={actor.image || actor.avatar}
                              alt={actor.name || 'Actor'}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-emerald-600/20 rounded-full flex items-center justify-center text-emerald-500 font-bold">
                              {actor.name?.[0] || '?'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{actor.name}</p>
                            <p className="text-sm text-gray-400 truncate">{actor.character || t('character')}</p>
                          </div>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 hidden md:block">
                          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl shadow-2xl shadow-emerald-500/20 p-4 min-w-[280px]">
                            <div className="flex items-center gap-4">
                              {actor.image || actor.avatar ? (
                                <ImageWithFallback
                                  src={actor.image || actor.avatar}
                                  alt={actor.name || 'Actor'}
                                  className="w-20 h-20 rounded-xl object-cover ring-2 ring-emerald-500/30"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-500 font-bold text-2xl ring-2 ring-emerald-500/30">
                                  {actor.name?.[0] || '?'}
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-bold text-white text-lg mb-1">{actor.name}</p>
                                <p className="text-sm text-emerald-400 font-semibold">{actor.character || t('character')}</p>
                              </div>
                            </div>
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px]">
                              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-emerald-500/50"></div>
                              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-900 absolute top-0 left-1/2 -translate-x-1/2 -mt-[7px]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Series Episodes */}
              {item.type === 'series' && item.seasons && item.seasons.length > 0 && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-4">{t('seasons')} & {t('episodes')}</h2>
                  
                  {/* Season Selector */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {item.seasons.map((season) => (
                      <button
                        key={season.number}
                        onClick={() => setActiveSeason(Number(season.number))}
                        className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                          activeSeason === Number(season.number)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {t('season')} {season.number}
                      </button>
                    ))}
                  </div>

                  {/* Active Season Subtitle Link */}
                  {(() => {
                    const currentSeason = item.seasons.find((s) => Number(s.number) === activeSeason);
                    return currentSeason?.subtitle_link && (
                      <div className="mb-4">
                        <a
                          href={currentSeason.subtitle_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 hover:border-blue-600/50 rounded-xl p-4 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                {t('downloadSubtitle')} - {t('season')} {currentSeason.number}
                              </p>
                              <p className="text-xs text-gray-400">
                                {t('subtitle')} {t('episode')}s 1-{currentSeason.episodes?.length || 0}
                              </p>
                            </div>
                          </div>
                          <Download className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0" />
                        </a>
                      </div>
                    );
                  })()}

                  {/* Episodes */}
                  <div className="space-y-3">
                    {item.seasons
                      .find((s) => Number(s.number) === activeSeason)
                      ?.episodes.map((episode, index) => (
                        <EpisodeRow
                          key={index}
                          episode={episode}
                          seasonNumber={activeSeason}
                          seriesTitle={title}
                          onStream={(url, modalTitle) => setStreamModal({ isOpen: true, url, title: modalTitle || title })}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Download Links */}
              {item.downloadLinks && item.downloadLinks.length > 0 && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Download className="w-6 h-6 text-emerald-500" />
                    {t('downloadQuality')}
                  </h2>

                  {/* Download Notice - Google Drive Quota */}
                  <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl flex gap-4">
                    <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-blue-400 font-bold text-sm mb-1">{t('trustTitle')}</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {t('trustHint')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.downloadLinks.map((link: any, index: number) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white/5 hover:bg-emerald-600/20 border border-white/10 hover:border-emerald-600/50 rounded-xl p-4 transition-all group"
                      >
                        <div className="flex-1">
                          <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {link.label || link.title || link.quality || 'Download'}
                          </p>
                          {link.size && (
                            <p className="text-sm text-gray-400">{link.size}</p>
                          )}
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                  
                  {/* Movie Subtitle Link */}
                  {item.type === 'movie' && item.subtitle_link && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <a
                        href={item.subtitle_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 hover:border-blue-600/50 rounded-xl p-4 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                              {t('downloadSubtitle')}
                            </p>
                            <p className="text-xs text-gray-400">
                              {t('subtitle')} - {title}
                            </p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Comments Section */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-emerald-500" />
                  {t('comments')}
                </h2>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-8 bg-white/5 rounded-xl p-4 border border-white/10" id="comment-form">
                  {replyTo && (
                    <div className="flex items-center justify-between bg-emerald-600/20 text-emerald-400 px-4 py-2 rounded-lg mb-4 text-sm font-bold border border-emerald-600/30">
                      <span>{t('replyingTo') || 'Replying to'}: {replyTo.name}</span>
                      <button 
                        type="button" 
                        onClick={() => setReplyTo(null)}
                        className="text-white hover:text-emerald-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        {t('name')}
                      </label>
                      <input
                        type="text"
                        value={commentData.name}
                        onChange={(e) => setCommentData({ ...commentData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        value={commentData.email}
                        onChange={(e) => setCommentData({ ...commentData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Rating (Optional) */}
                  {!replyTo && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">
                        <Star className="w-4 h-4 inline mr-1" />
                        {t('rating')} ({t('optional')})
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCommentData({ ...commentData, rating: star })}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                commentData.rating >= star
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-gray-500'
                              }`}
                            />
                          </button>
                        ))}
                        {commentData.rating > 0 && (
                          <button
                            type="button"
                            onClick={() => setCommentData({ ...commentData, rating: 0 })}
                            className="text-sm text-gray-400 hover:text-white transition-colors ml-2"
                          >
                            {t('clear')}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <textarea
                    value={commentData.text}
                    onChange={(e) => setCommentData({ ...commentData, text: e.target.value })}
                    placeholder={replyTo ? t('addReply') || 'Add a reply...' : t('addComment')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors mb-4 min-h-[100px] resize-none"
                    required
                  />
                  
                  <div className="mb-4">
                    <Turnstile
                      siteKey={API_CONFIG.TURNSTILE_SITE_KEY}
                      onSuccess={(token) => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken('')}
                      theme="dark"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-all font-bold"
                  >
                    <Send className="w-5 h-5" />
                    {replyTo ? t('reply') || 'Reply' : t('post')}
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.length > 0 ? (
                    (() => {
                      const rootComments = comments.filter(c => !c.parent_id);
                      const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

                      return rootComments.map((comment) => {
                        const replies = getReplies(comment.id);
                        const isExpanded = expandedThreads[comment.id] || replies.length <= 1;

                        return (
                          <div key={comment.id} className="space-y-4">
                            <div className={`rounded-2xl p-4 border ${
                              comment.is_admin 
                                ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30' 
                                : 'bg-white/5 border-white/5'
                            }`}>
                              <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xl ${
                                  comment.is_admin 
                                    ? 'bg-gradient-to-br from-purple-500/30 to-purple-600/20 text-purple-400 border-2 border-purple-500/40' 
                                    : 'bg-emerald-600/20 text-emerald-500 border border-emerald-600/20'
                                }`}>
                                  {comment.is_admin ? <Shield className="w-6 h-6" /> : (comment.name?.[0]?.toUpperCase() || '?')}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-white">{comment.name}</p>
                                      {comment.is_admin && (
                                        <span className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-purple-500/30 flex items-center gap-1">
                                          <Shield className="w-3 h-3" />
                                          {lang === 'en' ? 'ADMIN' : 'ادمین'}
                                        </span>
                                      )}
                                      {comment.rating > 0 && (
                                        <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-xs font-black">
                                          <Star className="w-3 h-3 fill-current" />
                                          {comment.rating}
                                        </div>
                                      )}
                                      <span className="text-xs text-gray-500">
                                        {new Date(comment.created_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                                      </span>
                                    </div>
                                    <button 
                                      onClick={() => {
                                        setReplyTo({ id: comment.id, name: comment.name });
                                        document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
                                      }}
                                      className="text-emerald-500 hover:text-emerald-400 text-sm font-bold flex items-center gap-1"
                                    >
                                      <Send className="w-3 h-3" />
                                      {t('reply')}
                                    </button>
                                  </div>
                                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.comment}</p>
                                </div>
                              </div>
                            </div>

                            {/* Replies Section */}
                            {replies.length > 0 && (
                              <div className={`${lang === 'fa' ? 'mr-12' : 'ml-12'} space-y-4 border-l-2 border-white/10 pl-6`}>
                                {!isExpanded && (
                                  <button 
                                    onClick={() => setExpandedThreads({ ...expandedThreads, [comment.id]: true })}
                                    className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 py-1"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                    {t('showReplies')} ({replies.length})
                                  </button>
                                )}

                                {isExpanded && (
                                  <>
                                    {replies.map((reply) => (
                                      <div key={reply.id} className={`rounded-xl p-4 border ${
                                        reply.is_admin 
                                          ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30' 
                                          : 'bg-white/5 border-white/5'
                                      }`}>
                                        <div className="flex items-start gap-3">
                                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                                            reply.is_admin 
                                              ? 'bg-gradient-to-br from-purple-500/30 to-purple-600/20 text-purple-400 border-2 border-purple-500/40' 
                                              : 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/10'
                                          }`}>
                                            {reply.is_admin ? <Shield className="w-5 h-5" /> : (reply.name?.[0]?.toUpperCase() || '?')}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <p className="font-bold text-white text-sm">{reply.name}</p>
                                              {reply.is_admin && (
                                                <span className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded text-[9px] font-black uppercase border border-purple-500/30 flex items-center gap-1">
                                                  <Shield className="w-2.5 h-2.5" />
                                                  {lang === 'en' ? 'ADMIN' : 'ادمین'}
                                                </span>
                                              )}
                                              <span className="text-[10px] text-gray-500">
                                                {new Date(reply.created_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                                              </span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">{reply.comment}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    
                                    {replies.length > 1 && (
                                      <button 
                                        onClick={() => setExpandedThreads({ ...expandedThreads, [comment.id]: false })}
                                        className="text-gray-500 hover:text-white text-sm font-bold flex items-center gap-2 mt-2"
                                      >
                                        <ChevronDown className="w-4 h-4 rotate-180" />
                                        {t('hideReplies') || 'Hide replies'}
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                      <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-20" />
                      <p className="text-gray-500">
                        {t('noResults')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Episode Countdown - Only for Series */}
              {item.type === 'series' && item.status === 'ongoing' && (
                <NextEpisodeCountdown 
                  releaseDayOfWeek={item.release_day_of_week} 
                  releaseTime={item.release_time}
                  status={item.status} 
                />
              )}

              {/* Info Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold mb-4">{t('details')}</h3>
                
                {item.director ? (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{t('director')}</p>
                    <p className="font-semibold">{lang === 'fa' && item.director_fa ? item.director_fa : item.director}</p>
                  </div>
                ) : null}

                {item.country ? (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{t('country')}</p>
                    <p className="font-semibold">{item.country}</p>
                  </div>
                ) : null}

                {(item.language || item.language_fa) ? (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{t('language')}</p>
                    <p className="font-semibold">{lang === 'fa' && item.language_fa ? item.language_fa : item.language}</p>
                  </div>
                ) : null}

                {item.duration ? (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{t('duration')}</p>
                    <p className="font-semibold">{item.duration} {t('min')}</p>
                  </div>
                ) : null}

                {item.quality ? (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{t('quality')}</p>
                    <p className="font-semibold">{item.quality}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Trailer Modal */}
        <AnimatePresence>
          {showTrailer && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowTrailer(false)}
            >
              <Motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowTrailer(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <iframe
                  src={item.trailerUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Stream Modal */}
        <AnimatePresence>
          {streamModal.isOpen && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setStreamModal({ ...streamModal, isOpen: false })}
            >
              <Motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative w-full max-w-5xl bg-slate-950 rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setStreamModal({ ...streamModal, isOpen: false })}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                
                {/* Player Ads Warning - Inside Modal */}
                {showPlayerWarning && (
                  <div className="p-4 bg-yellow-500/10 border-b border-yellow-500/20 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="text-yellow-500 font-bold text-sm mb-1">{t('playerAdsNotice')}</h5>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {t('playerAdsHint')}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPlayerWarning(false)}
                      className="w-6 h-6 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                      aria-label="Close warning"
                    >
                      <X className="w-4 h-4 text-yellow-500" />
                    </button>
                  </div>
                )}
                
                {/* Player Iframe */}
                <div className="aspect-video bg-black">
                  <iframe
                    src={streamModal.url}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};