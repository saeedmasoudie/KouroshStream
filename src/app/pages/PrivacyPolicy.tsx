import { useLanguage } from '@/app/context/LanguageContext';
import { Shield, Eye, Cookie, Lock, Mail, AlertCircle } from 'lucide-react';
import { SEO } from '@/app/components/SEO';

export const PrivacyPolicy: React.FC = () => {
  const { lang } = useLanguage();

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: February 12, 2026',
      sections: [
        {
          icon: Eye,
          title: 'Information We Collect',
          content: [
            'When you use cinestream, we may collect certain information to provide you with a better experience:',
            '• Browser Information: We automatically collect browser type, device type, and operating system information.',
            '• Usage Data: We track which pages you visit, content you view, and features you use to improve our service.',
            '• Comments: When you post comments, we collect your name and email address (which are not displayed publicly).',
            '• Cookies: We use cookies and similar technologies to remember your language preferences and enhance your browsing experience.',
          ],
        },
        {
          icon: Lock,
          title: 'How We Use Your Information',
          content: [
            'The information we collect is used for the following purposes:',
            '• To provide and maintain our service',
            '• To personalize your experience (e.g., remembering language preferences)',
            '• To improve our website and content offerings',
            '• To moderate and display comments',
            '• To communicate with you when you contact us',
            '• To analyze usage patterns and optimize performance',
          ],
        },
        {
          icon: Shield,
          title: 'Cloudflare Hosting & Data Privacy',
          content: [
            'cinestream is proudly hosted on Cloudflare Pages, one of the world\'s most secure and reliable platforms:',
            '• No Data Sharing: We do NOT share, sell, or distribute your personal data to any third parties.',
            '• Cloudflare Security: All data is stored securely on Cloudflare\'s infrastructure with enterprise-grade security.',
            '• Privacy First: Your information stays within our secure Cloudflare environment and is never shared with external parties for marketing or any other purposes.',
            '• Transparent Operations: Unlike many platforms, we maintain full control over your data without involving third-party data brokers or advertisers.',
          ],
        },
        {
          icon: Shield,
          title: 'Safe Downloads & Virus-Free Guarantee',
          content: [
            'Your safety is our top priority when it comes to download links:',
            '• Verified Links: All download links are carefully verified before being published on our platform.',
            '• No Malware: We ensure that our links do not contain viruses, malware, trojans, or any malicious software.',
            '• Trusted Sources: We only provide links to reputable file hosting services with strong security measures.',
            '• Regular Monitoring: Our team continuously monitors all links to maintain safety standards.',
            '• No Harmful Content: We prohibit any links that could harm your device or compromise your security.',
            'Note: While we provide links to third-party hosting platforms, we carefully vet these services to ensure they meet our security standards.',
          ],
        },
        {
          icon: Cookie,
          title: 'Cookies and Tracking Technologies',
          content: [
            'cinestream uses cookies and similar technologies:',
            '• Essential Cookies: Required for basic site functionality and language preferences.',
            '• Analytics Cookies: Help us understand how visitors use our site (data stays within our Cloudflare environment).',
            '• No Third-Party Advertising Cookies: We do not use tracking cookies from advertising networks.',
            'You can control cookies through your browser settings, but disabling certain cookies may limit site functionality.',
          ],
        },
        {
          icon: AlertCircle,
          title: 'Third-Party Links and Content',
          content: [
            'cinestream provides links to third-party file hosting services and streaming platforms. Please note:',
            '• We are not responsible for the privacy practices of these external websites.',
            '• We carefully select trusted hosting partners with good security reputations.',
            '• Any data collection by external services is governed by their own privacy policies.',
            '• We do not control content hosted on third-party platforms.',
            'We encourage you to review the privacy policies of any third-party sites you visit through our links.',
          ],
        },
        {
          icon: Lock,
          title: 'Data Security',
          content: [
            'We implement industry-leading security measures powered by Cloudflare:',
            '• Enterprise-Grade Protection: Cloudflare\'s advanced security infrastructure protects your data 24/7.',
            '• Encrypted Connections: All data transmissions are encrypted using modern SSL/TLS protocols.',
            '• DDoS Protection: Cloudflare\'s global network shields our platform from cyber attacks.',
            '• Regular Security Audits: We continuously monitor and update our security practices.',
            '• Minimal Data Retention: We retain your information only as long as necessary to provide our services and comply with legal obligations.',
            'Cloudflare is trusted by millions of websites worldwide and maintains some of the highest security standards in the industry.',
          ],
        },
        {
          icon: Mail,
          title: 'Your Rights and Choices',
          content: [
            'You have certain rights regarding your personal information:',
            '• Access: You can request information about the data we hold about you.',
            '• Deletion: You can request deletion of your personal information.',
            '• Opt-Out: You can opt out of certain data collection by adjusting your browser settings or contacting us.',
            'To exercise these rights, please contact us at info@cinestream.com.',
          ],
        },
        {
          icon: Shield,
          title: 'Children\'s Privacy',
          content: [
            'cinestream is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.',
          ],
        },
        {
          icon: AlertCircle,
          title: 'Changes to This Privacy Policy',
          content: [
            'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.',
            'Continued use of cinestream after changes constitutes acceptance of the updated policy.',
          ],
        },
        {
          icon: Mail,
          title: 'Contact Us',
          content: [
            'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:',
            '• Email: info@cinestream.com',
            '• Visit our Contact Us page for more ways to reach us',
          ],
        },
      ],
    },
    fa: {
      title: 'سیاست حفظ حریم خصوصی',
      lastUpdated: 'آخرین بروزرسانی: ۲۳ بهمن ۱۴۰۴',
      sections: [
        {
          icon: Eye,
          title: 'اطلاعاتی که جمع‌آوری می‌کنیم',
          content: [
            'هنگامی که از cinestream استفاده می‌کنید، ممکن است برخی اطلاعات را برای ارائه تجربه بهتر جمع‌آوری کنیم:',
            '• اطلاعات مرورگر: به طور خودکار نوع مرورگر، نوع دستگاه و اطلاعات سیستم عامل را جمع‌آوری می‌کنیم.',
            '• داده‌های استفاده: برای بهبود خدمات، صفحاتی که بازدید می‌کنید، محتوایی که مشاهده می‌کنید و ویژگی‌هایی که استفاده می‌کنید را ردیابی می‌کنیم.',
            '• نظرات: هنگام ارسال نظرات، نام و آدرس ایمیل شما را جمع‌آوری می‌کنیم (که به صورت عمومی نمایش داده نمی‌شوند).',
            '• کوکی‌ها: از کوکی‌ها و فناوری‌های مشابه برای به خاطر سپردن ترجیحات زبان شما و بهبود تجربه مرور استفاده می‌کنیم.',
          ],
        },
        {
          icon: Lock,
          title: 'نحوه استفاده از اطلاعات شما',
          content: [
            'اطلاعات جمع‌آوری شده برای اهداف زیر استفاده می‌شود:',
            '• برای ارائه و نگهداری خدمات ما',
            '• برای شخصی‌سازی تجربه شما (مانند به خاطر سپردن ترجیحات زبان)',
            '• برای بهبود وب‌سایت و محتوای ارائه شده',
            '• برای مدیریت و نمایش نظرات',
            '• برای ارتباط با شما هنگام تماس',
            '• برای تجزیه و تحلیل الگوهای استفاده و بهینه‌سازی عملکرد',
          ],
        },
        {
          icon: Shield,
          title: 'هاستینگ کلودفلر و حریم خصوصی داده‌ها',
          content: [
            'cinestream با افتخار روی Cloudflare Pages، یکی از امن‌ترین و قابل‌اعتمادترین پلتفرم‌های جهان میزبانی می‌شود:',
            '• عدم به اشتراک‌گذاری داده‌ها: ما اطلاعات شخصی شما را به هیچ شخص ثالثی به اشتراک نمی‌گذاریم، نمی‌فروشیم یا توزیع نمی‌کنیم.',
            '• امنیت کلودفلر: تمام داده‌ها به صورت ایمن در زیرساخت Cloudflare با امنیت سطح سازمانی ذخیره می‌شوند.',
            '• اولویت حریم خصوصی: اطلاعات شما در محیط امن Cloudflare ما باقی می‌ماند و هرگز برای بازاریابی یا هر هدف دیگری با طرف‌های خارجی به اشتراک گذاشته نمی‌شود.',
            '• عملیات شفاف: برخلاف بسیاری از پلتفرم‌ها، ما کنترل کامل بر روی داده‌های شما داریم بدون دخالت واسطه‌های داده شخص ثالث یا تبلیغ‌دهندگان.',
          ],
        },
        {
          icon: Shield,
          title: 'دانلودهای امن و تضمین بدون ویروس',
          content: [
            'امنیت شما اولویت اصلی ما در مورد لینک‌های دانلود است:',
            '• لینک‌های تأیید شده: تمام لینک‌های دانلود قبل از انتشار در پلتفرم ما به دقت بررسی می‌شوند.',
            '• بدون بدافزار: ما اطمینان حاصل می‌کنیم که لینک‌های ما حاوی ویروس، بدافزار، تروجان یا هر نرم‌افزار مخربی نیستند.',
            '• منابع قابل اعتماد: ما فقط لینک‌هایی به سرویس‌های میزبانی فایل معتبر با اقدامات امنیتی قوی ارائه می‌دهیم.',
            '• نظارت منظم: تیم ما به طور مستمر تمام لینک‌ها را برای حفظ استانداردهای ایمنی نظارت می‌کند.',
            '• بدون محتوای مضر: ما هر لینکی که می‌تواند به دستگاه شما آسیب برساند یا امنیت شما را به خطر بیندازد را ممنوع می‌کنیم.',
            'توجه: در حالی که ما لینک‌هایی به پلتفرم‌های میزبانی شخص ثالث ارائه می‌دهیم، ما این سرویس‌ها را به دقت بررسی می‌کنیم تا اطمینان حاصل کنیم که استانداردهای امنیتی ما را برآورده می‌کنند.',
          ],
        },
        {
          icon: Cookie,
          title: 'کوکی‌ها و فناوری‌های ردیابی',
          content: [
            'cinestream از کوکی‌ها و فناوری‌های مشابه استفاده می‌کند:',
            '• کوکی‌های ضروری: برای عملکرد اساسی سایت و ترجیحات زبان مورد نیاز است.',
            '• کوکی‌های تحلیلی: به ما کمک می‌کند بفهمیم بازدیدکنندگان چگونه از سایت ما استفاده می‌کنند (داده‌ها در محیط Cloudflare ما باقی می‌مانند).',
            '• بدون کوکی‌های تبلیغاتی شخص ثالث: ما از کوکی‌های ردیابی شبکه‌های تبلیغاتی استفاده نمی‌کنیم.',
            'شما می‌توانید کوکی‌ها را از طریق تنظیمات مرورگر خود کنترل کنید، اما غیرفعال کردن برخی کوکی‌ها ممکن است عملکرد سایت را محدود کند.',
          ],
        },
        {
          icon: AlertCircle,
          title: 'لینک‌ها و محتوای شخص ثالث',
          content: [
            'cinestream لینک‌هایی به سرویس‌های میزبانی فایل شخص ثالث و پلتفرم‌های استریمینگ ارائه می‌دهد. لطفاً توجه کنید:',
            '• ما مسئول شیوه‌های حفظ حریم خصوصی این وب‌سایت‌های خارجی نیستیم.',
            '• ما به دقت شرکای میزبانی قابل اعتماد با شهرت امنیتی خوب را انتخاب می‌کنیم.',
            '• هرگونه جمع‌آوری داده توسط سرویس‌های خارجی تحت سیاست‌های حفظ حریم خصوصی خود آن‌ها است.',
            '• ما محتوای میزبانی شده در پلتفرم‌های شخص ثالث را کنترل نمی‌کنیم.',
            'ما شما را تشویق می‌کنیم سیاست‌های حفظ حریم خصوصی هر سایت شخص ثالثی که از طریق لینک‌های ما بازدید می‌کنید را بررسی کنید.',
          ],
        },
        {
          icon: Lock,
          title: 'امنیت داده‌ها',
          content: [
            'ما اقدامات امنیتی پیشرو در صنعت را که توسط Cloudflare پشتیبانی می‌شود، اجرا می‌کنیم:',
            '• حفاظت سطح سازمانی: زیرساخت امنیتی پیشرفته Cloudflare از داده‌های شما ۲۴/۷ محافظت می‌کند.',
            '• اتصالات رمزگذاری شده: تمام انتقال‌های داده با استفاده از پروتکل‌های مدرن SSL/TLS رمزگذاری می‌شوند.',
            '• حفاظت DDoS: شبکه جهانی Cloudflare پلتفرم ما را از حملات سایبری محافظت می‌کند.',
            '• ممیزی‌های امنیتی منظم: ما به طور مستمر شیوه‌های امنیتی خود را نظارت و به‌روزرسانی می‌کنیم.',
            '• حداقل نگهداری داده: ما اطلاعات شما را فقط به اندازه‌ای که برای ارائه خدمات و رعایت تعهدات قانونی لازم است، نگه می‌داریم.',
            'Cloudflare توسط میلیون‌ها وب‌سایت در سراسر جهان مورد اعتماد است و برخی از بالاترین استانداردهای امنیتی در صنعت را حفظ می‌کند.',
          ],
        },
        {
          icon: Mail,
          title: 'حقوق و انتخاب‌های شما',
          content: [
            'شما در مورد اطلاعات شخصی خود حقوق خاصی دارید:',
            '• دسترسی: می‌توانید درخواست اطلاعات در مورد داده‌هایی که در اختیار داریم کنید.',
            '• حذف: می‌توانید درخواست حذف اطلاعات شخصی خود کنید.',
            '• انصراف: می‌توانید با تنظیم تنظیمات مرورگر یا تماس با ما از جمع‌آوری داده‌های خاص انصراف دهید.',
            'برای اعمال این حقوق، لطفاً با ما از طریق info@cinestream.com تماس بگیرید.',
          ],
        },
        {
          icon: Shield,
          title: 'حریم خصوصی کودکان',
          content: [
            'cinestream برای کودکان زیر ۱۳ سال در نظر گرفته نشده است. ما آگاهانه اطلاعات شخصی از کودکان جمع‌آوری نمی‌کنیم. اگر معتقدید ما اطلاعاتی از یک کودک جمع‌آوری کرده‌ایم، لطفاً فوراً با ما تماس بگیرید.',
          ],
        },
        {
          icon: AlertCircle,
          title: 'تغییرات در این سیاست حفظ حریم خصوصی',
          content: [
            'ممکن است این سیاست حفظ حریم خصوصی را هر از گاهی به‌روزرسانی کنیم. تغییرات در این صفحه با تاریخ "آخرین بروزرسانی" به‌روز شده منتشر می‌شود. ما شما را تشویق می‌کنیم این سیاست را به طور دوره‌ای بررسی کنید.',
            'استفاده مستمر از cinestream پس از تغییرات به منزله پذیرش سیاست به‌روز شده است.',
          ],
        },
        {
          icon: Mail,
          title: 'تماس با ما',
          content: [
            'اگر سوال یا نگرانی در مورد این سیاست حفظ حریم خصوصی یا شیوه‌های داده ما دارید، لطفاً با ما تماس بگیرید:',
            '• ایمیل: info@cinestream.com',
            '• برای راه‌های بیشتر برای تماس با ما، از صفحه تماس با ما بازدید کنید',
          ],
        },
      ],
    },
  };

  const currentContent = content[lang];

  return (
    <>
      <SEO
        title={lang === 'en' ? 'Privacy Policy - cinestream' : 'سیاست حریم خصوصی - گرین پیکسل'}
        description={lang === 'en' 
          ? 'Learn about how cinestream collects, uses, and protects your personal information. Our commitment to your privacy and data security.'
          : 'درباره نحوه جمع‌آوری، استفاده و حفاظت از اطلاعات شخصی شما توسط گرین پیکسل بیاموزید. تعهد ما به حریم خصوصی و امنیت داده‌های شما.'
        }
        keywords={lang === 'en'
          ? 'privacy policy, data protection, user privacy, cinestream privacy, personal information'
          : 'سیاست حریم خصوصی, حفاظت از داده, حریم خصوصی کاربر, حریم خصوصی گرین پیکسل, اطلاعات شخصی'
        }
        lang={lang}
        canonicalUrl={`https://cinestream.com/${lang}/privacy`}
        alternateUrls={[
          { lang: 'en', url: 'https://cinestream.com/en/privacy' },
          { lang: 'fa', url: 'https://cinestream.com/fa/privacy' }
        ]}
      />
      <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {currentContent.title}
            </h1>
            <p className="text-neutral-400 text-sm">
              {currentContent.lastUpdated}
            </p>
          </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {currentContent.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8 hover:border-emerald-500/20 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white pt-1">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3 text-neutral-300 leading-relaxed">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className={paragraph.startsWith('•') ? 'ps-4' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          <p className="text-neutral-300 text-center leading-relaxed">
            {lang === 'en'
              ? 'By using cinestream, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.'
              : 'با استفاده از cinestream، تصدیق می‌کنید که این سیاست حفظ حریم خصوصی را خوانده و درک کرده‌اید و با شرایط آن موافقت می‌کنید.'}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}