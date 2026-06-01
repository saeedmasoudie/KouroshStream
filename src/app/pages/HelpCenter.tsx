import { useLanguage } from '@/app/context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SEO } from '@/app/components/SEO';

interface FAQItem {
  question: string;
  answer: string;
}

export const HelpCenter: React.FC = () => {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const content = {
    en: {
      title: 'Help Center',
      subtitle: 'Find answers to commonly asked questions',
      faqs: [
        {
          question: 'Is downloading movies and series from your website legal?',
          answer: 'The legality of downloading content depends on your country\'s copyright laws and the licensing agreements in place. We recommend checking your local regulations. Our platform provides access to content, but users are responsible for ensuring they comply with applicable laws in their jurisdiction.',
        },
        {
          question: 'What are the copyright laws regarding streaming and downloading?',
          answer: 'Copyright laws vary by country, but generally, downloading or streaming copyrighted content without proper authorization may be illegal. Some countries have stricter enforcement than others. Always ensure you have the right to access the content you\'re viewing or downloading.',
        },
        {
          question: 'Do I need to create an account to watch or download?',
          answer: 'No, cinestream does not require user registration or login. You can freely browse, stream, and download content without creating an account. However, to leave comments, you\'ll need to provide your name and email for verification purposes.',
        },
        {
          question: 'What video qualities are available for download?',
          answer: 'We offer multiple quality options for downloads including 480p, 720p, 1080p, and in some cases 4K. The available qualities depend on the source material. You can select your preferred quality before downloading.',
        },
        {
          question: 'How do I search for specific movies or series?',
          answer: 'Use the search bar at the top of the page to find specific titles. You can also browse by category, filter by genre, release date, rating, or views. Our advanced filtering system helps you discover content that matches your preferences.',
        },
        {
          question: 'Can I watch content online without downloading?',
          answer: 'Yes! cinestream provides embedded players for streaming content directly on our website. Simply click the "Watch Now" or "Stream" button on any movie or series page to start watching instantly.',
        },
        {
          question: 'How do I leave a comment or review?',
          answer: 'Scroll to the comments section on any movie or series detail page. Enter your name, email address, and complete the captcha verification to post your comment. No account registration is required.',
        },
        {
          question: 'What should I do if a download link is broken?',
          answer: 'If you encounter a broken download link, please report it through our Contact Us page. Include the title of the movie or series and the specific quality that\'s not working. We\'ll work to fix it as soon as possible.',
        },
        {
          question: 'Is the website available in multiple languages?',
          answer: 'Yes! cinestream supports both English and Persian (Farsi) languages. You can switch between languages using the language toggle in the navigation bar. The interface will automatically adjust to support RTL (right-to-left) for Persian.',
        },
        {
          question: 'How often is new content added?',
          answer: 'We regularly update our library with new movies and series. Check the "Newest Releases" section on the homepage to see the latest additions. You can also follow our Telegram channel @cinestream for instant notifications about new content.',
        },
      ],
    },
    fa: {
      title: 'مرکز راهنمایی',
      subtitle: 'پاسخ سوالات متداول را پیدا کنید',
      faqs: [
        {
          question: 'آیا دانلود فیلم و سریال از وبسایت شما قانونی است؟',
          answer: 'قانونی بودن دانلود محتوا به قوانین کپی‌رایت کشور شما و توافقات مجوزدهی بستگی دارد. توصیه می‌کنیم مقررات محلی خود را بررسی کنید. پلتفرم ما دسترسی به محتوا را فراهم می‌کند، اما کاربران مسئول اطمینان از رعایت قوانین قابل اجرا در حوزه قضایی خود هستند.',
        },
        {
          question: 'قوانین کپی‌رایت در مورد استریم و دانلود چیست؟',
          answer: 'قوانین کپی‌رایت در کشورهای مختلف متفاوت است، اما به طور کلی، دانلود یا استریم محتوای دارای کپی‌رایت بدون مجوز مناسب ممکن است غیرقانونی باشد. برخی کشورها اجرای سخت‌گیرانه‌تری نسبت به سایرین دارند. همیشه مطمئن شوید که حق دسترسی به محتوایی که مشاهده یا دانلود می‌کنید را دارید.',
        },
        {
          question: 'آیا برای تماشا یا دانلود نیاز به ساخت حساب کاربری دارم؟',
          answer: 'خیر، cinestream نیازی به ثبت‌نام یا ورود کاربر ندارد. می‌توانید آزادانه محتوا را مرور، استریم و دانلود کنید بدون اینکه حساب کاربری ایجاد کنید. با این حال، برای ثبت نظر، باید نام و ایمیل خود را برای تایید هویت وارد کنید.',
        },
        {
          question: 'چه کیفیت‌های ویدیویی برای دانلود در دسترس است؟',
          answer: 'ما گزینه‌های کیفیت متعددی برای دانلود ارائه می‌دهیم از جمله 480p، 720p، 1080p و در برخی موارد 4K. کیفیت‌های در دسترس به منبع مواد بستگی دارد. می‌توانید کیفیت مورد نظر خود را قبل از دانلود انتخاب کنید.',
        },
        {
          question: 'چگونه فیلم یا سریال خاصی را جستجو کنم؟',
          answer: 'از نوار جستجو در بالای صفحه برای یافتن عناوین خاص استفاده کنید. همچنین می‌توانید بر اساس دسته‌بندی مرور کنید، فیلتر بر اساس ژانر، تاریخ انتشار، امتیاز یا بازدید. سیستم فیلتر پیشرفته ما به شما کمک می‌کند محتوایی را که با ترجیحات شما مطابقت دارد کشف کنید.',
        },
        {
          question: 'آیا می‌توانم محتوا را آنلاین بدون دانلود تماشا کنم؟',
          answer: 'بله! cinestream پخش‌کننده‌های تعبیه شده برای استریم محتوا مستقیماً در وبسایت ما فراهم می‌کند. به سادگی روی دکمه "تماشای آنلاین" یا "پخش" در هر صفحه فیلم یا سریال کلیک کنید تا فوراً شروع به تماشا کنید.',
        },
        {
          question: 'چگونه نظر یا بررسی ثبت کنم؟',
          answer: 'به بخش نظرات در هر صفحه جزئیات فیلم یا سریال بروید. نام، آدرس ایمیل خود را وارد کنید و تایید کپچا را تکمیل کنید تا نظر خود را ارسال کنید. نیازی به ثبت‌نام حساب کاربری نیست.',
        },
        {
          question: 'اگر لینک دانلود خراب است چه کاری باید انجام دهم؟',
          answer: 'اگر با لینک دانلود خراب مواجه شدید، لطفاً آن را از طریق صفحه تماس با ما گزارش دهید. عنوان فیلم یا سریال و کیفیت خاصی که کار نمی‌کند را ذکر کنید. ما در اسرع وقت برای رفع آن تلاش خواهیم کرد.',
        },
        {
          question: 'آیا وبسایت به چندین زبان در دسترس است؟',
          answer: 'بله! cinestream از زبان‌های انگلیسی و فارسی پشتیبانی می‌کند. می‌توانید با استفاده از دکمه تغییر زبان در نوار ناوبری بین زبان‌ها جابجا شوید. رابط کاربری به طور خودکار برای پشتیبانی از RTL (راست به چپ) برای فارسی تنظیم می‌شود.',
        },
        {
          question: 'چند وقت یکبار محتوای جدید اضافه می‌شود؟',
          answer: 'ما به طور منظم کتابخانه خود را با فیلم‌ها و سریال‌های جدید به‌روزرسانی می‌کنیم. بخش "جدیدترین‌ها" را در صفحه اصلی بررسی کنید تا آخرین اضافه‌شده‌ها را ببینید. همچنین می‌توانید کانال تلگرام ما @cinestream را دنبال کنید تا فوراً از محتوای جدید مطلع شوید.',
        },
      ],
    },
  };

  const currentContent = content[lang];
  const currentFaqs = currentContent.faqs;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <SEO
        title={lang === 'en' ? 'Help Center - Frequently Asked Questions | cinestream' : 'مرکز کمک - سوالات متداول | گرین پیکسل'}
        description={lang === 'en' 
          ? 'Find answers to commonly asked questions about cinestream. Learn about streaming, downloading, quality options, subtitles, and more.'
          : 'پاسخ سوالات متداول درباره گرین پیکسل را پیدا کنید. درباره استریم، دانلود، گزینه‌های کیفیت، زیرنویس و موارد دیگر بیاموزید.'
        }
        keywords={lang === 'en'
          ? 'cinestream help, faq, frequently asked questions, support, how to download, streaming help'
          : 'کمک گرین پیکسل, سوالات متداول, پشتیبانی, نحوه دانلود, کمک استریم'
        }
        lang={lang}
        canonicalUrl={`https://cinestream.com/${lang}/help`}
        alternateUrls={[
          { lang: 'en', url: 'https://cinestream.com/en/help' },
          { lang: 'fa', url: 'https://cinestream.com/fa/help' }
        ]}
      />
      <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {currentContent.title}
            </h1>
            <p className="text-neutral-400 text-lg">
              {currentContent.subtitle}
            </p>
          </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {currentFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-emerald-500/30 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-neutral-800/50 transition-colors"
              >
                <span className="text-white font-medium text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-emerald-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-4 bg-neutral-800/30 border-t border-neutral-800">
                  <p className="text-neutral-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">
            {lang === 'en' ? "Still have questions?" : "هنوز سوالی دارید؟"}
          </h2>
          <p className="text-neutral-400 mb-6">
            {lang === 'en' 
              ? "Can't find the answer you're looking for? Contact our support team." 
              : "پاسخ سوال خود را پیدا نکردید؟ با تیم پشتیبانی ما تماس بگیرید."}
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            {lang === 'en' ? "Contact Us" : "تماس با ما"}
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
