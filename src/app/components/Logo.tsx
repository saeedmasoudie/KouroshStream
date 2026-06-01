import React from 'react';
import { Play } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'gradient';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 'md', 
  showText = true,
  variant = 'gradient'
}) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', gap: 'gap-1.5' },
    md: { icon: 'w-8 h-8', text: 'text-xl', gap: 'gap-2' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', gap: 'gap-2.5' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', gap: 'gap-4' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {/* Logo Icon Placement */}
      <div className={`relative ${currentSize.icon} flex-shrink-0`}>
        {/* Replace /logo.png with your actual logo file path */}
        <ImageWithFallback
          src="/logo.png"
          alt="KouroshStream Logo"
          className="w-full h-full object-contain"
          fallback={
            <div className={`w-full h-full flex items-center justify-center rounded-lg ${
              variant === 'gradient' ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-purple-600'
            } shadow-lg shadow-purple-600/20`}>
              <Play className="w-1/2 h-1/2 text-white fill-current" />
            </div>
          }
        />
      </div>

      {/* Logo Text Placement */}
      {showText && (
        <span className={`${currentSize.text} font-black tracking-tighter uppercase ${
          variant === 'gradient'
            ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400'
            : 'text-white'
        }`}>
          KouroshStream
        </span>
      )}
    </div>
  );
};
