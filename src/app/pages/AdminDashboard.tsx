import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { 
  Lock, Plus, Database, Film, Tv, MessageSquare, Lightbulb, 
  BarChart3, Trash2, CheckCircle, XCircle, LogOut, PlayCircle,
  Save, Image as ImageIcon, Link as LinkIcon, Edit, List, Construction, Star,
  MessageCircle, Send, X, Mail
} from "lucide-react";
import { motion as Motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { apiService } from "@/app/config/api";
import { toast } from "sonner";
import { SeasonEpisodeManager } from "@/app/components/SeasonEpisodeManager";
import { slugify } from "@/app/utils/urlUtils";
import { Turnstile } from "@/app/components/ui/Turnstile";
import { API_CONFIG } from "@/app/config/api";

interface Episode {
  episode: number;
  title_en: string;
  title_fa: string;
  streamUrl: string;
  downloadLinks: DownloadLink[];
}

interface DownloadLink {
  label: string;
  url: string;
}

interface Season {
  season: number;
  episodes: Episode[];
}

export const AdminDashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if already authenticated on mount
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => {
    // Restore token from sessionStorage
    return sessionStorage.getItem('admin_token') || '';
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [underConstructionMode, setUnderConstructionMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'movies' | 'series' | 'comments' | 'suggestions' | 'contact' | 'settings'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Season/Episode Manager
  const [managingSeriesId, setManagingSeriesId] = useState<string | null>(null);
  const [managingSeriesTitle, setManagingSeriesTitle] = useState<string>("");

  // Stats
  const [stats, setStats] = useState<any>(null);

  // Lists
  const [movies, setMovies] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [allComments, setAllComments] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsFilter, setSuggestionsFilter] = useState<'all' | 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected'>('all');
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  
  // Comment editing
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentData, setEditCommentData] = useState({ name: '', email: '', comment: '', rating: 0 });
  const [commentsView, setCommentsView] = useState<'pending' | 'all'>('pending');
  
  // Comment reply
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('Admin');

  // Form State
  const [formData, setFormData] = useState({
    title_en: "",
    title_fa: "",
    slug: "",
    type: "movie",
    year: new Date().getFullYear().toString(),
    rating: "0",
    poster: "",
    backdrop: "",
    description_en: "",
    description_fa: "",
    genres: "",
    director: "",
    director_fa: "",
    country: "",
    language: "",
    language_fa: "",
    actors_fa: "",
    actor1_name: "",
    actor1_character: "",
    actor1_avatar: "",
    actor1_name_fa: "",
    actor1_character_fa: "",
    actor2_name: "",
    actor2_character: "",
    actor2_avatar: "",
    actor2_name_fa: "",
    actor2_character_fa: "",
    actor3_name: "",
    actor3_character: "",
    actor3_avatar: "",
    actor3_name_fa: "",
    actor3_character_fa: "",
    quality: "1080p",
    trailerUrl: "",
    streamUrl: "",
    duration: "120",
    featured: false,
    seriesStatus: "ongoing",
    releaseDayOfWeek: "", // 0-6 for Sunday-Saturday
    releaseTime: "20:00", // Default to 8 PM
    subtitle_link: "",
  });

  // Download links for movies
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([
    { label: "1080p", url: "" }
  ]);

  // Series-specific state
  const [seasons, setSeasons] = useState<Season[]>([
    {
      season: 1,
      episodes: [
        {
          episode: 1,
          title_en: "",
          title_fa: "",
          streamUrl: "",
          downloadLinks: [{ label: "1080p", url: "" }]
        }
      ]
    }
  ]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast.error(lang === 'en' ? "Please complete captcha verification" : "لطفا تایید کپچا را تکمیل کنید");
      return;
    }
    
    try {
      const result = await apiService.adminLogin(password);
      if (result.success) {
        setToken(result.token);
        setIsAuthenticated(true);
        
        // Save auth state to sessionStorage
        sessionStorage.setItem('admin_token', result.token);
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_password', password); // Store for Under Construction bypass
        sessionStorage.setItem('admin_bypass', 'true'); // For Under Construction bypass
        
        // Dispatch custom event so App.tsx can react immediately
        window.dispatchEvent(new Event('adminAuthChanged'));
        
        toast.success(lang === 'en' ? "Welcome back, Admin" : "خوش آمدید، مدیر");
        loadDashboardData(result.token);
      }
    } catch (error) {
      toast.error(lang === 'en' ? "Invalid Password" : "رمز عبور اشتباه است");
    }
  };

  const loadDashboardData = async (authToken: string) => {
    try {
      const statsData = await apiService.getAdminStats(authToken);
      if (statsData.error) {
        toast.error(lang === 'en' ? `Stats error: ${statsData.error}` : `خطا در آمار: ${statsData.error}`);
      }
      setStats(statsData.stats);
    } catch (error) {
      toast.error(lang === 'en' ? 'Failed to load stats' : 'خطا در بارگذاری آمار');
    }
  };

  const toggleUnderConstruction = async () => {
    const newValue = !underConstructionMode;
    try {
      // Optimistic update
      setUnderConstructionMode(newValue);
      localStorage.setItem('under_construction', newValue.toString());
      
      // API update
      await apiService.updateSettings({ maintenance_mode: newValue }, token);
      
      toast.success(
        newValue 
          ? (lang === 'en' ? "Site is now in Under Construction mode" : "سایت اکنون در حالت در دست ساخت است")
          : (lang === 'en' ? "Site is now live" : "سایت اکنون زنده است")
      );
    } catch (error) {
      // Revert on failure
      setUnderConstructionMode(!newValue);
      localStorage.setItem('under_construction', (!newValue).toString());
      toast.error(lang === 'en' ? "Failed to update maintenance mode" : "خطا در تغییر وضعیت سایت");
    }
  };

  const loadMovies = async () => {
    try {
      const result = await apiService.getAdminMovies(token);
      setMovies(result.movies || []);
    } catch (error) {
      toast.error('Failed to load movies');
    }
  };

  const loadSeries = async () => {
    try {
      const result = await apiService.getAdminSeries(token);
      setSeries(result.series || []);
    } catch (error) {
      toast.error('Failed to load series');
    }
  };

  const loadComments = async () => {
    try {
      if (commentsView === 'pending') {
        const result = await apiService.getPendingComments(token);
        setComments(result.comments || []);
      } else {
        const result = await apiService.getAllComments(token);
        setAllComments(result.comments || []);
      }
    } catch (error) {
      toast.error('Failed to load comments');
    }
  };

  const loadSuggestions = async () => {
    try {
      const result = await apiService.getSuggestions('all', token);
      if (result.error) {
        toast.error(lang === 'en' ? `Suggestions error: ${result.error}` : `خطا در پیشنهادات: ${result.error}`);
      }
      setSuggestions(result.suggestions || []);
    } catch (error) {
      toast.error(lang === 'en' ? 'Failed to load suggestions' : 'خطا در بارگذاری پیشنهادات');
    }
  };

  const loadContactMessages = async () => {
    try {
      const result = await apiService.getContactMessages(token);
      setContactMessages(result.messages || []);
    } catch (error) {
      toast.error(lang === 'en' ? 'Failed to load contact messages' : 'خطا در بارگذاری پیام‌ها');
    }
  };

  // Auto-load stats on mount if already authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      loadDashboardData(token);
      // Load settings
      apiService.getSettings().then(settings => {
        if (settings && typeof settings.maintenance_mode !== 'undefined') {
          setUnderConstructionMode(settings.maintenance_mode);
          localStorage.setItem('under_construction', settings.maintenance_mode.toString());
        }
      }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    if (isAuthenticated && token) {
      if (activeTab === 'movies') loadMovies();
      else if (activeTab === 'series') loadSeries();
      else if (activeTab === 'comments') loadComments();
      else if (activeTab === 'suggestions') loadSuggestions();
      else if (activeTab === 'contact') loadContactMessages();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated, token, commentsView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build cast JSON arrays
      const castJson = [];
      const castFaJson = [];
      
      if (formData.actor1_name) {
        castJson.push({
          avatar: formData.actor1_avatar || "",
          name: formData.actor1_name,
          character: formData.actor1_character || ""
        });
      }
      if (formData.actor1_name_fa) {
        castFaJson.push({
          avatar: formData.actor1_avatar || "",
          name: formData.actor1_name_fa,
          character: formData.actor1_character_fa || ""
        });
      }
      
      if (formData.actor2_name) {
        castJson.push({
          avatar: formData.actor2_avatar || "",
          name: formData.actor2_name,
          character: formData.actor2_character || ""
        });
      }
      if (formData.actor2_name_fa) {
        castFaJson.push({
          avatar: formData.actor2_avatar || "",
          name: formData.actor2_name_fa,
          character: formData.actor2_character_fa || ""
        });
      }
      
      if (formData.actor3_name) {
        castJson.push({
          avatar: formData.actor3_avatar || "",
          name: formData.actor3_name,
          character: formData.actor3_character || ""
        });
      }
      if (formData.actor3_name_fa) {
        castFaJson.push({
          avatar: formData.actor3_avatar || "",
          name: formData.actor3_name_fa,
          character: formData.actor3_character_fa || ""
        });
      }
    
      const payload: any = {
        title_en: formData.title_en,
        title_fa: formData.title_fa,
        slug: formData.slug || slugify(formData.title_en), // Fallback to auto-gen if empty
        type: formData.type,
        year: parseInt(formData.year),
        rating: parseFloat(formData.rating),
        poster: formData.poster,
        backdrop: formData.backdrop,
        description_en: formData.description_en,
        description_fa: formData.description_fa,
        genres: formData.genres,
        director: formData.director,
        director_fa: formData.director_fa,
        country: formData.country,
        language: formData.language,
        language_fa: formData.language_fa,
        actors_fa: formData.actors_fa,
        cast_json: castJson,
        cast_fa_json: castFaJson,
        quality: formData.quality,
        trailerUrl: formData.trailerUrl,
        subtitle_link: formData.subtitle_link,
        featured: formData.featured,
      };

      if (formData.type === 'movie') {
        payload.downloadLinks = JSON.stringify(downloadLinks.filter(link => link.url));
        payload.streamUrl = formData.streamUrl;
        payload.duration = parseInt(formData.duration);

        if (editingId) {
          // Update existing movie
          await apiService.updateMovie(editingId, payload, token);
          toast.success(lang === 'en' ? "Movie updated successfully!" : "فیلم با موفقیت به‌روزرسانی شد!");
        } else {
          // Add new movie
          await apiService.addMedia(payload, token);
          toast.success(lang === 'en' ? "Movie added successfully!" : "فیلم با موفقیت اضافه شد!");
        }
      } else if (formData.type === 'series') {
        payload.total_seasons = seasons.length;
        payload.status = formData.seriesStatus;
        // Use day of week instead of specific date
        payload.release_day_of_week = formData.seriesStatus === 'ongoing' && formData.releaseDayOfWeek !== '' 
          ? parseInt(formData.releaseDayOfWeek) 
          : null;
        payload.release_time = formData.seriesStatus === 'ongoing' && formData.releaseTime 
          ? formData.releaseTime 
          : null;
        
        if (editingId) {
          // Update existing series
          await apiService.updateSeries(editingId, payload, token);
          toast.success(lang === 'en' ? "Series updated successfully!" : "سریال با موفقیت به‌روزرسانی شد!");
        } else {
          // Add new series
          const seriesResult = await apiService.addMedia(payload, token);
          const seriesId = seriesResult.id;

          let episodeCount = 0;
          try {
            for (const season of seasons) {
              // First create the season
              console.log('Creating season:', season.season, 'for series:', seriesId);
              const seasonResult = await apiService.addSeason({
                media_id: seriesId,
                season_number: season.season,
                title: `Season ${season.season}`,
                title_fa: `فصل ${season.season}`,
                episode_count: season.episodes.length
              }, token);
              
              console.log('Season created:', seasonResult);
              const seasonId = seasonResult.id;
              
              // Then create all episodes for this season
              for (const episode of season.episodes) {
                console.log('Creating episode:', episode.episode, 'for season:', seasonId);
                await apiService.addEpisode({
                  season_id: seasonId,
                  episode_number: episode.episode,
                  title: episode.title_en,
                  title_fa: episode.title_fa,
                  description: '',
                  description_fa: '',
                  duration: 45,
                  thumbnail: '',
                  stream_link: episode.streamUrl || '',
                  download_links: episode.downloadLinks || []
                }, token);
                
                episodeCount++;
              }
            }
          } catch (seasonError) {
            console.error('Failed to create seasons/episodes:', seasonError);
            toast.error(lang === 'en' 
              ? `Series created but failed to add seasons/episodes: ${seasonError.message}` 
              : `سریال ساخته شد اما فصل‌ها/قسمت‌ها با خطا مواجه شدند: ${seasonError.message}`
            );
          }
          
          toast.success(lang === 'en' ? "Series added successfully!" : "سریال با موفقیت اضافه شد!", {
            description: episodeCount > 0 ? `${episodeCount} episodes created` : 'No episodes added'
          });
        }
      }
      
      // Reset form
      setEditingId(null);
      setFormData({
        title_en: "",
        title_fa: "",
        slug: "",
        type: formData.type,
        year: new Date().getFullYear().toString(),
        rating: "0",
        poster: "",
        backdrop: "",
        description_en: "",
        description_fa: "",
        genres: "",
        director: "",
        director_fa: "",
        country: "",
        language: "",
        language_fa: "",
        actors_fa: "",
        actor1_name: "",
        actor1_character: "",
        actor1_avatar: "",
        actor1_name_fa: "",
        actor1_character_fa: "",
        actor2_name: "",
        actor2_character: "",
        actor2_avatar: "",
        actor2_name_fa: "",
        actor2_character_fa: "",
        actor3_name: "",
        actor3_character: "",
        actor3_avatar: "",
        actor3_name_fa: "",
        actor3_character_fa: "",
        quality: "1080p",
        trailerUrl: "",
        streamUrl: "",
        duration: "120",
        featured: false,
        subtitle_link: "",
      });
      
      setDownloadLinks([
        { label: "1080p", url: "" }
      ]);

      setSeasons([
        {
          season: 1,
          episodes: [
            {
              episode: 1,
              title_en: "",
              title_fa: "",
              streamUrl: "",
              downloadLinks: [{ label: "1080p", url: "" }]
            }
          ]
        }
      ]);

      // Reload stats and lists
      loadDashboardData(token);
      if (formData.type === 'movie') loadMovies();
      else loadSeries();
    } catch (error) {
      console.error('Submit error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      if (editingId) {
        toast.error(lang === 'en' ? `Failed to update: ${errorMsg}` : `به‌روزرسانی با خطا مواجه شد: ${errorMsg}`);
      } else {
        toast.error(lang === 'en' ? `Failed to add content: ${errorMsg}` : `افزودن محتوا با خطا مواجه شد: ${errorMsg}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMovie = (movie: any) => {
    setEditingId(movie.id);
    
    // Parse cast_json if available
    let castArray = [];
    let castFaArray = [];
    
    try {
      if (movie.cast_json) {
        castArray = typeof movie.cast_json === 'string' ? JSON.parse(movie.cast_json) : movie.cast_json;
      }
      if (movie.cast_fa_json) {
        castFaArray = typeof movie.cast_fa_json === 'string' ? JSON.parse(movie.cast_fa_json) : movie.cast_fa_json;
      }
    } catch (e) {
      console.error('Failed to parse cast JSON:', e);
    }
    
    setFormData({
      title_en: typeof movie.title === 'string' ? movie.title : (movie.title_en || movie.title?.en || ''),
      title_fa: movie.title_fa || movie.title?.fa || '',
      slug: movie.slug || '',
      type: 'movie',
      year: movie.year?.toString() || '',
      rating: movie.imdb_rating?.toString() || movie.rating?.toString() || '0',
      poster: movie.poster_url || movie.poster || '',
      backdrop: movie.backdrop_url || movie.backdrop || '',
      description_en: movie.description || movie.description_en || '',
      description_fa: movie.description_fa || '',
      genres: movie.genres || '',
      director: movie.director || '',
      director_fa: movie.director_fa || '',
      country: movie.country || '',
      language: movie.language || '',
      language_fa: movie.language_fa || '',
      actors_fa: movie.actors_fa || '',
      actor1_name: castArray[0]?.name || '',
      actor1_character: castArray[0]?.character || '',
      actor1_avatar: castArray[0]?.avatar || '',
      actor1_name_fa: castFaArray[0]?.name || '',
      actor1_character_fa: castFaArray[0]?.character || '',
      actor2_name: castArray[1]?.name || '',
      actor2_character: castArray[1]?.character || '',
      actor2_avatar: castArray[1]?.avatar || '',
      actor2_name_fa: castFaArray[1]?.name || '',
      actor2_character_fa: castFaArray[1]?.character || '',
      actor3_name: castArray[2]?.name || '',
      actor3_character: castArray[2]?.character || '',
      actor3_avatar: castArray[2]?.avatar || '',
      actor3_name_fa: castFaArray[2]?.name || '',
      actor3_character_fa: castFaArray[2]?.character || '',
      quality: movie.quality || '1080p',
      trailerUrl: movie.trailer_url || movie.trailerUrl || '',
      streamUrl: movie.stream_embed || movie.stream_url || movie.streamUrl || '',
      duration: movie.duration?.toString() || '120',
      subtitle_link: movie.subtitle_link || '',
      featured: movie.featured === 1 || movie.featured === true,
    });
    
    // Load download links if available
    if (movie.download_links) {
      try {
        const links = typeof movie.download_links === 'string' 
          ? JSON.parse(movie.download_links) 
          : movie.download_links;
        setDownloadLinks(links);
      } catch (e) {
        setDownloadLinks([{ label: '1080p', url: '' }]);
      }
    }
    
    setActiveTab('add');
    toast.info('Editing movie - Update the form and click Publish');
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await apiService.deleteMovie(movieId, token);
      toast.success('Movie deleted successfully');
      loadMovies();
      loadDashboardData(token);
    } catch (error) {
      toast.error('Failed to delete movie');
    }
  };

  const handleEditSeries = (series: any) => {
    setEditingId(series.id);
    
    // Parse cast_json if available
    let castArray = [];
    let castFaArray = [];
    
    try {
      if (series.cast_json) {
        castArray = typeof series.cast_json === 'string' ? JSON.parse(series.cast_json) : series.cast_json;
      }
      if (series.cast_fa_json) {
        castFaArray = typeof series.cast_fa_json === 'string' ? JSON.parse(series.cast_fa_json) : series.cast_fa_json;
      }
    } catch (e) {
      console.error('Failed to parse cast JSON:', e);
    }
    
    setFormData({
      title_en: typeof series.title === 'string' ? series.title : (series.title_en || series.title?.en || ''),
      title_fa: series.title_fa || series.title?.fa || '',
      slug: series.slug || '',
      type: 'series',
      year: series.year?.toString() || '',
      rating: series.imdb_rating?.toString() || series.rating?.toString() || '0',
      poster: series.poster_url || series.poster || '',
      backdrop: series.backdrop_url || series.backdrop || '',
      description_en: series.description || series.description_en || '',
      description_fa: series.description_fa || '',
      genres: series.genres || '',
      director: series.director || '',
      director_fa: series.director_fa || '',
      country: series.country || '',
      language: series.language || '',
      language_fa: series.language_fa || '',
      actors_fa: series.actors_fa || '',
      actor1_name: castArray[0]?.name || '',
      actor1_character: castArray[0]?.character || '',
      actor1_avatar: castArray[0]?.avatar || '',
      actor1_name_fa: castFaArray[0]?.name || '',
      actor1_character_fa: castFaArray[0]?.character || '',
      actor2_name: castArray[1]?.name || '',
      actor2_character: castArray[1]?.character || '',
      actor2_avatar: castArray[1]?.avatar || '',
      actor2_name_fa: castFaArray[1]?.name || '',
      actor2_character_fa: castFaArray[1]?.character || '',
      actor3_name: castArray[2]?.name || '',
      actor3_character: castArray[2]?.character || '',
      actor3_avatar: castArray[2]?.avatar || '',
      actor3_name_fa: castFaArray[2]?.name || '',
      actor3_character_fa: castFaArray[2]?.character || '',
      quality: series.quality || '1080p',
      trailerUrl: series.trailer_url || series.trailerUrl || '',
      streamUrl: '',
      duration: '120',
      featured: series.featured === 1 || series.featured === true,
      seriesStatus: series.status || 'ongoing',
      releaseDayOfWeek: series.release_day_of_week !== null ? series.release_day_of_week.toString() : '',
      releaseTime: series.release_time || '20:00',
    });
    
    setActiveTab('add');
    toast.info('Editing series - Update the form and click Publish');
  };

  const handleDeleteSeries = async (seriesId: string) => {
    if (!confirm('Are you sure you want to delete this series and all its episodes?')) return;
    
    try {
      await apiService.deleteSeries(seriesId, token);
      toast.success('Series deleted successfully');
      loadSeries();
      loadDashboardData(token);
    } catch (error) {
      toast.error('Failed to delete series');
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      await apiService.approveComment(commentId, token);
      toast.success('Comment approved');
      loadComments();
      loadDashboardData(token);
    } catch (error) {
      toast.error('Failed to approve comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await apiService.deleteComment(commentId, token);
      toast.success(lang === 'en' ? 'Comment deleted' : 'نظر حذف شد');
      loadComments();
      loadDashboardData(token);
    } catch (error) {
      toast.error(lang === 'en' ? 'Failed to delete comment' : 'حذف نظر با خطا مواجه شد');
    }
  };

  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditCommentData({
      name: comment.name || '',
      email: comment.email || '',
      comment: comment.comment || '',
      rating: comment.rating || 0
    });
  };

  const handleSaveComment = async () => {
    if (!editingCommentId) return;
    
    try {
      await apiService.updateComment(editingCommentId, editCommentData, token);
      toast.success(lang === 'en' ? 'Comment updated successfully' : 'نظر با موفقیت به‌روزرسانی شد');
      setEditingCommentId(null);
      setEditCommentData({ name: '', email: '', comment: '', rating: 0 });
      loadComments();
    } catch (error) {
      toast.error(lang === 'en' ? 'Failed to update comment' : 'به‌روزرسانی نظر با خطا مواجه شد');
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentData({ name: '', email: '', comment: '', rating: 0 });
  };

  const handleReplyToComment = (comment: any) => {
    setReplyingToCommentId(comment.id);
    setReplyText('');
  };

  const handleSubmitReply = async (comment: any) => {
    if (!replyText.trim()) {
      toast.error(lang === 'en' ? 'Reply text is required' : 'متن پاسخ الزامی است');
      return;
    }

    try {
      await apiService.replyToComment({
        media_id: comment.media_id,
        media_type: comment.media_type,
        parent_id: comment.id,
        comment: replyText,
        name: replyName || 'Admin'
      }, token);
      
      toast.success(lang === 'en' ? 'Reply posted successfully' : 'پاسخ با موفقیت ثبت شد');
      setReplyingToCommentId(null);
      setReplyText('');
      loadComments();
    } catch (error) {
      toast.error(lang === 'en' ? 'Failed to post reply' : 'ثبت پاسخ با خطا مواجه شد');
    }
  };

  const handleCancelReply = () => {
    setReplyingToCommentId(null);
    setReplyText('');
  };

  const handleDeleteContactMessage = async (messageId: string) => {
    try {
      await apiService.deleteContactMessage(messageId, token);
      toast.success(lang === 'en' ? 'Message deleted' : 'پیام حذف شد');
      loadContactMessages();
    } catch (error) {
      toast.error(lang === 'en' ? 'Failed to delete message' : 'حذف پیام با خطا مواجه شد');
    }
  };

  const [editingSuggestion, setEditingSuggestion] = useState<{
    id: string;
    status: string;
    notes: string;
  } | null>(null);

  const handleUpdateSuggestionStatus = async (suggestionId: string, status: string, notes: string) => {
    try {
      await apiService.updateSuggestionStatus(suggestionId, status, notes, token);
      toast.success(lang === 'en' ? 'Suggestion status updated' : 'وضعیت پیشنهاد به‌روزرسانی شد');
      setEditingSuggestion(null);
      loadSuggestions();
      loadDashboardData(token);
    } catch (error) {
      toast.error(lang === 'en' ? 'Failed to update suggestion' : 'خطا در به‌روزرسانی پیشنهاد');
    }
  };

  const handleApproveSuggestion = async (suggestionId: string) => {
    const notes = prompt('Add notes (optional):');
    try {
      await apiService.approveSuggestion(suggestionId, notes || '', token);
      toast.success('Suggestion approved');
      loadSuggestions();
      loadDashboardData(token);
    } catch (error) {
      toast.error('Failed to approve suggestion');
    }
  };

  const handleRejectSuggestion = async (suggestionId: string) => {
    const notes = prompt('Reason for rejection:');
    if (!notes) return;
    
    try {
      await apiService.rejectSuggestion(suggestionId, notes, token);
      toast.success('Suggestion rejected');
      loadSuggestions();
      loadDashboardData(token);
    } catch (error) {
      toast.error('Failed to reject suggestion');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem] shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-2">Enter your secure password</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-center tracking-[0.5em]"
              required
            />
            
            <div className="flex justify-center">
              <Turnstile
                siteKey={API_CONFIG.TURNSTILE_SITE_KEY}
                onSuccess={(token) => {
                  console.log('Captcha verified:', token);
                  setCaptchaToken(token);
                }}
                onError={(error) => {
                  console.error('Captcha error:', error);
                  setCaptchaToken(null);
                }}
                onExpire={() => {
                  console.log('Captcha expired');
                  setCaptchaToken(null);
                }}
                theme="dark"
              />
            </div>

            {captchaToken && (
              <div className="text-center text-sm text-emerald-500">
                ✓ Captcha verified
              </div>
            )}

            <button
              type="submit"
              disabled={!captchaToken && password.length > 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {captchaToken ? 'Login to Dashboard' : 'Complete Captcha to Continue'}
            </button>
          </form>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your streaming platform</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setIsAuthenticated(false);
            setToken("");
            // Clear all session storage
            sessionStorage.removeItem('admin_token');
            sessionStorage.removeItem('admin_authenticated');
            sessionStorage.removeItem('admin_password');
            sessionStorage.removeItem('admin_bypass');
            
            // Dispatch custom event so App.tsx can react immediately
            window.dispatchEvent(new Event('adminAuthChanged'));
            
            toast.success(lang === 'en' ? "Logged out successfully" : "با موفقیت خارج شدید");
          }}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-gray-400 rounded-xl transition-all border border-white/10"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-4 rounded-2xl">
            <div className="text-blue-400 text-sm font-bold mb-1">Movies</div>
            <div className="text-3xl font-black text-white">{stats.movies || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-4 rounded-2xl">
            <div className="text-purple-400 text-sm font-bold mb-1">Series</div>
            <div className="text-3xl font-black text-white">{stats.series || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-4 rounded-2xl">
            <div className="text-emerald-400 text-sm font-bold mb-1">Episodes</div>
            <div className="text-3xl font-black text-white">{stats.episodes || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 p-4 rounded-2xl">
            <div className="text-orange-400 text-sm font-bold mb-1">Pending Comments</div>
            <div className="text-3xl font-black text-white">{stats.pendingComments || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 p-4 rounded-2xl">
            <div className="text-pink-400 text-sm font-bold mb-1">Suggestions</div>
            <div className="text-3xl font-black text-white">{stats.pendingSuggestions || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 p-4 rounded-2xl">
            <div className="text-cyan-400 text-sm font-bold mb-1">Contact Messages</div>
            <div className="text-3xl font-black text-white">{stats.contactMessages || 0}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-neutral-900 border border-neutral-800 p-2 rounded-2xl">
        {[
          { id: 'add', label: 'Add Content', icon: Plus },
          { id: 'movies', label: 'Movies', icon: Film },
          { id: 'series', label: 'Series', icon: Tv },
          { id: 'comments', label: 'Comments', icon: MessageSquare },
          { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
          { id: 'contact', label: 'Contact Messages', icon: Mail },
          { id: 'settings', label: 'Settings', icon: Construction },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ADD CONTENT TAB */}
        {activeTab === 'add' && (
          <Motion.div
            key="add"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {editingId ? (
                        <>
                          <Edit className="w-5 h-5 text-emerald-500" />
                          Editing {formData.type === 'movie' ? 'Movie' : 'Series'}
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 text-emerald-500" />
                          General Information
                        </>
                      )}
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Title (EN)</label>
                          <input
                            required
                            value={formData.title_en}
                            onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Title (FA)</label>
                          <input
                            required
                            value={formData.title_fa}
                            onChange={(e) => setFormData({...formData, title_fa: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">URL Slug (SEO Friendly)</label>
                        <div className="flex gap-2">
                          <input
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            placeholder="my-movie-slug"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const s = slugify(formData.title_en);
                              setFormData({...formData, slug: s});
                            }}
                            className="px-4 bg-white/5 hover:bg-emerald-600/20 text-gray-400 hover:text-emerald-500 rounded-xl transition-all border border-white/10"
                            title="Auto-generate from Title (EN)"
                          >
                            <LinkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type</label>
                          <div className="flex bg-neutral-800 p-1 rounded-xl">
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, type: 'movie'})}
                              className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${formData.type === 'movie' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                              <Film className="w-4 h-4" /> Movie
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, type: 'series'})}
                              className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${formData.type === 'series' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                              <Tv className="w-4 h-4" /> Series
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Release Year</label>
                          <input
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({...formData, year: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">IMDb Rating</label>
                          <input
                            type="number"
                            step="0.1"
                            value={formData.rating}
                            onChange={(e) => setFormData({...formData, rating: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quality</label>
                          <select
                            value={formData.quality}
                            onChange={(e) => setFormData({...formData, quality: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option>480p</option>
                            <option>720p</option>
                            <option>1080p</option>
                            <option>4K</option>
                          </select>
                        </div>
                      </div>

                      {/* Featured Checkbox */}
                      <div className="flex items-center gap-3 p-4 bg-emerald-600/10 border border-emerald-600/20 rounded-xl">
                        <input
                          id="featured-checkbox"
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                          className="w-5 h-5 rounded border-emerald-600 bg-neutral-800 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="featured-checkbox" className="text-sm font-bold text-emerald-400 cursor-pointer select-none">
                          ⭐ Feature this content in homepage slideshow
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Genres (comma separated)</label>
                        <input
                          placeholder="Action, Drama, Sci-Fi"
                          value={formData.genres}
                          onChange={(e) => setFormData({...formData, genres: e.target.value})}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Director</label>
                          <input
                            value={formData.director}
                            onChange={(e) => setFormData({...formData, director: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Director (FA)</label>
                          <input
                            value={formData.director_fa}
                            onChange={(e) => setFormData({...formData, director_fa: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 text-right"
                            dir="rtl"
                            placeholder="کارگردان"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Country (use codes like USA, CA)</label>
                          <input
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                            placeholder="USA, CA, UK"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Language (English)</label>
                          <input
                            value={formData.language}
                            onChange={(e) => setFormData({...formData, language: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                            placeholder="English"
                          />
                          <label className="text-xs font-bold text-gray-500 ml-1 mt-2 block">Language (Persian)</label>
                          <input
                            value={formData.language_fa}
                            onChange={(e) => setFormData({...formData, language_fa: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 text-right"
                            dir="rtl"
                            placeholder="انگلیسی"
                          />
                        </div>
                      </div>

                      {formData.type === 'movie' && (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Duration (minutes)</label>
                          <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            placeholder="120"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}

                      {formData.type === 'series' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Series Status</label>
                              <select
                                value={formData.seriesStatus}
                                onChange={(e) => setFormData({...formData, seriesStatus: e.target.value})}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                              >
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>

                            {formData.seriesStatus === 'ongoing' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Release Day</label>
                                  <select
                                    value={formData.releaseDayOfWeek}
                                    onChange={(e) => setFormData({...formData, releaseDayOfWeek: e.target.value})}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                                  >
                                    <option value="">Select Day</option>
                                    <option value="0">Sunday</option>
                                    <option value="1">Monday</option>
                                    <option value="2">Tuesday</option>
                                    <option value="3">Wednesday</option>
                                    <option value="4">Thursday</option>
                                    <option value="5">Friday</option>
                                    <option value="6">Saturday</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Release Time (24h)</label>
                                  <input
                                    type="time"
                                    value={formData.releaseTime}
                                    onChange={(e) => setFormData({...formData, releaseTime: e.target.value})}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {formData.seriesStatus === 'ongoing' && formData.releaseDayOfWeek !== '' && (
                            <div className="text-sm text-emerald-400 bg-emerald-600/10 border border-emerald-600/20 rounded-lg p-3">
                              ⏰ Next episode countdown will be automatically calculated and displayed on series detail page
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-emerald-500" />
                      Media Assets
                    </h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Poster URL</label>
                        <input
                          placeholder="https://example.com/poster.jpg"
                          value={formData.poster}
                          onChange={(e) => setFormData({...formData, poster: e.target.value})}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Backdrop URL</label>
                        <input
                          placeholder="https://example.com/backdrop.jpg"
                          value={formData.backdrop}
                          onChange={(e) => setFormData({...formData, backdrop: e.target.value})}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Trailer URL</label>
                        <input
                          placeholder="https://www.youtube.com/embed/... or https://www.imdb.com/video/..."
                          value={formData.trailerUrl}
                          onChange={(e) => setFormData({...formData, trailerUrl: e.target.value})}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] space-y-6">
                    <h2 className="text-xl font-bold text-white">Descriptions</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description (EN)</label>
                        <textarea
                          rows={4}
                          value={formData.description_en}
                          onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description (FA)</label>
                        <textarea
                          rows={4}
                          value={formData.description_fa}
                          onChange={(e) => setFormData({...formData, description_fa: e.target.value})}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 resize-none text-right"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] space-y-6">
                    <h2 className="text-xl font-bold text-white">Cast & Crew</h2>
                    <div className="space-y-6">
                      <label className="text-xs font-bold text-emerald-500 uppercase">3 Main Actors</label>
                      
                      {/* Actor 1 */}
                      <div className="space-y-3 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                        <label className="text-sm font-bold text-white">Actor 1</label>
                        <input
                          value={formData.actor1_avatar}
                          onChange={(e) => setFormData({...formData, actor1_avatar: e.target.value})}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                          placeholder="Avatar URL (optional)"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            value={formData.actor1_name}
                            onChange={(e) => setFormData({...formData, actor1_name: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                            placeholder="Actor Name (EN)"
                          />
                          <input
                            value={formData.actor1_character}
                            onChange={(e) => setFormData({...formData, actor1_character: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                            placeholder="Character Name (EN)"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <input
                            value={formData.actor1_name_fa}
                            onChange={(e) => setFormData({...formData, actor1_name_fa: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500 text-right"
                            placeholder="نام بازیگر (فارسی)"
                            dir="rtl"
                          />
                          <input
                            value={formData.actor1_character_fa}
                            onChange={(e) => setFormData({...formData, actor1_character_fa: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500 text-right"
                            placeholder="نام شخصیت (فارسی)"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      {/* Actor 2 */}
                      <div className="space-y-3 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                        <label className="text-sm font-bold text-white">Actor 2</label>
                        <input
                          value={formData.actor2_avatar}
                          onChange={(e) => setFormData({...formData, actor2_avatar: e.target.value})}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                          placeholder="Avatar URL (optional)"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            value={formData.actor2_name}
                            onChange={(e) => setFormData({...formData, actor2_name: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                            placeholder="Actor Name (EN)"
                          />
                          <input
                            value={formData.actor2_character}
                            onChange={(e) => setFormData({...formData, actor2_character: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                            placeholder="Character Name (EN)"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <input
                            value={formData.actor2_name_fa}
                            onChange={(e) => setFormData({...formData, actor2_name_fa: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500 text-right"
                            placeholder="نام بازیگر (فارسی)"
                            dir="rtl"
                          />
                          <input
                            value={formData.actor2_character_fa}
                            onChange={(e) => setFormData({...formData, actor2_character_fa: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500 text-right"
                            placeholder="نام شخصیت (فارسی)"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      {/* Actor 3 */}
                      <div className="space-y-3 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                        <label className="text-sm font-bold text-white">Actor 3</label>
                        <input
                          value={formData.actor3_avatar}
                          onChange={(e) => setFormData({...formData, actor3_avatar: e.target.value})}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                          placeholder="Avatar URL (optional)"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            value={formData.actor3_name}
                            onChange={(e) => setFormData({...formData, actor3_name: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                            placeholder="Actor Name (EN)"
                          />
                          <input
                            value={formData.actor3_character}
                            onChange={(e) => setFormData({...formData, actor3_character: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                            placeholder="Character Name (EN)"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <input
                            value={formData.actor3_name_fa}
                            onChange={(e) => setFormData({...formData, actor3_name_fa: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500 text-right"
                            placeholder="نام بازیگر (فارسی)"
                            dir="rtl"
                          />
                          <input
                            value={formData.actor3_character_fa}
                            onChange={(e) => setFormData({...formData, actor3_character_fa: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500 text-right"
                            placeholder="نام شخصیت (فارسی)"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.type === 'movie' && (
                    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] space-y-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-emerald-500" />
                        Streaming & Downloads
                      </h2>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Stream URL (Embed)</label>
                          <input
                            placeholder="https://player.example.com/embed/..."
                            value={formData.streamUrl}
                            onChange={(e) => {
                              let value = e.target.value;
                              // Auto-extract src from iframe if user pastes whole code
                              if (value.includes('<iframe')) {
                                const match = value.match(/src="([^"]+)"/);
                                if (match && match[1]) {
                                  value = match[1];
                                }
                              }
                              setFormData({...formData, streamUrl: value});
                            }}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Subtitle Link (Optional)</label>
                          <input
                            placeholder="https://example.com/subtitle.zip"
                            value={formData.subtitle_link}
                            onChange={(e) => setFormData({...formData, subtitle_link: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase">Download Links</label>
                            <button
                              type="button"
                              onClick={() => setDownloadLinks([...downloadLinks, { label: "", url: "" }])}
                              className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Add Quality
                            </button>
                          </div>
                          {downloadLinks.map((link, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                placeholder="Quality (e.g. 1080p)"
                                value={link.label}
                                onChange={(e) => {
                                  const newLinks = [...downloadLinks];
                                  newLinks[idx].label = e.target.value;
                                  setDownloadLinks(newLinks);
                                }}
                                className="w-32 bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                              />
                              <input
                                placeholder="Download URL"
                                value={link.url}
                                onChange={(e) => {
                                  const newLinks = [...downloadLinks];
                                  newLinks[idx].url = e.target.value;
                                  setDownloadLinks(newLinks);
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                              />
                              {downloadLinks.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setDownloadLinks(downloadLinks.filter((_, i) => i !== idx))}
                                  className="p-2 text-red-400 hover:text-red-500 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Series Episodes - Now managed via SeasonEpisodeManager component in Series tab */}

              <div className="flex gap-4">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        title_en: "",
                        title_fa: "",
                        slug: "",
                        type: formData.type,
                        year: new Date().getFullYear().toString(),
                        rating: "0",
                        poster: "",
                        backdrop: "",
                        description_en: "",
                        description_fa: "",
                        genres: "",
                        director: "",
                        director_fa: "",
                        country: "",
                        language: "",
                        language_fa: "",
                        actors_fa: "",
                        actor1_name: "",
                        actor1_character: "",
                        actor1_avatar: "",
                        actor1_name_fa: "",
                        actor1_character_fa: "",
                        actor2_name: "",
                        actor2_character: "",
                        actor2_avatar: "",
                        actor2_name_fa: "",
                        actor2_character_fa: "",
                        actor3_name: "",
                        actor3_character: "",
                        actor3_avatar: "",
                        actor3_name_fa: "",
                        actor3_character_fa: "",
                        quality: "1080p",
                        trailerUrl: "",
                        streamUrl: "",
                        duration: "120",
                        featured: false,
                        subtitle_link: "",
                        seriesStatus: "ongoing",
                        releaseDayOfWeek: "",
                        releaseTime: "20:00",
                      });
                      setDownloadLinks([{ label: "1080p", url: "" }]);
                      toast.info('Edit cancelled');
                    }}
                    className="flex-1 py-5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                  >
                    <XCircle className="w-6 h-6" />
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${editingId ? 'flex-1' : 'w-full'} py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 transition-all active:scale-[0.98]`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      {editingId ? 'Update Content' : 'Publish Content'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </Motion.div>
        )}

        {/* MOVIES TAB */}
        {activeTab === 'movies' && (
          <Motion.div
            key="movies"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {movies.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No movies yet. Add some from the "Add Content" tab!
              </div>
            ) : (
              movies.map((movie) => (
                <div key={movie.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {movie.poster_url && (
                      <img src={movie.poster_url} alt={typeof movie.title === 'string' ? movie.title : (movie.title_en || movie.title?.en || '')} className="w-16 h-24 object-cover rounded-lg" />
                    )}
                    <div>
                      <h3 className="text-white font-bold">{typeof movie.title === 'string' ? movie.title : (movie.title_en || movie.title?.en || '')}</h3>
                      <p className="text-gray-500 text-sm">{movie.year} • {movie.genres}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditMovie(movie)}
                      className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </Motion.div>
        )}

        {/* SERIES TAB */}
        {activeTab === 'series' && (
          <Motion.div
            key="series"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {series.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No series yet. Add some from the "Add Content" tab!
              </div>
            ) : (
              series.map((s) => (
                <div key={s.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {s.poster_url && (
                      <img src={s.poster_url} alt={typeof s.title === 'string' ? s.title : (s.title_en || s.title?.en || '')} className="w-16 h-24 object-cover rounded-lg" />
                    )}
                    <div>
                      <h3 className="text-white font-bold">{typeof s.title === 'string' ? s.title : (s.title_en || s.title?.en || '')}</h3>
                      <p className="text-gray-500 text-sm">{s.year} • {s.total_seasons} Season(s) • {s.genres}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setManagingSeriesId(s.id);
                        setManagingSeriesTitle(typeof s.title === 'string' ? s.title : (s.title_en || s.title?.en || ''));
                      }}
                      className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                      <List className="w-4 h-4" />
                      Manage Episodes
                    </button>
                    <button
                      onClick={() => handleEditSeries(s)}
                      className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSeries(s.id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </Motion.div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === 'comments' && (
          <Motion.div
            key="comments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* View Toggle */}
            <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
              <button
                onClick={() => setCommentsView('pending')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  commentsView === 'pending' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-neutral-800 text-gray-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'Pending Approval' : 'در انتظار تایید'} ({comments.length})
              </button>
              <button
                onClick={() => setCommentsView('all')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  commentsView === 'all' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-neutral-800 text-gray-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'All Comments' : 'همه نظرات'} ({allComments.length})
              </button>
            </div>

            {/* Pending Comments View */}
            {commentsView === 'pending' && (
              comments.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  {lang === 'en' ? 'No pending comments!' : 'نظری در انتظار تایید نیست!'}
                </div>
              ) : (
                comments.map((comment) => (
                <div key={comment.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold text-lg">{comment.name}</h4>
                        {comment.rating > 0 && (
                          <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-xs font-black">
                            <Star className="w-3 h-3 fill-current" />
                            {comment.rating}
                          </div>
                        )}
                        {comment.parent_id && (
                          <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {lang === 'en' ? 'Reply' : 'پاسخ'}
                          </span>
                        )}
                      </div>
                      <p className="text-emerald-500 text-sm font-medium mb-2">{comment.email}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <span className="bg-neutral-800 px-2 py-1 rounded">Media: {comment.media_title || comment.media_id}</span>
                        <span>{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveComment(comment.id)}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {lang === 'en' ? 'Approve' : 'تایید'}
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        {lang === 'en' ? 'Delete' : 'حذف'}
                      </button>
                    </div>
                  </div>
                  <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.comment}</p>
                  </div>
                </div>
              ))
            ))}

            {/* All Comments View */}
            {commentsView === 'all' && (
              allComments.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  {lang === 'en' ? 'No comments yet!' : 'هنوز نظری ثبت نشده!'}
                </div>
              ) : (
                allComments.map((comment) => (
                  <div key={comment.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                    {editingCommentId === comment.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-400 text-sm block mb-2">{lang === 'en' ? 'Name' : 'نام'}</label>
                            <input
                              type="text"
                              value={editCommentData.name}
                              onChange={(e) => setEditCommentData({ ...editCommentData, name: e.target.value })}
                              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm block mb-2">{lang === 'en' ? 'Email' : 'ایمیل'}</label>
                            <input
                              type="email"
                              value={editCommentData.email}
                              onChange={(e) => setEditCommentData({ ...editCommentData, email: e.target.value })}
                              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm block mb-2">{lang === 'en' ? 'Comment' : 'نظر'}</label>
                          <textarea
                            value={editCommentData.comment}
                            onChange={(e) => setEditCommentData({ ...editCommentData, comment: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[100px]"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm block mb-2">{lang === 'en' ? 'Rating' : 'امتیاز'}</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={editCommentData.rating}
                            onChange={(e) => setEditCommentData({ ...editCommentData, rating: parseFloat(e.target.value) || 0 })}
                            className="w-32 bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveComment}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            {lang === 'en' ? 'Save' : 'ذخیره'}
                          </button>
                          <button
                            onClick={handleCancelEditComment}
                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-400 rounded-xl font-bold text-sm transition-all"
                          >
                            {lang === 'en' ? 'Cancel' : 'لغو'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-bold text-lg">{comment.name}</h4>
                              {comment.is_admin && (
                                <span className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-purple-500/30">
                                  {lang === 'en' ? 'ADMIN' : 'ادمین'}
                                </span>
                              )}
                              {comment.rating > 0 && (
                                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-xs font-black">
                                  <Star className="w-3 h-3 fill-current" />
                                  {comment.rating}
                                </div>
                              )}
                              {comment.parent_id && (
                                <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                  {lang === 'en' ? 'Reply' : 'پاسخ'}
                                </span>
                              )}
                              {comment.approved === 1 ? (
                                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                  {lang === 'en' ? 'Approved' : 'تایید شده'}
                                </span>
                              ) : (
                                <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                  {lang === 'en' ? 'Pending' : 'در انتظار'}
                                </span>
                              )}
                            </div>
                            <p className="text-emerald-500 text-sm font-medium mb-2">{comment.email}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                              <span className="bg-neutral-800 px-2 py-1 rounded">Media: {comment.media_title || comment.media_id}</span>
                              <span>{new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReplyToComment(comment)}
                              className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {lang === 'en' ? 'Reply' : 'پاسخ'}
                            </button>
                            <button
                              onClick={() => handleEditComment(comment)}
                              className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              {lang === 'en' ? 'Edit' : 'ویرایش'}
                            </button>
                            {comment.approved === 0 && (
                              <button
                                onClick={() => handleApproveComment(comment.id)}
                                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                {lang === 'en' ? 'Approve' : 'تایید'}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              {lang === 'en' ? 'Delete' : 'حذف'}
                            </button>
                          </div>
                        </div>
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.comment}</p>
                        </div>

                        {/* Admin Reply Form */}
                        {replyingToCommentId === comment.id && (
                          <div className="mt-4 bg-gradient-to-br from-purple-500/5 to-purple-600/5 border border-purple-500/20 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                              <MessageCircle className="w-5 h-5 text-purple-400" />
                              <h5 className="text-purple-400 font-bold">{lang === 'en' ? 'Reply as Admin' : 'پاسخ به عنوان ادمین'}</h5>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="text-gray-400 text-sm block mb-2">{lang === 'en' ? 'Admin Name' : 'نام ادمین'}</label>
                                <input
                                  type="text"
                                  value={replyName}
                                  onChange={(e) => setReplyName(e.target.value)}
                                  placeholder="Admin"
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                              </div>
                              <div>
                                <label className="text-gray-400 text-sm block mb-2">{lang === 'en' ? 'Reply Text' : 'متن پاسخ'}</label>
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={lang === 'en' ? 'Write your reply...' : 'پاسخ خود را بنویسید...'}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[100px]"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSubmitReply(comment)}
                                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                >
                                  <Send className="w-4 h-4" />
                                  {lang === 'en' ? 'Post Reply' : 'ارسال پاسخ'}
                                </button>
                                <button
                                  onClick={handleCancelReply}
                                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-400 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                >
                                  <X className="w-4 h-4" />
                                  {lang === 'en' ? 'Cancel' : 'لغو'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              )
            )}
          </Motion.div>
        )}

        {/* SUGGESTIONS TAB */}
        {activeTab === 'suggestions' && (
          <Motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2 mb-6 bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
              <button
                onClick={() => setSuggestionsFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  suggestionsFilter === 'all'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {lang === 'en' ? 'All' : 'همه'} ({suggestions.length})
              </button>
              <button
                onClick={() => setSuggestionsFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  suggestionsFilter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                🟡 {lang === 'en' ? 'Pending' : 'در انتظار'} ({suggestions.filter(s => s.status === 'pending').length})
              </button>
              <button
                onClick={() => setSuggestionsFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  suggestionsFilter === 'approved'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                ✅ {lang === 'en' ? 'Approved' : 'تایید شده'} ({suggestions.filter(s => s.status === 'approved').length})
              </button>
              <button
                onClick={() => setSuggestionsFilter('in_progress')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  suggestionsFilter === 'in_progress'
                    ? 'bg-blue-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                🔄 {lang === 'en' ? 'In Progress' : 'در حال انجام'} ({suggestions.filter(s => s.status === 'in_progress').length})
              </button>
              <button
                onClick={() => setSuggestionsFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  suggestionsFilter === 'completed'
                    ? 'bg-purple-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                🎉 {lang === 'en' ? 'Completed' : 'انجام شده'} ({suggestions.filter(s => s.status === 'completed').length})
              </button>
              <button
                onClick={() => setSuggestionsFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  suggestionsFilter === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                🔴 {lang === 'en' ? 'Rejected' : 'رد شده'} ({suggestions.filter(s => s.status === 'rejected').length})
              </button>
            </div>

            {suggestions.filter(s => suggestionsFilter === 'all' || s.status === suggestionsFilter).length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                {lang === 'en' ? `No ${suggestionsFilter === 'all' ? '' : suggestionsFilter} suggestions!` : `پیشنهادی وجود ندارد!`}
              </div>
            ) : (
              suggestions.filter(s => suggestionsFilter === 'all' || s.status === suggestionsFilter).map((suggestion) => (
                <div key={suggestion.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                  {editingSuggestion?.id === suggestion.id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-bold mb-2">{suggestion.title}</h4>
                        <p className="text-gray-500 text-sm mb-4">From: {suggestion.name} ({suggestion.email})</p>
                        {suggestion.description && (
                          <p className="text-gray-300 mb-4">{suggestion.description}</p>
                        )}
                        {suggestion.imdb_link && (
                          <a href={suggestion.imdb_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline mb-4 block">
                            IMDb Link →
                          </a>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-2">
                            {lang === 'en' ? 'STATUS' : 'وضعیت'}
                          </label>
                          <select
                            value={editingSuggestion.status}
                            onChange={(e) => setEditingSuggestion({...editingSuggestion, status: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="pending">{lang === 'en' ? 'Pending' : 'در انتظار'}</option>
                            <option value="approved">{lang === 'en' ? 'Approved' : 'تایید شده'}</option>
                            <option value="in_progress">{lang === 'en' ? 'In Progress' : 'در حال انجام'}</option>
                            <option value="completed">{lang === 'en' ? 'Completed' : 'انجام شده'}</option>
                            <option value="rejected">{lang === 'en' ? 'Rejected' : 'رد شده'}</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-2">
                            {lang === 'en' ? 'ADMIN NOTES (visible to users)' : 'یادداشت مدیر (قابل مشاهده برای کاربران)'}
                          </label>
                          <textarea
                            value={editingSuggestion.notes}
                            onChange={(e) => setEditingSuggestion({...editingSuggestion, notes: e.target.value})}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                            rows={3}
                            placeholder={lang === 'en' ? 'Add notes for users...' : 'یادداشتی برای کاربران اضافه کنید...'}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateSuggestionStatus(suggestion.id, editingSuggestion.status, editingSuggestion.notes)}
                            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-all"
                          >
                            {lang === 'en' ? 'Save' : 'ذخیره'}
                          </button>
                          <button
                            onClick={() => setEditingSuggestion(null)}
                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold transition-all"
                          >
                            {lang === 'en' ? 'Cancel' : 'لغو'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-white font-bold">{suggestion.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              suggestion.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                              suggestion.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                              suggestion.status === 'completed' ? 'bg-purple-500/10 text-purple-400' :
                              suggestion.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                              'bg-gray-500/10 text-gray-400'
                            }`}>
                              {suggestion.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">From: {suggestion.name} ({suggestion.email})</p>
                          {suggestion.imdb_link && (
                            <a href={suggestion.imdb_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">
                              IMDb Link →
                            </a>
                          )}
                          {suggestion.notes && (
                            <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-300">
                              <strong>Note:</strong> {suggestion.notes}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setEditingSuggestion({ id: suggestion.id, status: suggestion.status || 'pending', notes: suggestion.notes || '' })}
                          className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg font-bold text-sm transition-all flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          {lang === 'en' ? 'Edit' : 'ویرایش'}
                        </button>
                      </div>
                      {suggestion.description && (
                        <p className="text-gray-300">{suggestion.description}</p>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </Motion.div>
        )}

        {/* CONTACT MESSAGES TAB */}
        {activeTab === 'contact' && (
          <Motion.div
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {contactMessages.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                {lang === 'en' ? 'No contact messages yet!' : 'هنوز پیامی دریافت نشده!'}
              </div>
            ) : (
              contactMessages.map((message) => (
                <div key={message.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold text-lg">{message.name}</h4>
                        {message.subject && (
                          <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {message.subject}
                          </span>
                        )}
                      </div>
                      <p className="text-emerald-500 text-sm font-medium mb-2">{message.email}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US', { 
                          dateStyle: 'full', 
                          timeStyle: 'short' 
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteContactMessage(message.id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {lang === 'en' ? 'Delete' : 'حذف'}
                    </button>
                  </div>
                  <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              ))
            )}
          </Motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <Motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Construction className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-white">Under Construction Mode</h3>
                  </div>
                  <p className="text-gray-400 mb-4">
                    When enabled, only admins with valid password can access the website. 
                    Regular visitors will see an "Under Construction" page.
                  </p>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-yellow-400 text-sm">
                      <strong>Note:</strong> You can bypass the construction page by visiting /admin and entering your password.
                    </p>
                  </div>
                </div>
                <div className="ml-6">
                  <button
                    onClick={toggleUnderConstruction}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                      underConstructionMode ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        underConstructionMode ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <div className="text-center mt-2">
                    <span className={`text-sm font-bold ${underConstructionMode ? 'text-yellow-500' : 'text-gray-500'}`}>
                      {underConstructionMode ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Admin Information</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex justify-between">
                  <span>Admin Buttons:</span>
                  <span className="text-white">Hidden from public</span>
                </div>
                <div className="flex justify-between">
                  <span>Login Security:</span>
                  <span className="text-emerald-500">Captcha Protected ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Construction Mode:</span>
                  <span className={underConstructionMode ? 'text-yellow-500' : 'text-gray-500'}>
                    {underConstructionMode ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Quick Tips</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Admin buttons are hidden from navbar and footer for security</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Access admin panel directly via /admin URL</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Captcha verification prevents automated attacks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Under Construction mode perfect for maintenance or updates</span>
                </li>
              </ul>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Season/Episode Manager Modal */}
      {managingSeriesId && (
        <SeasonEpisodeManager
          seriesId={managingSeriesId}
          seriesTitle={managingSeriesTitle}
          token={token}
          onClose={() => {
            setManagingSeriesId(null);
            setManagingSeriesTitle("");
          }}
          onUpdate={() => {
            loadSeries();
            loadDashboardData(token);
          }}
        />
      )}
    </div>
  );
};