import { useLanguage } from '@/app/context/LanguageContext';
import { Send, Lightbulb, Film, Tv, Globe, Calendar, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Turnstile } from '@/app/components/ui/Turnstile';
import { API_CONFIG, apiService } from '@/app/config/api';
import { SEO } from '@/app/components/SEO';

interface Suggestion {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'website';
  description: string;
  status: 'approved' | 'in_progress' | 'completed' | 'rejected';
  notes: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

export const Suggestions: React.FC = () => {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    type: 'movie' as 'movie' | 'series' | 'website',
    imdb_link: '',
    description: '',
  });
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'rejected'>('all');

  // Approved suggestions loaded from API
  const [approvedSuggestions, setApprovedSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load approved suggestions on mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const result = await apiService.getApprovedSuggestions();
        setApprovedSuggestions(result.suggestions || []);
      } catch (error) {
        // Silently fail - just show empty list
      } finally {
        setIsLoading(false);
      }
    };
    loadSuggestions();
  }, []);

  const content = {
    en: {
      title: 'Suggestions',
      subtitle: 'Share your ideas to help us improve',
      form: {
        title: 'Submit Your Suggestion',
        name: 'Your Name',
        namePlaceholder: 'Enter your name',
        email: 'Email Address',
        emailPlaceholder: 'your.email@example.com',
        movieTitle: 'Movie/Series Title',
        movieTitlePlaceholder: 'e.g., Inception',
        imdbLink: 'IMDb Link (Optional)',
        imdbLinkPlaceholder: 'https://www.imdb.com/title/...',
        type: 'Suggestion Type',
        typeMovie: 'Movie Request',
        typeSeries: 'Series Request',
        typeWebsite: 'Website Request',
        description: 'Description (Optional)',
        descriptionPlaceholder: 'Tell us more...',
        submit: 'Submit Suggestion',
        submitting: 'Submitting...',
      },
      approved: {
        title: 'Approved Suggestions',
        subtitle: 'Ideas from our community that we\'re working on',
        empty: 'No approved suggestions yet. Be the first to suggest!',
        likes: 'Likes',
      },
      successMessage: 'Thank you! Your suggestion has been submitted. We\'ll review it soon.',
      errorMessage: 'Oops! Something went wrong. Please try again later.',
      typeLabels: {
        movie: 'Movie',
        series: 'Series',
        website: 'Website',
      },
      statusLabels: {
        approved: 'Approved',
        in_progress: 'In Progress',
        completed: 'Completed',
        rejected: 'Rejected',
      },
    },
    fa: {
      title: 'پیشنهادات',
      subtitle: 'ایده‌های خود را به اشتراک بگذارید تا به بهبود ما کمک کنید',
      form: {
        title: 'ارسال پیشنهاد شما',
        name: 'نام شما',
        namePlaceholder: 'نام خود را وارد کنید',
        email: 'آدرس ایمیل',
        emailPlaceholder: 'your.email@example.com',
        movieTitle: 'عنوان فیلم/سریال',
        movieTitlePlaceholder: 'مثال: تاریکی مطلق',
        imdbLink: 'لینک IMDb (اختیاری)',
        imdbLinkPlaceholder: 'https://www.imdb.com/title/...',
        type: 'نوع پیشنهاد',
        typeMovie: 'درخواست فیلم',
        typeSeries: 'درخواست سریال',
        typeWebsite: 'درخواست وبسایت',
        description: 'توضیحات (اختیاری)',
        descriptionPlaceholder: 'اطلاعات بیشتر...',
        submit: 'ارسال پیشنهاد',
        submitting: 'در حال ارسال...',
      },
      approved: {
        title: 'پیشنهادات تایید شده',
        subtitle: 'ایده‌هایی از جامعه ما که روی آنها کار می‌کنیم',
        empty: 'هنوز پیشنهاد تایید شده‌ای وجود ندارد. اولین نفر باشید که پیشنهاد می‌دهد!',
        likes: 'پسندیده‌ها',
      },
      successMessage: 'متشکریم! پیشنهاد شما ارسال شد. به زودی آن را بررسی خواهیم کرد.',
      errorMessage: 'اوه! مشکلی پیش آمد. لطفاً بعداً دوباره امتحان کنید.',
      typeLabels: {
        movie: 'فیلم',
        series: 'سریال',
        website: 'وبسایت',
      },
      statusLabels: {
        approved: 'تایید شده',
        in_progress: 'در حال انجام',
        completed: 'انجام شده',
        rejected: 'رد شده',
      },
    },
  };

  const currentContent = content[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast.error(lang === 'en' ? 'Please complete the captcha' : 'لطفاً کپچا را کامل کنید');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.submitSuggestion({
        name: formData.name,
        email: formData.email,
        title: formData.title,
        type: formData.type as 'movie' | 'series' | 'website',
        imdb_link: formData.imdb_link,
        description: formData.description,
        captcha: captchaToken,
      });
      
      // Show success toast
      toast.success(currentContent.successMessage, {
        description: lang === 'en' ? 'Your suggestion will be reviewed by our team' : 'پیشنهاد شما توسط تیم ما بررسی خواهد شد',
      });
      
      setFormData({ name: '', email: '', title: '', type: 'movie', imdb_link: '', description: '' });
      setCaptchaToken('');
    } catch (error) {
      // Show error toast
      toast.error(currentContent.errorMessage, {
        description: lang === 'en' ? 'Please try again or contact support' : 'لطفاً دوباره امتحان کنید یا با پشتیبانی تماس بگیرید',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <Film className="w-5 h-5" />;
      case 'series':
        return <Tv className="w-5 h-5" />;
      case 'website':
        return <Globe className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Filter suggestions by status
  const filteredSuggestions = statusFilter === 'all' 
    ? approvedSuggestions 
    : approvedSuggestions.filter(s => s.status === statusFilter);

  const paginatedSuggestions = filteredSuggestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);

  return (
    <>
      <SEO
        title={lang === 'en' ? 'Suggest Content - Request Movies & Series | cinestream' : 'پیشنهاد محتوا - درخواست فیلم و سریال | گرین پیکسل'}
        description={lang === 'en' 
          ? 'Suggest movies, TV series, or website features you\'d like to see on cinestream. We value your input and work to add your requested content.'
          : 'فیلم، سریال یا ویژگی‌های وب‌سایتی که می‌خواهید در گرین پیکسل ببینید را پیشنهاد دهید. ما ارزش نظرات شما را می‌دانیم و برای اضافه کردن محتوای درخواستی شما تلاش می‌کنیم.'
        }
        keywords={lang === 'en'
          ? 'suggest movies, request series, content suggestions, feature requests, cinestream suggestions'
          : 'پیشنهاد فیلم, درخواست سریال, پیشنهادات محتوا, درخواست ویژگی, پیشنهادات گرین پیکسل'
        }
        lang={lang}
        canonicalUrl={`https://cinestream.com/${lang}/suggestions`}
        alternateUrls={[
          { lang: 'en', url: 'https://cinestream.com/en/suggestions' },
          { lang: 'fa', url: 'https://cinestream.com/fa/suggestions' }
        ]}
      />
      <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
              <Lightbulb className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {currentContent.title}
            </h1>
            <p className="text-neutral-400 text-lg">
              {currentContent.subtitle}
            </p>
          </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Suggestion Form */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Send className="w-6 h-6 text-emerald-500" />
              {currentContent.form.title}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  {currentContent.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={currentContent.form.namePlaceholder}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  {currentContent.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={currentContent.form.emailPlaceholder}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <div className="mt-2 flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-300">
                    {lang === 'en'
                      ? 'We will never share your email address with anyone. Your privacy is our priority.'
                      : 'ما هرگز آدرس ایمیل شما را با کسی به اشتراک نمی‌گذاریم. حریم خصوصی شما اولویت ماست.'}
                  </p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-white font-medium mb-2">
                  {currentContent.form.movieTitle}
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder={currentContent.form.movieTitlePlaceholder}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-white font-medium mb-2">
                  {currentContent.form.type}
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="movie">{currentContent.form.typeMovie}</option>
                  <option value="series">{currentContent.form.typeSeries}</option>
                  <option value="website">{currentContent.form.typeWebsite}</option>
                </select>
              </div>

              {/* IMDb Link */}
              <div>
                <label htmlFor="imdb_link" className="block text-white font-medium mb-2">
                  {currentContent.form.imdbLink}
                </label>
                <input
                  type="url"
                  id="imdb_link"
                  name="imdb_link"
                  value={formData.imdb_link}
                  onChange={handleChange}
                  placeholder={currentContent.form.imdbLinkPlaceholder}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-white font-medium mb-2">
                  {currentContent.form.description}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder={currentContent.form.descriptionPlaceholder}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              {/* Captcha */}
              <div className="flex justify-center">
                <Turnstile
                  siteKey={API_CONFIG.TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setCaptchaToken(token)}
                  options={{
                    theme: 'dark',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{currentContent.form.submitting}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{currentContent.form.submit}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                {lang === 'en' ? 'How It Works' : 'چگونه کار می‌کند'}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-neutral-300">
                    {lang === 'en' 
                      ? 'Submit your suggestion using the form' 
                      : 'پیشنهاد خود را با استفاده از فرم ارسال کنید'}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-neutral-300">
                    {lang === 'en' 
                      ? 'Our team reviews all suggestions carefully' 
                      : 'تیم ما تمام پیشنهادات را با دقت بررسی می‌کند'}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-neutral-300">
                    {lang === 'en' 
                      ? 'Approved suggestions appear in the list below' 
                      : 'پیشنهادات تایید شده در لیست زیر ظاهر می‌شوند'}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p className="text-neutral-300">
                    {lang === 'en' 
                      ? 'We work on implementing the most popular ones' 
                      : 'ما روی پیاده‌سازی محبوب‌ترین‌ها کار می‌کنیم'}
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                {lang === 'en' ? 'Suggestion Guidelines' : 'راهنمای پیشنهادات'}
              </h3>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>
                    {lang === 'en' 
                      ? 'Be specific about what you want' 
                      : 'در مورد آنچه می‌خواهید مشخص باشید'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>
                    {lang === 'en' 
                      ? 'Check if it hasn\'t been suggested before' 
                      : 'بررسی کنید که قبلاً پیشنهاد نشده باشد'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>
                    {lang === 'en' 
                      ? 'Explain why it would be valuable' 
                      : 'توضیح دهید چرا ارزشمند خواهد بود'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Approved Suggestions */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {currentContent.approved.title}
            </h2>
            <p className="text-neutral-400">
              {currentContent.approved.subtitle}
            </p>
          </div>

          {/* Status Filter Tabs */}
          {approvedSuggestions.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              <button
                onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === 'all'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-emerald-500/30'
                }`}
              >
                {lang === 'en' ? 'All' : 'همه'} ({approvedSuggestions.length})
              </button>
              <button
                onClick={() => { setStatusFilter('in_progress'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === 'in_progress'
                    ? 'bg-blue-500 text-white'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-blue-500/30'
                }`}
              >
                {lang === 'en' ? '🔄 In Progress' : '🔄 در حال انجام'} ({approvedSuggestions.filter(s => s.status === 'in_progress').length})
              </button>
              <button
                onClick={() => { setStatusFilter('completed'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-purple-500 text-white'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-purple-500/30'
                }`}
              >
                {lang === 'en' ? '✅ Completed' : '✅ انجام شده'} ({approvedSuggestions.filter(s => s.status === 'completed').length})
              </button>
              <button
                onClick={() => { setStatusFilter('rejected'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-red-500/30'
                }`}
              >
                {lang === 'en' ? '❌ Rejected' : '❌ رد شده'} ({approvedSuggestions.filter(s => s.status === 'rejected').length})
              </button>
            </div>
          )}

          {filteredSuggestions.length === 0 && approvedSuggestions.length > 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-lg">
              <Lightbulb className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg">
                {lang === 'en' ? `No ${statusFilter.replace('_', ' ')} suggestions yet.` : `پیشنهادی با وضعیت ${currentContent.statusLabels[statusFilter as keyof typeof currentContent.statusLabels]} وجود ندارد.`}
              </p>
            </div>
          ) : approvedSuggestions.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-lg">
              <Lightbulb className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg">
                {currentContent.approved.empty}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {paginatedSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500">
                          {getTypeIcon(suggestion.type)}
                        </div>
                        <span className="inline-block px-3 py-1 bg-neutral-800 text-emerald-500 text-xs font-medium rounded-full">
                          {currentContent.typeLabels[suggestion.type]}
                        </span>
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                          suggestion.status === 'completed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          suggestion.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          suggestion.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {currentContent.statusLabels[suggestion.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(suggestion.created_at)}</span>
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-1">
                      {suggestion.title}
                    </h3>

                    {suggestion.name && (
                      <p className="text-neutral-500 text-xs mb-3">
                        {lang === 'en' ? 'Suggested by' : 'پیشنهاد شده توسط'} <span className="text-emerald-400 font-medium">{suggestion.name}</span>
                      </p>
                    )}

                    {suggestion.description && (
                      <p className="text-neutral-400 mb-3 leading-relaxed text-sm">
                        {suggestion.description}
                      </p>
                    )}

                    {suggestion.notes && (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs font-bold text-blue-400 mb-1">
                          {lang === 'en' ? '📝 Admin Note:' : '📝 یادداشت مدیر:'}
                        </p>
                        <p className="text-sm text-blue-300 leading-relaxed">
                          {suggestion.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {lang === 'en' ? (
                      <ChevronLeft className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? 'bg-emerald-500 text-white'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-emerald-500/30'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {lang === 'en' ? (
                      <ChevronRight className="w-5 h-5" />
                    ) : (
                      <ChevronLeft className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};