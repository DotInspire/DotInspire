import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Image as ImageIcon, ExternalLink, Sparkles, Film, ArrowUpRight, CheckSquare, Square } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { GalleryItem } from '../../types';
import { api } from '../../services/api';
import { YouTubeEmbed } from '../../components/common/YouTubeEmbed';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { StudioLoader } from '../../components/common/StudioLoader';

export const AdminGalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadGallery = async () => {
    setLoading(true);
    try {
      // Fetch unified media stream from all sections
      const res: any = await api.get('/gallery?includeUnpublished=true&randomize=false');
      if (res.data) {
        setGallery(res.data);
        setSelectedIds([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const toggleSelectAll = () => {
    if (selectedIds.length === gallery.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(gallery.map((g) => g.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.delete(`/gallery/${deleteTargetId}`);
      toast.success('Media removed from gallery');
      setDeleteTargetId(null);
      loadGallery();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const executeBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/gallery/${id}`).catch(() => {})));
      toast.success(`Removed ${selectedIds.length} item(s) successfully`);
      setSelectedIds([]);
      setIsBulkDeleteModal(false);
      loadGallery();
    } catch (err: any) {
      toast.error(err.message || 'Bulk delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Visual Gallery Showcase</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Aggregated stream of all photos and YouTube videos uploaded across Services, Works, and Catalog Items. Select multiple items to delete or click to edit source.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Select All Button */}
          {gallery.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-700 hover:border-gold-500 bg-charcoal-900 text-xs font-semibold text-neutral-200 hover:text-gold-400 transition-colors flex items-center gap-2"
            >
              {selectedIds.length === gallery.length && gallery.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-gold-500" />
              ) : (
                <Square className="w-4 h-4 text-neutral-400" />
              )}
              <span>{selectedIds.length === gallery.length ? 'Deselect All' : 'Select All'}</span>
            </button>
          )}

          {/* Bulk Delete Trigger Button */}
          {selectedIds.length > 0 && (
            <button
              onClick={() => setIsBulkDeleteModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 active:scale-95 animate-in fade-in"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <span className="text-xs text-gold-400 font-semibold bg-gold-500/10 border border-gold-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{gallery.length} Media Asset{gallery.length !== 1 ? 's' : ''} Live</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-12 bg-charcoal-900 border border-neutral-800 rounded-xl">
          <StudioLoader fullScreen={false} message="Loading Visual Gallery Stream..." />
        </div>
      ) : gallery.length === 0 ? (
        <div className="text-center py-20 bg-charcoal-900 border border-neutral-800 rounded-xl p-8 space-y-3">
          <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Media In Gallery Yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Upload photos or attach YouTube videos when creating or editing Services, Works, or Items to automatically display them here and on the public gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {gallery.map((g) => {
            const isSelected = selectedIds.includes(g.id);
            return (
              <div 
                key={g.id} 
                onClick={(e) => toggleSelectOne(g.id, e)}
                className={`bg-charcoal-900 border rounded-xl overflow-hidden flex flex-col justify-between transition-all group shadow-xl cursor-pointer select-none ${
                  isSelected ? 'border-gold-500 ring-2 ring-gold-500/50 bg-gold-500/5' : 'border-neutral-800 hover:border-gold-500/50'
                }`}
              >
                <div className="aspect-video w-full bg-charcoal-950 relative overflow-hidden">
                  {g.type === 'YOUTUBE' ? (
                    <YouTubeEmbed videoId={g.youtubeVideoId || ''} url={g.url} title={g.title || 'YouTube Video'} />
                  ) : (
                    <img 
                      src={g.url} 
                      alt={g.title || 'Gallery item'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  )}
                  
                  {/* Select Checkbox at Top-Right */}
                  <div 
                    onClick={(e) => toggleSelectOne(g.id, e)}
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-lg bg-charcoal-950/80 backdrop-blur-md border border-neutral-700 flex items-center justify-center transition-all hover:scale-110"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-gold-400" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>

                  {/* Source Badge at Top-Left */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-charcoal-950/80 backdrop-blur-md border border-neutral-700 text-gold-400 shadow-sm flex items-center gap-1">
                      {g.type === 'YOUTUBE' ? <Film className="w-3 h-3 text-rose-400" /> : <ImageIcon className="w-3 h-3 text-gold-400" />}
                      <span>{g.sourceType?.replace('_MEDIA', '') || g.type}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-grow space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-serif font-bold text-white line-clamp-1 group-hover:text-gold-400 transition-colors">
                      {g.title || 'Untitled Showcase'}
                    </h4>
                  </div>
                  {g.sourceName && (
                    <p className="text-[10px] text-gold-500/90 font-medium line-clamp-1">
                      {g.sourceName}
                    </p>
                  )}
                  <p className="text-[11px] text-neutral-400 line-clamp-2">
                    {g.description || 'Media item connected to Dot Inspire showcase.'}
                  </p>
                </div>

                {/* Action Bar */}
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="p-3 border-t border-neutral-800/80 bg-charcoal-950/40 flex items-center justify-between"
                >
                  {/* Clickable jump link to corresponding editing page in admin panel */}
                  {g.adminEditUrl ? (
                    <Link
                      to={g.adminEditUrl}
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-gold-400 font-semibold transition-colors"
                    >
                      <span>Edit Source</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-[10px] text-neutral-500">Standalone</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    {g.targetUrl && (
                      <a
                        href={g.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-colors"
                        title="View on Live Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTargetId(g.id);
                      }} 
                      className="p-1.5 bg-neutral-800 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors"
                      title="Remove from Visual Gallery"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Remove Media from Gallery"
        message="Are you sure you want to remove this media asset from the Visual Gallery showcase?"
        confirmText="Remove Media"
        loading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Bulk Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModal}
        title={`Delete ${selectedIds.length} Gallery Item(s)`}
        message={`Are you sure you want to delete ${selectedIds.length} selected media assets from the Visual Gallery showcase?`}
        confirmText={`Delete ${selectedIds.length} Items`}
        loading={deleting}
        onConfirm={executeBulkDelete}
        onCancel={() => setIsBulkDeleteModal(false)}
      />
    </div>
  );
};
