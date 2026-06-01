import React from "react";

// Base Skeleton Component
export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
);

// Media Card Skeleton for Movie/Series Lists
export const MediaCardSkeleton: React.FC = () => (
  <div className="group relative">
    <div className="aspect-[2/3] bg-white/5 rounded-2xl overflow-hidden border border-white/10 animate-pulse" />
    <div className="mt-3 space-y-2">
      <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
      <div className="flex items-center justify-between">
        <div className="h-3 bg-white/5 rounded animate-pulse w-16" />
        <div className="h-3 bg-white/5 rounded animate-pulse w-12" />
      </div>
    </div>
  </div>
);

// Hero/Slideshow Skeleton
export const HeroSkeleton: React.FC = () => (
  <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden bg-slate-900">
    <div className="absolute inset-0 bg-white/5 animate-pulse" />
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 space-y-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 md:h-12 bg-white/10 rounded-lg w-3/4 md:w-1/2 animate-pulse" />
        <div className="h-4 md:h-6 bg-white/10 rounded-lg w-2/3 md:w-1/3 animate-pulse" />
        <div className="flex gap-3">
          <div className="h-12 md:h-14 bg-white/10 rounded-xl w-32 md:w-40 animate-pulse" />
          <div className="h-12 md:h-14 bg-white/10 rounded-xl w-32 md:w-40 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

// Content Section Skeleton (for Trending/Newest sections)
export const ContentSectionSkeleton: React.FC = () => (
  <section className="py-12 md:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-white/10 rounded-lg w-48 animate-pulse" />
        <div className="h-10 bg-white/10 rounded-xl w-32 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </section>
);

// Detail Page Skeleton
export const DetailPageSkeleton: React.FC = () => (
  <div className="pb-20">
    {/* Banner Skeleton */}
    <div className="relative h-[45vh] md:h-[65vh] w-full overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-white/5 animate-pulse" />
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8 md:pb-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end w-full">
          <div className="hidden md:block w-48 lg:w-64">
            <div className="aspect-[2/3] bg-white/10 rounded-2xl animate-pulse" />
          </div>
          <div className="flex-grow space-y-4 w-full">
            <div className="h-8 md:h-16 bg-white/10 rounded-lg w-3/4 animate-pulse mx-auto md:mx-0" />
            <div className="flex gap-2 justify-center md:justify-start">
              <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
      <div className="lg:col-span-2 space-y-12">
        {/* Trailer Skeleton */}
        <div>
          <div className="h-6 bg-white/10 rounded w-32 mb-6 animate-pulse" />
          <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 animate-pulse" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-white/10 rounded w-32 mb-4 animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
        </div>

        {/* Download Links Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-white/10 rounded w-32 mb-6 animate-pulse" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="hidden lg:block">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
          <div className="h-6 bg-white/10 rounded w-32 animate-pulse" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-5 h-5 bg-white/10 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/5 rounded w-20 animate-pulse" />
                <div className="h-4 bg-white/10 rounded w-32 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Search Results Skeleton
export const SearchResultsSkeleton: React.FC = () => (
  <div className="min-h-screen py-12 md:py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-10 bg-white/10 rounded-lg w-64 mb-12 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// Media List Page Skeleton (Movies/Series List)
export const MediaListSkeleton: React.FC = () => (
  <div className="min-h-screen py-12 md:py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title Skeleton */}
      <div className="h-12 bg-white/10 rounded-lg w-48 mb-8 animate-pulse" />

      {/* Filters Skeleton */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-28 bg-white/5 rounded-xl border border-white/10 animate-pulse" />
          ))}
        </div>
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-white/5 rounded-xl border border-white/10 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(18)].map((_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// Comment Skeleton
export const CommentSkeleton: React.FC = () => (
  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-white/10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-32" />
        <div className="h-3 bg-white/5 rounded w-20" />
      </div>
    </div>
    <div className="space-y-2 pl-13">
      <div className="h-4 bg-white/5 rounded w-full" />
      <div className="h-4 bg-white/5 rounded w-full" />
      <div className="h-4 bg-white/5 rounded w-3/4" />
    </div>
  </div>
);
