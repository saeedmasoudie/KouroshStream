import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useLanguage } from "@/app/context/LanguageContext";
import { Media } from "@/app/data/mockData";
import { MediaCard } from "@/app/components/MediaCard";
import { Search } from "lucide-react";
import { SearchResultsSkeleton } from "@/app/components/SkeletonLoader";
import { apiService } from "@/app/config/api";
import { EmptyState } from "@/app/components/EmptyState";
import { SEO } from "@/app/components/SEO";

export const SearchResultsPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Media[]>([]);

  // Fetch Search Results from Cloudflare Worker
  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await apiService.search(query, lang);
        setSearchResults(response.results || []);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [query, lang]);

  if (isLoading && query.trim()) {
    return <SearchResultsSkeleton />;
  }

  return (
    <>
      <SEO
        title={query 
          ? (lang === 'en' ? `Search Results for "${query}" - cinestream` : `نتایج جستجو برای "${query}" - گرین پیکسل`)
          : (lang === 'en' ? 'Search Movies & Series - cinestream' : 'جستجوی فیلم و سریال - گرین پیکسل')
        }
        description={query 
          ? (lang === 'en' 
              ? `Found ${searchResults.length} results for "${query}". Search and discover movies and TV series on cinestream.`
              : `${searchResults.length} نتیجه برای "${query}" یافت شد. فیلم و سریال را در گرین پیکسل جستجو و کشف کنید.`)
          : (lang === 'en'
              ? 'Search our extensive library of movies and TV series. Find your favorite content quickly and easily.'
              : 'کتابخانه گسترده فیلم و سریال ما را جستجو کنید. محتوای مورد علاقه خود را سریع و آسان پیدا کنید.')
        }
        keywords={query
          ? (lang === 'en' ? `${query}, search, movies, series, cinestream` : `${query}, جستجو, فیلم, سریال, گرین پیکسل`)
          : (lang === 'en' ? 'search movies, find series, movie search, cinestream' : 'جستجوی فیلم, پیدا کردن سریال, جستجو فیلم, گرین پیکسل')
        }
        lang={lang}
        canonicalUrl={`https://cinestream.com/${lang}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`}
        alternateUrls={[
          { lang: 'en', url: `https://cinestream.com/en/search${query ? `?q=${encodeURIComponent(query)}` : ''}` },
          { lang: 'fa', url: `https://cinestream.com/fa/search${query ? `?q=${encodeURIComponent(query)}` : ''}` }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-600/10 rounded-2xl">
              <Search className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black">
                {t("searchResults")}
              </h1>
              {query && (
                <p className="text-gray-400 mt-2">
                  {t("searchingFor")}: <span className="text-white font-bold">"{query}"</span>
                </p>
              )}
            </div>
          </div>
          <p className="text-gray-500">
            {searchResults.length} {t("resultsFound")}
          </p>
        </div>

      {!query.trim() ? (
        <EmptyState 
          type="search" 
          message={t("enterSearchQuery") || "Please enter a search query."} 
        />
      ) : searchResults.length === 0 ? (
        <EmptyState 
          type="search" 
          message={t("noResults") || "No results found."}
          action={{
            label: lang === 'fa' ? 'بازگشت به خانه' : 'Back to Home',
            onClick: () => navigate('/')
          }}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {searchResults.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
    </>
  );
};