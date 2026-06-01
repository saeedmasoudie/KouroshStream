import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams, Link } from "react-router";
import { LanguageProvider, useLanguage } from "@/app/context/LanguageContext";
import { Navbar } from "@/app/components/Navbar";
import { AnimatedBg } from "@/app/components/AnimatedBg";
import { HomePage } from "@/app/pages/HomePage";
import { DetailPage } from "@/app/pages/DetailPage";
import { MediaListPage } from "@/app/pages/MediaListPage";
import { SearchResultsPage } from "@/app/pages/SearchResultsPage";
import { HelpCenter } from "@/app/pages/HelpCenter";
import { PrivacyPolicy } from "@/app/pages/PrivacyPolicy";
import { ContactUs } from "@/app/pages/ContactUs";
import { Suggestions } from "@/app/pages/Suggestions";
import { NotFound } from "@/app/pages/NotFound";
import { AdminDashboard } from "@/app/pages/AdminDashboard";
import { DonatePage } from "@/app/pages/DonatePage";
import { CookieConsent } from "@/app/components/CookieConsent";
import { OfflineDetector } from "@/app/components/OfflineDetector";
import { Toaster } from "@/app/components/ui/sonner";
import { UnderConstruction } from "@/app/components/UnderConstruction";
import { DemoBanner } from "@/app/components/DemoBanner";
import { apiService } from "@/app/config/api";
import { Instagram, Send as Telegram } from "lucide-react";
import { Logo } from "./components/Logo";

// Secure Admin Path
const ADMIN_PATH = "/sys-control-7x24";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Language wrapper component that sets the language from URL
const LanguageRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang: urlLang } = useParams<{ lang: string }>();
  const { setLang, lang: currentLang } = useLanguage();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  
  // Sync language from URL to context
  useEffect(() => {
    if (urlLang === 'en' || urlLang === 'fa') {
      setLang(urlLang);
      setIsReady(true);
    } else {
      setIsReady(true);
    }
  }, [urlLang, setLang]);
  
  if (!isReady) return null;

  // If no language in URL, redirect to current stored language
  if (!urlLang) {
    return <Navigate to={`/${currentLang}${location.pathname}${location.search}`} replace />;
  }
  
  // Validate language (only 'en' or 'fa' allowed)
  if (urlLang !== 'en' && urlLang !== 'fa') {
    return <Navigate to={`/${currentLang}${location.pathname.replace(`/${urlLang}`, '')}${location.search}`} replace />;
  }
  
  return <>{children}</>;
};

// Component for the root route / to redirect based on language preference
const RootRedirect = () => {
  const { lang } = useLanguage();
  return <Navigate to={`/${lang}`} replace />;
};

// Footer Component with Translation Support
const FooterComponent = () => {
  const { lang } = useLanguage();

  const t = {
    description: {
      en: 'A demo streaming website template built with React, TypeScript, and Tailwind CSS. Featuring bilingual support (English/Persian) and modern UI/UX design.',
      fa: 'قالب نمایشی یک وبسایت استریم ساخته شده با React، TypeScript و Tailwind CSS. با پشتیبانی دو زبانه (انگلیسی/فارسی) و طراحی مدرن.'
    },
    navigation: {
      en: 'Navigation',
      fa: 'منوی سایت'
    },
    home: {
      en: 'Home',
      fa: 'خانه'
    },
    movies: {
      en: 'Movies',
      fa: 'فیلم‌ها'
    },
    series: {
      en: 'Series',
      fa: 'سریال‌ها'
    },
    support: {
      en: 'Support',
      fa: 'پشتیبانی'
    },
    helpCenter: {
      en: 'Help Center',
      fa: 'مرکز راهنما'
    },
    privacy: {
      en: 'Privacy Policy',
      fa: 'حریم خصوصی'
    },
    contact: {
      en: 'Contact',
      fa: 'تماس با ما'
    },
    suggestions: {
      en: 'Suggestions',
      fa: 'درخواست‌ها'
    },
    donate: {
      en: 'Support Developer',
      fa: 'حمایت از توسعه‌دهنده'
    },
    developer: {
      en: 'Developer',
      fa: 'توسعه‌دهنده'
    },
    builtBy: {
      en: 'Built by',
      fa: 'ساخته شده توسط'
    },
    viewSource: {
      en: 'View Source Code',
      fa: 'مشاهده کد منبع'
    },
    copyright: {
      en: '© 2026 KouroshStream - Demo Template - Open Source Project',
      fa: '© ۲۰۲۶ سینی‌استریم - قالب نمایشی - پروژه متن‌باز'
    }
  };

  return (
    <footer className="mt-20 border-t border-white/10 py-16 bg-slate-950/80 backdrop-blur-xl" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
             <Link to={`/${lang}`} className="mb-6 block group w-fit transition-transform hover:scale-105">
                <Logo size="lg" />
             </Link>
             <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
               {t.description[lang]}
             </p>
             <div className="flex items-center gap-3 flex-wrap">
                <a
                  href="https://saeedmasoudie.ir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  {t.builtBy[lang]}: Saeed Masoudie
                </a>
                <a
                  href="https://github.com/saeedmasoudie/cinestream"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg text-sm font-medium hover:bg-white/10 transition-all"
                >
                  {t.viewSource[lang]}
                </a>
             </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">{t.navigation[lang]}</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href={`/${lang}`} className="hover:text-purple-400 transition-colors">{t.home[lang]}</a></li>
              <li><a href={`/${lang}/movies`} className="hover:text-purple-400 transition-colors">{t.movies[lang]}</a></li>
              <li><a href={`/${lang}/series`} className="hover:text-purple-400 transition-colors">{t.series[lang]}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">{t.support[lang]}</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href={`/${lang}/help`} className="hover:text-purple-400 transition-colors">{t.helpCenter[lang]}</a></li>
              <li><a href={`/${lang}/privacy`} className="hover:text-purple-400 transition-colors">{t.privacy[lang]}</a></li>
              <li><a href={`/${lang}/contact`} className="hover:text-purple-400 transition-colors">{t.contact[lang]}</a></li>
              <li><a href={`/${lang}/suggestions`} className="hover:text-purple-400 transition-colors">{t.suggestions[lang]}</a></li>
              <li><a href="https://saeedmasoudie.ir/donate" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">{t.donate[lang]}</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 text-center">
          <p className="text-gray-600 text-xs mb-2">
            {t.copyright[lang]}
          </p>
          <p className="text-gray-700 text-xs">
            {lang === 'en' ? 'Made with React + TypeScript + Tailwind CSS' : 'ساخته شده با React + TypeScript + Tailwind CSS'}
          </p>
        </div>
      </div>
    </footer>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [underConstructionMode, setUnderConstructionMode] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is authenticated admin
  useEffect(() => {
    const checkAdminAuth = () => {
      const adminToken = sessionStorage.getItem('admin_token');
      const adminAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
      setIsAdmin(!!adminToken && adminAuthenticated);
    };

    checkAdminAuth();

    // Listen for storage changes (e.g., when admin logs in/out in another tab)
    window.addEventListener('storage', checkAdminAuth);
    
    // Listen for custom event (when admin logs in/out in same tab)
    window.addEventListener('adminAuthChanged', checkAdminAuth);
    
    return () => {
      window.removeEventListener('storage', checkAdminAuth);
      window.removeEventListener('adminAuthChanged', checkAdminAuth);
    };
  }, []);

  // Check maintenance status from API
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const settings = await apiService.getSettings();
        if (settings && typeof settings.maintenance_mode !== 'undefined') {
          setUnderConstructionMode(settings.maintenance_mode);
        }
      } catch (error) {
        console.error("Failed to check maintenance status", error);
        // Fallback to localStorage if API fails (e.g. for admin preview before deploy)
        setUnderConstructionMode(localStorage.getItem('under_construction') === 'true');
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
    
    // Poll every minute to keep up to date
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Show nothing while checking status to prevent content flash
  // unless we are on the admin path
  if (checkingStatus && location.pathname !== ADMIN_PATH) {
    return null; // Or a loading spinner
  }

  // If under construction mode is on and user is not an admin and not on admin page
  if (underConstructionMode && !isAdmin && location.pathname !== ADMIN_PATH) {
    return <UnderConstruction />;
  }

  return (
    <div className="min-h-screen text-gray-100 selection:bg-emerald-600/30">
      <DemoBanner />
      <AnimatedBg />
      <Navbar />
      <main className="min-h-screen pt-10">
        <Routes>
          {/* Redirect root based on language preference */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* All routes under /:lang */}
          <Route path="/:lang" element={<LanguageRouteWrapper><HomePage /></LanguageRouteWrapper>} />
          <Route path="/:lang/movies" element={<LanguageRouteWrapper><MediaListPage type="movie" /></LanguageRouteWrapper>} />
          <Route path="/:lang/series" element={<LanguageRouteWrapper><MediaListPage type="series" /></LanguageRouteWrapper>} />
          
          {/* SEO-friendly URLs with language: /en/movie/inception or /fa/movie/inception */}
          <Route path="/:lang/movie/:slug" element={<LanguageRouteWrapper><DetailPage /></LanguageRouteWrapper>} />
          <Route path="/:lang/series/:slug" element={<LanguageRouteWrapper><DetailPage /></LanguageRouteWrapper>} />
          
          <Route path="/:lang/search" element={<LanguageRouteWrapper><SearchResultsPage /></LanguageRouteWrapper>} />
          <Route path="/:lang/help" element={<LanguageRouteWrapper><HelpCenter /></LanguageRouteWrapper>} />
          <Route path="/:lang/privacy" element={<LanguageRouteWrapper><PrivacyPolicy /></LanguageRouteWrapper>} />
          <Route path="/:lang/contact" element={<LanguageRouteWrapper><ContactUs /></LanguageRouteWrapper>} />
          <Route path="/:lang/suggestions" element={<LanguageRouteWrapper><Suggestions /></LanguageRouteWrapper>} />

          {/* Redirect donate to external site */}
          <Route path="/:lang/donate" element={<Navigate to="https://saeedmasoudie.ir/donate" replace />} />
          
          {/* Secure Admin Path */}
          <Route path={ADMIN_PATH} element={<AdminDashboard />} />
          
          {/* Redirect old admin path to home or 404 to hide it */}
          <Route path="/admin" element={<RootRedirect />} />
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ScrollToTop />
        <AppContent />
        <CookieConsent />
        <OfflineDetector />
        <Toaster />
      </LanguageProvider>
    </BrowserRouter>
  );
}