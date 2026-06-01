import React, { useState, useEffect } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  src: string;
  alt: string; // Make alt REQUIRED for SEO
  fallbackSrc?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean; // For critical images (above the fold)
}

/**
 * OptimizedImage - SEO-Enhanced Image Component
 * 
 * Features:
 * - Required alt text for accessibility and SEO
 * - Lazy loading by default (can be disabled with priority prop)
 * - Width and height attributes to prevent layout shift
 * - Automatic fallback on error
 * - Optimized for Core Web Vitals
 * 
 * Usage:
 * <OptimizedImage 
 *   src="https://example.com/image.jpg" 
 *   alt="Movie poster for Inception - 2010 Sci-Fi Thriller"
 *   width={300}
 *   height={450}
 * />
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc,
  width,
  height,
  loading,
  priority = false,
  className = '',
  style,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        setImgSrc(ERROR_IMG_SRC);
      }
      setHasError(true);
    }
  };

  // Determine loading strategy
  const loadingStrategy = priority ? 'eager' : (loading || 'lazy');

  // If error and no custom fallback, show error state
  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className}`}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
          ...style
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={ERROR_IMG_SRC} 
            alt={`Error loading: ${alt}`} 
            width={width}
            height={height}
            {...rest} 
            data-original-url={src} 
          />
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loadingStrategy}
      className={className}
      style={style}
      onError={handleError}
      // Add decoding hint for better performance
      decoding={priority ? 'sync' : 'async'}
      {...rest}
    />
  );
};

/**
 * MoviePosterImage - Specialized component for movie posters
 * Pre-configured with typical poster dimensions and SEO
 */
export const MoviePosterImage: React.FC<{
  src: string;
  title: string;
  year?: number;
  genre?: string;
  className?: string;
  priority?: boolean;
}> = ({ src, title, year, genre, className, priority }) => {
  const altText = `${title} poster${year ? ` - ${year}` : ''}${genre ? ` ${genre}` : ''} movie`;
  
  return (
    <OptimizedImage
      src={src}
      alt={altText}
      width={300}
      height={450}
      className={className}
      priority={priority}
    />
  );
};

/**
 * BackdropImage - Specialized component for backdrop/hero images
 * Pre-configured with typical backdrop dimensions
 */
export const BackdropImage: React.FC<{
  src: string;
  title: string;
  className?: string;
  priority?: boolean;
}> = ({ src, title, className, priority = true }) => {
  const altText = `${title} backdrop image`;
  
  return (
    <OptimizedImage
      src={src}
      alt={altText}
      width={1920}
      height={1080}
      className={className}
      priority={priority} // Backdrops are usually above the fold
    />
  );
};
