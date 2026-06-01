/**
 * Create SEO-friendly URL for media item with language prefix
 * Format: /en/movie/my-movie-slug or /fa/series/my-series-slug
 * Uses slug if available, falls back to ID+Title if not
 */

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\u0600-\u06FF\-]+/g, '') // Remove all non-word chars (preserving Persian chars)
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

export function createMediaUrl(type: 'movie' | 'series', id: string, title: string, lang: 'en' | 'fa', slug?: string): string {
  // If we have a dedicated slug from the database, use it
  if (slug) {
    return `/${lang}/${type}/${slug}`;
  }

  // Fallback: Generate slug from title
  const generatedSlug = slugify(title);
  
  if (!generatedSlug) {
    // Fallback to ID only if slug generation fails
    return `/${lang}/${type}/${id}`;
  }
  
  return `/${lang}/${type}/${generatedSlug}`;
}

export function extractSlugFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}