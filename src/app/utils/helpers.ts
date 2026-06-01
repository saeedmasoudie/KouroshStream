/**
 * Utility helper functions
 */

/**
 * Safely normalize genres to always return an array
 * Handles cases where genres might be:
 * - An array of strings
 * - A comma-separated string
 * - A single string
 * - Undefined/null
 */
export function normalizeGenres(genres: any): string[] {
  if (!genres) return [];
  
  // If it's already an array, check if items need splitting
  if (Array.isArray(genres)) {
    const result: string[] = [];
    genres.forEach(g => {
      if (g && typeof g === 'string') {
        // Split by comma, period, or both
        g.split(/[,.]/).forEach(item => {
          const trimmed = item.trim();
          if (trimmed) result.push(trimmed);
        });
      }
    });
    return result;
  }
  
  // If it's a string, try to split by comma or period
  if (typeof genres === 'string') {
    return genres
      .split(/[,.]/)
      .map(g => g.trim())
      .filter(g => g);
  }
  
  return [];
}

/**
 * Safely get quality label from quality string
 */
export function getQualityLabel(quality: any): string {
  if (!quality) return 'HD';
  
  if (typeof quality === 'string') {
    return quality.split(' ')[0] || 'HD';
  }
  
  return 'HD';
}