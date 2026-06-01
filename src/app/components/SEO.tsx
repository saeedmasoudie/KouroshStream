import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  image?: string; // Fallback for ogImage
  ogType?: string;
  type?: string; // Fallback for ogType
  lang?: 'en' | 'fa';
  canonicalUrl?: string;
  alternateUrls?: {
    lang: string;
    url: string;
  }[];
  mediaType?: 'movie' | 'series';
  rating?: number;
  year?: number;
  genres?: string[];
  director?: string;
  cast?: any[];
  isHomePage?: boolean; // New prop for homepage detection
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  image,
  ogType,
  type,
  lang = 'en',
  canonicalUrl,
  alternateUrls = [],
  mediaType,
  rating,
  year,
  genres,
  director,
  cast,
  isHomePage = false,
}) => {
  const location = useLocation();
  const fullUrl = canonicalUrl || `https://cinestream.com${location.pathname}`;
  const finalImage = ogImage || image || 'https://cinestream.com/og-image.jpg';
  const finalType = ogType || type || 'website';

  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Helper function to set or update link tags
    const setLinkTag = (rel: string, href: string, hreflang?: string) => {
      if (!href) return;
      
      const selector = hreflang 
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      
      let element = document.querySelector(selector) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        if (hreflang) {
          element.setAttribute('hreflang', hreflang);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('href', href);
    };

    // Standard meta tags
    setMetaTag('description', description);
    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    // Open Graph meta tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', fullUrl, true);
    setMetaTag('og:type', finalType, true);
    setMetaTag('og:image', finalImage, true);
    setMetaTag('og:locale', lang === 'fa' ? 'fa_IR' : 'en_US', true);
    setMetaTag('og:site_name', 'cinestream', true);

    // Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', finalImage);

    // Additional SEO tags
    setMetaTag('robots', 'index, follow');
    setMetaTag('language', lang === 'fa' ? 'Persian' : 'English');

    // Canonical URL
    setLinkTag('canonical', fullUrl);

    // Favicon & Touch Icons
    setLinkTag('icon', '/favicon.ico');
    setLinkTag('shortcut icon', '/favicon.ico');
    setLinkTag('apple-touch-icon', '/apple-touch-icon.png');
    setLinkTag('manifest', '/manifest.json');

    // Alternate language URLs - Remove old ones first to avoid duplicates
    const existingAlternates = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingAlternates.forEach(link => link.remove());

    // Add new alternate language URLs
    alternateUrls.forEach(({ lang: altLang, url }) => {
      setLinkTag('alternate', url, altLang);
    });

    // If we have alternate URLs, set x-default to the current English version
    if (alternateUrls.length > 0) {
      const defaultUrl = alternateUrls.find(alt => alt.lang === 'en')?.url || fullUrl;
      setLinkTag('alternate', defaultUrl, 'x-default');
    }

    // Schema.org Structured Data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // WebSite Schema for Homepage (enables Google search box)
    if (isHomePage) {
      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'cinestream',
        alternateName: 'Green Pixle',
        url: 'https://cinestream.com',
        description: 'Stream and download movies and TV series in high quality with English and Persian subtitles',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `https://cinestream.com/${lang}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        },
        inLanguage: ['en', 'fa']
      };

      const websiteScript = document.createElement('script');
      websiteScript.type = 'application/ld+json';
      websiteScript.text = JSON.stringify(websiteSchema);
      document.head.appendChild(websiteScript);
    }

    // Movie/Series Schema
    if (mediaType) {
      const schemaData: any = {
        '@context': 'https://schema.org',
        '@type': mediaType === 'movie' ? 'Movie' : 'TVSeries',
        name: title,
        description: description,
        image: finalImage,
        datePublished: year ? `${year}-01-01` : undefined,
        director: director ? {
          '@type': 'Person',
          name: director
        } : undefined,
        actor: cast ? cast.map(actor => ({
          '@type': 'Person',
          name: actor.name || actor
        })) : undefined,
        aggregateRating: rating ? {
          '@type': 'AggregateRating',
          ratingValue: rating,
          bestRating: '10',
          worstRating: '1'
        } : undefined,
        genre: genres,
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }

  }, [title, description, keywords, finalImage, finalType, lang, fullUrl, alternateUrls, mediaType, rating, year, director, cast, isHomePage]);

  return null;
};