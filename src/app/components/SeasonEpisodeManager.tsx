import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, PlayCircle, Download } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { AnimatePresence } from 'framer-motion';
import { apiService } from '@/app/config/api';
import { toast } from 'sonner';

interface Episode {
  id?: string;
  episode_number: number;
  title: string;
  title_fa: string;
  stream_link?: string;
  download_links?: string | DownloadLink[]; // Can be JSON string from API or array in memory
}

interface DownloadLink {
  label: string;
  url: string;
}

interface Season {
  id?: string;
  season_number: number;
  title: string;
  title_fa: string;
  subtitle_link?: string;
  episode_count: number;
  actual_episode_count?: number;
  episodes?: Episode[];
}

interface SeasonEpisodeManagerProps {
  seriesId: string;
  seriesTitle: string;
  token: string;
  onClose: () => void;
  onUpdate: () => void;
}

export const SeasonEpisodeManager: React.FC<SeasonEpisodeManagerProps> = ({
  seriesId,
  seriesTitle,
  token,
  onClose,
  onUpdate,
}) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [expandedSeasonId, setExpandedSeasonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [addingEpisodeToSeasonId, setAddingEpisodeToSeasonId] = useState<string | null>(null);
  const [episodeDownloadLinks, setEpisodeDownloadLinks] = useState<DownloadLink[]>([{ label: "1080p", url: "" }]);

  const loadSeasons = async () => {
    try {
      setLoading(true);
      const result = await apiService.getSeriesSeasons(seriesId, token);
      setSeasons(result.seasons || []);
    } catch (error) {
      toast.error('Failed to load seasons');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadEpisodesForSeason = async (seasonId: string) => {
    try {
      const result = await apiService.getSeasonEpisodes(seasonId, token);
      setSeasons((prev) =>
        prev.map((s) =>
          s.id === seasonId ? { ...s, episodes: result.episodes || [] } : s
        )
      );
    } catch (error) {
      toast.error('Failed to load episodes');
      console.error(error);
    }
  };

  useEffect(() => {
    loadSeasons();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId]);

  const handleToggleExpand = async (seasonId: string) => {
    if (expandedSeasonId === seasonId) {
      setExpandedSeasonId(null);
    } else {
      setExpandedSeasonId(seasonId);
      await loadEpisodesForSeason(seasonId);
    }
  };

  const handleAddSeason = () => {
    const nextSeasonNumber = seasons.length > 0 
      ? Math.max(...seasons.map(s => s.season_number)) + 1 
      : 1;
    
    setEditingSeason({
      season_number: nextSeasonNumber,
      title: `Season ${nextSeasonNumber}`,
      title_fa: `فصل ${nextSeasonNumber}`,
      subtitle_link: '',
      episode_count: 0,
    });
  };

  const handleSaveSeason = async () => {
    if (!editingSeason) return;

    try {
      if (editingSeason.id) {
        // Update existing season
        await apiService.updateSeason(editingSeason.id, editingSeason, token);
        toast.success('Season updated successfully');
      } else {
        // Add new season
        await apiService.addSeason(
          {
            media_id: seriesId,
            season_number: editingSeason.season_number,
            title: editingSeason.title,
            title_fa: editingSeason.title_fa,
            subtitle_link: editingSeason.subtitle_link,
            episode_count: editingSeason.episode_count,
          },
          token
        );
        toast.success('Season added successfully');
      }
      setEditingSeason(null);
      await loadSeasons();
      onUpdate();
    } catch (error) {
      toast.error('Failed to save season');
      console.error(error);
    }
  };

  const handleDeleteSeason = async (seasonId: string) => {
    if (!confirm('Are you sure? This will delete the season and all its episodes.')) return;

    try {
      await apiService.deleteSeason(seasonId, token);
      toast.success('Season deleted successfully');
      await loadSeasons();
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete season');
      console.error(error);
    }
  };

  const handleAddEpisode = (seasonId: string) => {
    const season = seasons.find(s => s.id === seasonId);
    const nextEpisodeNumber = season?.episodes && season.episodes.length > 0
      ? Math.max(...season.episodes.map(e => e.episode_number)) + 1
      : 1;

    setEpisodeDownloadLinks([{ label: "1080p", url: "" }]);
    setEditingEpisode({
      episode_number: nextEpisodeNumber,
      title: `Episode ${nextEpisodeNumber}`,
      title_fa: `قسمت ${nextEpisodeNumber}`,
      stream_link: '',
      download_links: [],
    });
    setAddingEpisodeToSeasonId(seasonId);
  };

  const handleEditEpisode = (episode: Episode) => {
    // Parse download_links from string if needed
    let parsedLinks: DownloadLink[] = [{ label: "1080p", url: "" }];
    if (episode.download_links) {
      if (typeof episode.download_links === 'string') {
        try {
          parsedLinks = JSON.parse(episode.download_links);
        } catch (e) {
          console.error('Failed to parse download links');
        }
      } else {
        parsedLinks = episode.download_links;
      }
    }
    setEpisodeDownloadLinks(parsedLinks);
    setEditingEpisode(episode);
  };

  const handleSaveEpisode = async () => {
    if (!editingEpisode) return;

    try {
      // Convert download links to JSON string for API
      const downloadLinksJson = JSON.stringify(episodeDownloadLinks);
      
      if (editingEpisode.id) {
        // Update existing episode
        await apiService.updateEpisode(editingEpisode.id, {
          ...editingEpisode,
          download_links: downloadLinksJson,
        }, token);
        toast.success('Episode updated successfully');
      } else if (addingEpisodeToSeasonId) {
        // Add new episode
        await apiService.addEpisode(
          {
            season_id: addingEpisodeToSeasonId,
            episode_number: editingEpisode.episode_number,
            title: editingEpisode.title,
            title_fa: editingEpisode.title_fa,
            stream_link: editingEpisode.stream_link || '',
            download_links: downloadLinksJson,
          },
          token
        );
        toast.success('Episode added successfully');
      }
      setEditingEpisode(null);
      setAddingEpisodeToSeasonId(null);
      setEpisodeDownloadLinks([{ label: "1080p", url: "" }]);
      if (expandedSeasonId) {
        await loadEpisodesForSeason(expandedSeasonId);
      }
      await loadSeasons();
      onUpdate();
    } catch (error) {
      toast.error('Failed to save episode');
      console.error(error);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!confirm('Are you sure you want to delete this episode?')) return;

    try {
      await apiService.deleteEpisode(episodeId, token);
      toast.success('Episode deleted successfully');
      if (expandedSeasonId) {
        await loadEpisodesForSeason(expandedSeasonId);
      }
      await loadSeasons();
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete episode');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-neutral-900 border border-neutral-800 rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl font-black text-white">Manage Seasons & Episodes</h2>
            <p className="text-gray-500 mt-1">{seriesTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading seasons...</div>
          ) : (
            <>
              {seasons.map((season) => (
                <div key={season.id} className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
                  {/* Season Header */}
                  <div className="flex items-center justify-between p-4">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => season.id && handleToggleExpand(season.id)}
                    >
                      <h3 className="text-white font-bold">
                        Season {season.season_number}: {season.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {season.actual_episode_count || 0} episodes
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSeason(season)}
                        className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg font-bold text-sm transition-all flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => season.id && handleAddEpisode(season.id)}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg font-bold text-sm transition-all flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Episode
                      </button>
                      <button
                        onClick={() => season.id && handleDeleteSeason(season.id)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-bold text-sm transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Episodes List */}
                  {expandedSeasonId === season.id && (
                    <div className="border-t border-neutral-700 bg-neutral-850 p-4 space-y-2">
                      {season.episodes && season.episodes.length > 0 ? (
                        season.episodes.map((episode) => (
                          <div
                            key={episode.id}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <h4 className="text-white font-bold text-sm">
                                Episode {episode.episode_number}: {episode.title}
                              </h4>
                              <p className="text-gray-500 text-xs">{episode.title_fa}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditEpisode(episode)}
                                className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg text-xs font-bold transition-all"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => episode.id && handleDeleteEpisode(episode.id)}
                                className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-xs font-bold transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          No episodes yet. Click "Add Episode" to create one.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddSeason}
                className="w-full py-4 border-2 border-dashed border-neutral-700 hover:border-emerald-500 text-gray-500 hover:text-emerald-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Season
              </button>
            </>
          )}
        </div>

        {/* Season Edit Modal */}
        <AnimatePresence>
          {editingSeason && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-10">
              <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {editingSeason.id ? 'Edit Season' : 'Add New Season'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                      Season Number
                    </label>
                    <input
                      type="number"
                      value={editingSeason.season_number}
                      onChange={(e) =>
                        setEditingSeason({ ...editingSeason, season_number: parseInt(e.target.value) })
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                      Title (English)
                    </label>
                    <input
                      value={editingSeason.title}
                      onChange={(e) => setEditingSeason({ ...editingSeason, title: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                      Title (Persian)
                    </label>
                    <input
                      value={editingSeason.title_fa}
                      onChange={(e) =>
                        setEditingSeason({ ...editingSeason, title_fa: e.target.value })
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 text-right"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                      Subtitle Link (Optional)
                    </label>
                    <input
                      placeholder="https://example.com/subtitle.zip"
                      value={editingSeason.subtitle_link || ''}
                      onChange={(e) =>
                        setEditingSeason({ ...editingSeason, subtitle_link: e.target.value })
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveSeason}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSeason(null)}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-bold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Episode Edit Modal */}
        <AnimatePresence>
          {editingEpisode && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-10 overflow-y-auto pt-6 pb-4">
              <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-2xl mt-4 mb-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {editingEpisode.id ? 'Edit Episode' : 'Add New Episode'}
                </h3>
                <div className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                        Episode Number
                      </label>
                      <input
                        type="number"
                        value={editingEpisode.episode_number}
                        onChange={(e) =>
                          setEditingEpisode({ ...editingEpisode, episode_number: parseInt(e.target.value) })
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                      Title (English)
                    </label>
                    <input
                      value={editingEpisode.title}
                      onChange={(e) => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                      Title (Persian)
                    </label>
                    <input
                      value={editingEpisode.title_fa}
                      onChange={(e) =>
                        setEditingEpisode({ ...editingEpisode, title_fa: e.target.value })
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 text-right"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                      Stream Link (Embed URL)
                    </label>
                    <input
                      placeholder="https://player.example.com/embed/..."
                      value={editingEpisode.stream_link || ''}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value.includes('<iframe')) {
                          const match = value.match(/src="([^"]+)"/);
                          if (match && match[1]) {
                            value = match[1];
                          }
                        }
                        setEditingEpisode({ ...editingEpisode, stream_link: value });
                      }}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  
                  {/* Download Links */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Links
                      </label>
                      <button
                        type="button"
                        onClick={() => setEpisodeDownloadLinks([...episodeDownloadLinks, { label: "", url: "" }])}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        Add Link
                      </button>
                    </div>
                    <div className="space-y-2">
                      {episodeDownloadLinks.map((link, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            value={link.label}
                            onChange={(e) => {
                              const newLinks = [...episodeDownloadLinks];
                              newLinks[idx].label = e.target.value;
                              setEpisodeDownloadLinks(newLinks);
                            }}
                            placeholder="Quality (e.g., 1080p)"
                            className="w-32 bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                          />
                          <input
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...episodeDownloadLinks];
                              newLinks[idx].url = e.target.value;
                              setEpisodeDownloadLinks(newLinks);
                            }}
                            placeholder="Download URL"
                            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                          />
                          {episodeDownloadLinks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setEpisodeDownloadLinks(episodeDownloadLinks.filter((_, i) => i !== idx))}
                              className="p-2 text-red-400 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-800">
                  <button
                    onClick={handleSaveEpisode}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Episode
                  </button>
                  <button
                    onClick={() => {
                      setEditingEpisode(null);
                      setAddingEpisodeToSeasonId(null);
                      setEpisodeDownloadLinks([{ label: "1080p", url: "" }]);
                    }}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </Motion.div>
            </div>
          )}
        </AnimatePresence>
      </Motion.div>
    </div>
  );
};