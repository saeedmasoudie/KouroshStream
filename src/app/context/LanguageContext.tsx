import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie } from "@/app/utils/cookies";

type Language = "en" | "fa";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
}

const translations = {
  en: {
    home: "Home",
    movies: "Movies",
    series: "Series",
    search: "Search movies & series...",
    trending: "Trending Now",
    newest: "Newest Releases",
    categories: "Categories",
    action: "Action",
    comedy: "Comedy",
    drama: "Drama",
    horror: "Horror",
    sciFi: "Sci-Fi",
    adventure: "Adventure",
    animation: "Animation",
    anime: "Anime",
    biography: "Biography",
    crime: "Crime",
    documentary: "Documentary",
    family: "Family",
    fantasy: "Fantasy",
    history: "History",
    music: "Music",
    mystery: "Mystery",
    romance: "Romance",
    sport: "Sport",
    thriller: "Thriller",
    war: "War",
    western: "Western",
    filters: "Filters",
    watchNow: "Watch Now",
    download: "Download",
    details: "Details",
    imdb: "IMDb",
    quality: "Quality",
    comments: "Comments",
    addComment: "Add a comment...",
    post: "Post",
    seasons: "Seasons",
    episodes: "Episodes",
    episode: "Episode",
    season: "Season",
    selectSeason: "Select Season",
    stream: "Stream",
    backToHome: "Back to Home",
    noResults: "No results found",
    director: "Director",
    country: "Country",
    views: "Views",
    sortBy: "Sort By",
    latest: "Latest",
    topRated: "Top Rated",
    mostViewed: "Most Viewed",
    name: "Name",
    email: "Email",
    captcha: "Captcha",
    captchaPlaceholder: "Enter the code above",
    all: "All",
    filter: "Filter",
    play: "Play / Stream",
    trailer: "Trailer",
    spoiler: "Spoiler",
    viewSpoiler: "Show Spoiler Content",
    verify: "Verify you are human",
    success: "Success",
    downloadQuality: "Download Quality",
    prev: "Previous",
    next: "Next",
    loadMore: "Load More",
    showing: "Showing",
    of: "of",
    results: "results",
    searchResults: "Search Results",
    searchingFor: "Searching for",
    resultsFound: "results found",
    noSearchQuery: "No search query",
    enterSearchQuery: "Please enter a search term to find movies and series",
    tryDifferentKeywords: "Try different keywords or check your spelling",
    cast: "Cast",
    character: "Character",
    writers: "Writers",
    duration: "Duration",
    awards: "Awards",
    suggestions: "Suggestions",
    mainCast: "Main Cast",
    language: "Language",
    release: "Release",
    min: "min",
    showMore: "Show more",
    showLess: "Show less",
    reply: "Reply",
    ratingOptional: "Rating (optional)",
    rating: "Rating",
    optional: "optional",
    replies: "replies",
    showReplies: "Show replies",
    hideReplies: "Hide replies",
    donate: "Donate",
    trustTitle: "Safe & Reliable",
    trustHint: "All download links are hosted on Google Drive and are completely safe. However, Google Drive has daily download quotas. If you encounter a 'Download Quota Exceeded' error, please use our online player instead or try again in 24 hours.",
    playerAdsNotice: "Player Ads Notice",
    playerAdsHint: "The video player may show 2 popup ads when you first click play. These are default ads from the embedded player itself and we have no control over them. Simply close the popups and continue watching.",
    noCensoring: "No Censoring",
    fullMovie: "Full Movie",
    watchOnlineFree: "Watch Online Free",
    safeDownload: "Safe Download",
    ongoing: "Ongoing",
    ended: "Completed",
    subtitle: "Subtitle",
    subtitles: "Subtitles",
    downloadSubtitle: "Download Subtitle",
    clear: "Clear",
    replyingTo: "Replying to",
    addReply: "Add a reply...",
    pleaseSolveCaptcha: "Please complete the captcha verification",
    fillAllFields: "Please fill in all fields",
    invalidEmail: "Please enter a valid email address",
    commentTooShort: "Comment must be at least 3 characters long",
    commentTooLong: "Comment must be less than 1000 characters",
    commentFailed: "Failed to submit comment",
  },
  fa: {
    home: "خانه",
    movies: "فیلم‌ها",
    series: "سریال‌ها",
    search: "جستجوی فیلم و سریال...",
    trending: "داغ‌ترین‌ها",
    newest: "جدیدترین‌ها",
    categories: "دسته‌بندی‌ها",
    action: "اکشن",
    comedy: "کمدی",
    drama: "درام",
    horror: "ترسناک",
    sciFi: "علمی تخیلی",
    adventure: "ماجراجویی",
    animation: "انیمیشن",
    anime: "انیمه",
    biography: "بیوگرافی",
    crime: "جنایی",
    documentary: "مستند",
    family: "خانوادگی",
    fantasy: "فانتزی",
    history: "تاریخی",
    music: "موزیکال",
    mystery: "معمایی",
    romance: "عاشقانه",
    sport: "ورزشی",
    thriller: "هیجان‌انگیز",
    war: "جنگی",
    western: "وسترن",
    filters: "فیلترها",
    watchNow: "تماشای آنلاین",
    download: "دانلود",
    details: "جزئیات",
    imdb: "امتیاز",
    quality: "کیفیت",
    comments: "نظرات",
    addComment: "افزودن نظر...",
    post: "ارسال نظر",
    seasons: "فصل‌ها",
    episodes: "قسمت‌ها",
    episode: "قسمت",
    season: "فصل",
    selectSeason: "انتخاب فصل",
    stream: "پخش آنلاین",
    backToHome: "بازگشت به خانه",
    noResults: "نتیجه‌ای یافت نشد",
    director: "کارگردان",
    country: "کشور سازنده",
    views: "بازدید",
    sortBy: "مرتب‌سازی",
    latest: "جدیدترین",
    topRated: "محبوب‌ترین",
    mostViewed: "پربازدیدترین",
    name: "نام",
    email: "ایمیل",
    captcha: "کد امنیتی",
    captchaPlaceholder: "کد بالا را وارد کنید",
    all: "همه",
    filter: "فیلتر",
    play: "پخش و تماشا",
    trailer: "تریلر",
    spoiler: "دارای اسپویل",
    viewSpoiler: "مشاهده متن اسپویل",
    verify: "تایید هویت انسانی",
    success: "با موفقیت انجام شد",
    downloadQuality: "کیفیت دانلود",
    prev: "قبلی",
    next: "بعدی",
    loadMore: "بارگذاری بیشتر",
    showing: "نمایش",
    of: "از",
    results: "نتیجه",
    searchResults: "نتایج جستجو",
    searchingFor: "جستجو برای",
    resultsFound: "نتیجه یافت شد",
    noSearchQuery: "عبارت جستجو وارد نشده",
    enterSearchQuery: "لطفا یک عبارت جستجو وارد کنید تا فیلم و سریال پیدا کنید",
    tryDifferentKeywords: "کلمات کلیدی دیگری امتحان کنید یا املای خود را بررسی کنید",
    cast: "بازیگران",
    character: "نقش",
    writers: "نویسندگان",
    duration: "مدت زمان",
    awards: "جوایز",
    suggestions: "پیشنهادها",
    mainCast: "بازیگران اصلی",
    language: "زبان",
    release: "انتشار",
    min: "دقیقه",
    showMore: "نمایش بیشتر",
    showLess: "نمایش کمتر",
    reply: "پاسخ",
    ratingOptional: "امتیاز (اختیاری)",
    rating: "امتیاز",
    optional: "اختیاری",
    replies: "پاسخ",
    showReplies: "نمایش پاسخ‌ها",
    hideReplies: "پنهان کردن پاسخ‌ها",
    donate: "حمایت مالی",
    trustTitle: "امن و مطمئن",
    trustHint: "تمامی لینک‌های دانلود در گوگل درایو میزبانی می‌شوند و کاملا امن هستند. اما گوگل درایو محدودیت دانلود روزانه دارد. اگر با خطای 'سهمیه دانلود تمام شد' مواجه شدید، لطفا از پلیر آنلاین ما استفاده کنید یا ۲۴ ساعت بعد مجددا تلاش کنید.",
    playerAdsNotice: "اطلاعیه تبلیغات پلیر",
    playerAdsHint: "پلیر ویدیو ممکن است هنگام اولین کلیک پخش، ۲ پاپ‌آپ تبلیغاتی نمایش دهد. این‌ها تبلیغات پیش‌فرض از خود پلیر هستند و ما کنترلی روی آن‌ها نداریم. فقط پاپ‌آپ‌ها را ببندید و به تماشا ادامه دهید.",
    noCensoring: "بدون سانسور",
    fullMovie: "نسخه کامل",
    watchOnlineFree: "تماشای آنلاین رایگان",
    safeDownload: "دانلود امن و سریع",
    ongoing: "در حال پخش",
    ended: "تکمیل شده",
    subtitle: "زیرنویس",
    subtitles: "زیرنویس‌ها",
    downloadSubtitle: "دانلود زیرنویس",
    clear: "پاک کردن",
    replyingTo: "پاسخ به",
    addReply: "افزودن پاسخ...",
    pleaseSolveCaptcha: "لطفاً تایید امنیتی را کامل کنید",
    fillAllFields: "لطفاً تمامی فیلدها را پر کنید",
    invalidEmail: "لطفاً یک آدرس ایمیل معتبر وارد کنید",
    commentTooShort: "نظر باید حداقل ۳ کاراکتر داشته باشد",
    commentTooLong: "نظر باید کمتر از ۱۰۰۰ کاراکتر باشد",
    commentFailed: "ارسال نظر با شکست مواجه شد",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize language from cookie or browser detection or default to 'en'
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = getCookie('preferred_language');
    if (savedLang === 'en' || savedLang === 'fa') return savedLang;
    
    // Automatic detection for first-time user
    const browserLang = navigator.language.toLowerCase();
    const isPersianBrowser = browserLang.startsWith('fa') || browserLang.startsWith('ar');
    
    // Check timezone as a proxy for IP/Location
    let isIranTimezone = false;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      isIranTimezone = tz === 'Asia/Tehran';
    } catch (e) {}

    if (isPersianBrowser || isIranTimezone) {
      return 'fa';
    }
    
    return 'en';
  });

  const dir = lang === "fa" ? "rtl" : "ltr";

  const t = (key: string) => {
    if (key === 'donate') {
      return lang === 'en' ? 'Donate' : 'حمایت مالی';
    }
    return (translations[lang] as any)[key] || key;
  };

  // Save language preference to cookie whenever it changes
  useEffect(() => {
    setCookie('preferred_language', lang, 365);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, t }}>
      <div dir={dir} className={lang === "fa" ? "font-vazir" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};