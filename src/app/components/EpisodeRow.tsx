import React, { useState } from 'react';
import { Play, Download, ChevronDown } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/context/LanguageContext';

interface EpisodeRowProps {
  episode: {
    number: number;
    title: { en: string; fa: string } | string;
    streamUrl: string;
    downloadLinks?: { label?: string; quality?: string; size?: string; url: string }[];
  };
  seasonNumber: number;
  seriesTitle?: string;
  onStream: (url: string, title?: string) => void;
}

export const EpisodeRow: React.FC<EpisodeRowProps> = ({ episode, seasonNumber, seriesTitle, onStream }) => {
  const [showDownloads, setShowDownloads] = useState(false);
  const { t, lang } = useLanguage();

  // Handle title as object or string
  const episodeTitle = typeof episode.title === 'string' 
    ? episode.title 
    : (episode.title[lang] || episode.title.en || '');

  // Check if download links exist
  const hasDownloadLinks = episode.downloadLinks && Array.isArray(episode.downloadLinks) && episode.downloadLinks.length > 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-4">
        {/* Episode Number and Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-emerald-500 font-black text-xl flex-shrink-0">
            {episode.number < 10 ? `0${episode.number}` : episode.number}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-sm md:text-base truncate">{episodeTitle}</h4>
            <p className="text-gray-500 text-xs uppercase tracking-wider">
              {t('episode')} {episode.number}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onStream(episode.streamUrl, `${seriesTitle} - S${seasonNumber} E${episode.number}`)}
            className="flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs md:text-sm font-bold transition-all shadow-md shadow-emerald-600/10"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">{t('stream')}</span>
          </button>
          {hasDownloadLinks && (
            <button
              onClick={() => setShowDownloads(!showDownloads)}
              className={`flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs md:text-sm font-bold border border-white/10 transition-all ${
                showDownloads ? 'bg-white/10 border-emerald-600/30' : ''
              }`}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('download')}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showDownloads ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Download Links Section */}
      <AnimatePresence>
        {showDownloads && hasDownloadLinks && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 overflow-hidden"
          >
            <div className="p-4 space-y-3 bg-black/20">
              {/* Download Notice */}
              <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <p className="text-blue-400 text-[11px] leading-relaxed">
                  <strong className="font-bold">{t('trustTitle')}:</strong> {t('trustHint')}
                </p>
              </div>
              
              <p className="text-xs text-gray-400 font-bold uppercase">{t('downloadQuality')}:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {episode.downloadLinks!.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-emerald-600/10 border border-white/10 hover:border-emerald-600/30 rounded-lg transition-all group"
                  >
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">
                        {link.label || link.quality || `Quality ${idx + 1}`}
                      </span>
                      {link.size && <span className="text-gray-500 text-[10px]">{link.size}</span>}
                    </div>
                    <Download className="w-4 h-4 text-emerald-500 group-hover:translate-y-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};