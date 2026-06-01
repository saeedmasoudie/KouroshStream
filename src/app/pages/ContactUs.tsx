import { useLanguage } from '@/app/context/LanguageContext';
import { Mail, Send, User, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Turnstile } from '@/app/components/ui/Turnstile';
import { API_CONFIG, apiService } from '@/app/config/api';
import { rateLimiter, RATE_LIMITS } from '@/app/utils/rateLimiter';
import { useHoneypot, HoneypotInput, useFormTimingCheck } from '@/app/utils/honeypot';
import { SEO } from '@/app/components/SEO';

export const ContactUs: React.FC = () => {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Security: Honeypot for spam detection
  const { honeypotField, honeypotValue, setHoneypotValue, isBot } = useHoneypot();
  
  // Security: Form timing check
  const { isSubmittedTooQuickly } = useFormTimingCheck(3000);
  
  // Check rate limit status
  const [rateLimitInfo, setRateLimitInfo] = useState({
    remaining: RATE_LIMITS.CONTACT_FORM.maxRequests,
    timeUntilReset: 0,
  });

  useEffect(() => {
    // Update rate limit info
    const updateRateLimitInfo = () => {
      const remaining = rateLimiter.getRemainingRequests('contact-form', RATE_LIMITS.CONTACT_FORM);
      const timeUntilReset = rateLimiter.getTimeUntilReset('contact-form', RATE_LIMITS.CONTACT_FORM);
      setRateLimitInfo({ remaining, timeUntilReset });
    };

    updateRateLimitInfo();
    const interval = setInterval(updateRateLimitInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const content = {
    en: {
      title: 'Contact Us',
      subtitle: 'Have questions or feedback? We\'d love to hear from you',
      form: {
        name: 'Your Name',
        namePlaceholder: 'Enter your name',
        email: 'Email Address',
        emailPlaceholder: 'your.email@example.com',
        subject: 'Subject',
        subjectPlaceholder: 'What is this about?',
        message: 'Message',
        messagePlaceholder: 'Write your message here...',
        submit: 'Send Message',
        submitting: 'Sending...',
      },
      contactInfo: {
        title: 'Other Ways to Reach Us',
        email: {
          title: 'Email',
          description: 'Send us an email anytime',
          value: 'info@cinestream.com',
        },
        telegram: {
          title: 'Telegram Channel',
          description: 'Join our community',
          value: '@cinestream',
          button: 'Join Channel',
        },
      },
      successMessage: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
      errorMessage: 'Oops! Something went wrong. Please try again later.',
    },
    fa: {
      title: 'تماس با ما',
      subtitle: 'سوال یا بازخوردی دارید؟ دوست داریم از شما بشنویم',
      form: {
        name: 'نام شما',
        namePlaceholder: 'نام خود را وارد کنید',
        email: 'آدرس ایمیل',
        emailPlaceholder: 'your.email@example.com',
        subject: 'موضوع',
        subjectPlaceholder: 'در مورد چه موضوعی است؟',
        message: 'پیام',
        messagePlaceholder: 'پیام خود را اینجا بنویسید...',
        submit: 'ارسال پیام',
        submitting: 'در حال ارسال...',
      },
      contactInfo: {
        title: 'راه‌های دیگر برای تماس',
        email: {
          title: 'ایمیل',
          description: 'هر زمان برای ما ایمیل بفرستید',
          value: 'info@cinestream.com',
        },
        telegram: {
          title: 'کانال تلگرام',
          description: 'به جامعه ما بپیوندید',
          value: '@cinestream',
          button: 'عضویت در کانال',
        },
      },
      successMessage: 'متشکریم! پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.',
      errorMessage: 'اوه! مشکلی پیش آمد. لطفاً بعداً دوباره امتحان کنید.',
    },
  };

  const currentContent = content[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security Check 1: Captcha validation
    if (!captchaToken) {
      toast.error(lang === 'en' ? 'Please complete the captcha' : 'لطفاً کپچا را کامل کنید');
      return;
    }

    // Security Check 2: Honeypot (bot detection)
    if (isBot) {
      console.log('Spam detected: honeypot triggered');
      toast.error(lang === 'en' ? 'Spam detected. Please try again.' : 'اسپم شناسایی شد. لطفاً دوباره امتحان کنید.');
      return;
    }

    // Security Check 3: Form timing (submitted too quickly)
    if (isSubmittedTooQuickly()) {
      console.log('Spam detected: submitted too quickly');
      toast.error(lang === 'en' ? 'Please take your time filling out the form.' : 'لطفاً برای پر کردن فرم وقت بگذارید.');
      return;
    }

    // Security Check 4: Rate limiting
    if (!rateLimiter.checkRateLimit('contact-form', RATE_LIMITS.CONTACT_FORM)) {
      const timeUntilReset = rateLimiter.getTimeUntilReset('contact-form', RATE_LIMITS.CONTACT_FORM);
      const minutes = Math.ceil(timeUntilReset / 60000);
      toast.error(
        lang === 'en' 
          ? `Rate limit exceeded. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
          : `محدودیت سرعت تجاوز کرد. لطفاً ${minutes} دقیقه دیگر امتحان کنید.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.submitContact({
        ...formData,
        captcha: captchaToken,
      });
      
      // Show success toast
      toast.success(currentContent.successMessage, {
        description: lang === 'en' ? 'We will respond within 24 hours' : 'ما ظرف ۲۴ ساعت پاسخ خواهیم داد',
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
      setCaptchaToken('');
      
      // Update rate limit display
      setRateLimitInfo({
        remaining: rateLimiter.getRemainingRequests('contact-form', RATE_LIMITS.CONTACT_FORM),
        timeUntilReset: rateLimiter.getTimeUntilReset('contact-form', RATE_LIMITS.CONTACT_FORM),
      });
    } catch (error) {
      // Show error toast
      toast.error(currentContent.errorMessage, {
        description: lang === 'en' ? 'Please try again or contact us via email' : 'لطفاً دوباره امتحان کنید یا از طریق ایمیل تماس بگیرید',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <SEO
        title={lang === 'en' ? 'Contact Us - cinestream' : 'تماس با ما - گرین پیکسل'}
        description={lang === 'en' 
          ? 'Get in touch with cinestream. Have questions or feedback? We\'d love to hear from you. Contact our support team for assistance.'
          : 'با گرین پیکسل در ارتباط باشید. سوالات یا بازخورد دارید؟ دوست داریم از شما بشنویم. برای کمک با تیم پشتیبانی ما تماس بگیرید.'
        }
        keywords={lang === 'en'
          ? 'contact cinestream, support, customer service, feedback, help'
          : 'تماس گرین پیکسل, پشتیبانی, خدمات مشتری, بازخورد, کمک'
        }
        lang={lang}
        canonicalUrl={`https://cinestream.com/${lang}/contact`}
        alternateUrls={[
          { lang: 'en', url: 'https://cinestream.com/en/contact' },
          { lang: 'fa', url: 'https://cinestream.com/fa/contact' }
        ]}
      />
      <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {currentContent.title}
            </h1>
            <p className="text-neutral-400 text-lg">
              {currentContent.subtitle}
            </p>
          </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot Field - Hidden from humans, visible to bots */}
              <HoneypotInput
                fieldName={honeypotField}
                value={honeypotValue}
                onChange={setHoneypotValue}
              />
              
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  {currentContent.form.name}
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={currentContent.form.namePlaceholder}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 ps-11 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  {currentContent.form.email}
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-neutral-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={currentContent.form.emailPlaceholder}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 ps-11 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-white font-medium mb-2">
                  {currentContent.form.subject}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={currentContent.form.subjectPlaceholder}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 ps-11 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  {currentContent.form.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder={currentContent.form.messagePlaceholder}
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

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {currentContent.contactInfo.title}
            </h2>

            {/* Email Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {currentContent.contactInfo.email.title}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-3">
                    {currentContent.contactInfo.email.description}
                  </p>
                  <a
                    href="mailto:info@cinestream.com"
                    className="text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
                  >
                    {currentContent.contactInfo.email.value}
                  </a>
                </div>
              </div>
            </div>

            {/* Telegram Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Send className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {currentContent.contactInfo.telegram.title}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-3">
                    {currentContent.contactInfo.telegram.description}
                  </p>
                  <p className="text-emerald-500 font-medium mb-4">
                    {currentContent.contactInfo.telegram.value}
                  </p>
                  <a
                    href="https://t.me/cinestream"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {currentContent.contactInfo.telegram.button}
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg p-6">
              <p className="text-neutral-300 leading-relaxed">
                {lang === 'en'
                  ? 'We typically respond within 24-48 hours. For urgent matters, please use our Telegram channel for faster support.'
                  : 'ما معمولاً ظرف ۲۴-۴۸ ساعت پاسخ می‌دهیم. برای موارد فوری، لطفاً از کانال تلگرام ما برای پشتیبانی سریع‌تر استفاده کنید.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}