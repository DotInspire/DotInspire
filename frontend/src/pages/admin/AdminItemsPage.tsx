import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Edit3, CheckSquare, Square, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Item, Service } from '../../types';
import { api } from '../../services/api';
import { MultiImageUploadInput } from '../../components/admin/MultiImageUploadInput';
import { MultiYouTubeInput } from '../../components/admin/MultiYouTubeInput';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { StudioLoader } from '../../components/common/StudioLoader';

export const AdminItemsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [items, setItems] = useState<Item[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: '',
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    material: '',
    specifications: '',
    isPublished: true,
    isFeatured: false,
  });

  const [itemImageUrls, setItemImageUrls] = useState<string[]>([]);
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);
  const [addToGallery, setAddToGallery] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsRes, servicesRes]: any = await Promise.all([
        api.get('/items?includeUnpublished=true'),
        api.get('/services'),
      ]);
      if (itemsRes.data) {
        setItems(itemsRes.data);
        setSelectedIds([]);
        if (editId) {
          const match = itemsRes.data.find((it: Item) => it.id === editId);
          if (match) openEditModal(match);
        }
      }
      if (servicesRes.data) {
        setServices(servicesRes.data);
        if (servicesRes.data.length > 0 && !formData.serviceId) {
          setFormData((prev) => ({ ...prev, serviceId: servicesRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load items catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [editId]);

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setItemImageUrls([]);
    setYoutubeUrls([]);
    setFormData({
      serviceId: services.length > 0 ? services[0].id : '',
      name: '',
      shortDescription: '',
      description: '',
      category: '',
      material: '',
      specifications: '',
      isPublished: true,
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    const existingImages = item.media?.filter((m) => m.type === 'IMAGE').map((m) => m.url) || [];
    const existingVideos = item.media?.filter((m) => m.type === 'YOUTUBE').map((m) => m.url) || [];
    setItemImageUrls(existingImages);
    setYoutubeUrls(existingVideos);
    setFormData({
      serviceId: item.serviceId,
      name: item.name,
      shortDescription: item.shortDescription,
      description: item.description,
      category: item.category || '',
      material: item.material || '',
      specifications: item.specifications || '',
      isPublished: item.isPublished,
      isFeatured: item.isFeatured,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        images: itemImageUrls,
        youtubeUrls: youtubeUrls,
      };

      if (editingItem) {
        await api.patch(`/items/${editingItem.id}`, payload);
        toast.success('Item updated successfully');
      } else {
        await api.post('/items', payload);
        toast.success('Item created successfully');
      }

      if (addToGallery && itemImageUrls.length > 0) {
        for (const imgUrl of itemImageUrls) {
          await api.post('/gallery', {
            title: `${formData.name} Showcase`,
            type: 'IMAGE',
            url: imgUrl,
          }).catch(() => {});
        }
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.delete(`/items/${deleteTargetId}`);
      toast.success('Catalog item deleted successfully');
      setDeleteTargetId(null);
      loadData();
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
      await Promise.all(selectedIds.map((id) => api.delete(`/items/${id}`).catch(() => {})));
      toast.success(`Deleted ${selectedIds.length} catalog item(s) successfully`);
      setSelectedIds([]);
      setIsBulkDeleteModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Bulk delete failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <StudioLoader fullScreen={false} message="Loading Catalog Items & Media..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Items Catalog</h1>
          <p className="text-xs text-neutral-400 mt-1">Manage individual items inside Services (Velvet Curtains, Roman Blinds, Plasters)</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={() => setIsBulkDeleteModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95 animate-in fade-in"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 shadow-lg shadow-gold-500/20"
          >
            <Plus className="w-4 h-4" /> Add New Item
          </button>
        </div>
      </div>

      <div className="bg-charcoal-900 border border-neutral-800 rounded-lg overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-charcoal-950 text-neutral-400 font-serif border-b border-neutral-800 uppercase tracking-wider">
            <tr>
              <th className="p-4 w-12 text-center">
                <button
                  onClick={toggleSelectAll}
                  className="hover:text-gold-400 transition-colors p-1"
                  title="Select All"
                >
                  {selectedIds.length === items.length && items.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-gold-400" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </th>
              <th className="p-4">Item Name</th>
              <th className="p-4">Parent Service</th>
              <th className="p-4">Category / Material</th>
              <th className="p-4">Media Attachments</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <tr key={item.id} className={`hover:bg-neutral-800/40 transition-colors ${isSelected ? 'bg-gold-500/10' : ''}`}>
                  <td className="p-4 text-center">
                    <button
                      onClick={(e) => toggleSelectOne(item.id, e)}
                      className="p-1 hover:text-gold-400 transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-gold-400" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-600" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 font-bold text-white">{item.name}</td>
                  <td className="p-4 text-gold-400 font-medium">{item.service?.name}</td>
                  <td className="p-4 text-neutral-400">
                    {item.category || item.material || 'Standard'}
                  </td>
                  <td className="p-4 text-neutral-300">
                    {item.media?.length || 0} Media File(s)
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      item.isPublished ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {item.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(item)} className="p-2 bg-neutral-800 hover:bg-neutral-700 text-gold-400 rounded">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setDeleteTargetId(item.id)} 
                      className="p-2 bg-neutral-800 hover:bg-rose-900 text-rose-400 rounded"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Catalog Item"
        message="Are you sure you want to permanently delete this catalog item and all associated media?"
        confirmText="Delete Item"
        loading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ConfirmModal
        isOpen={isBulkDeleteModal}
        title={`Delete ${selectedIds.length} Catalog Item(s)`}
        message={`Are you sure you want to permanently delete the ${selectedIds.length} selected catalog items and all associated media?`}
        confirmText={`Delete ${selectedIds.length} Items`}
        loading={deleting}
        onConfirm={executeBulkDelete}
        onCancel={() => setIsBulkDeleteModal(false)}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-charcoal-900 border border-neutral-800 rounded-xl p-4 sm:p-5 max-w-xl w-full max-h-[92vh] overflow-y-auto no-scrollbar space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                {editingItem ? 'Edit Catalog Item' : 'Add New Catalog Item'}
              </h3>
              <button 
                type="button" 
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Parent Service *</label>
                  <select
                    required
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Category / Type</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 items-start">
                <MultiImageUploadInput
                  label="Item Media Photos (Select One or Multiple)"
                  values={itemImageUrls}
                  onChange={setItemImageUrls}
                  showGalleryToggle={true}
                  addToGallery={addToGallery}
                  onToggleGallery={setAddToGallery}
                />
              </div>

              <MultiYouTubeInput
                label="Item YouTube Videos / Showcases"
                values={youtubeUrls}
                onChange={setYoutubeUrls}
              />

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Full Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Specifications</label>
                  <textarea
                    rows={2}
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-gold-500/20 disabled:opacity-50 active:scale-95 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Item</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
