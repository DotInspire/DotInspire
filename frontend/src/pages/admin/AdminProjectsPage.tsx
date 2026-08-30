import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Edit3, CheckSquare, Square, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Project } from '../../types';
import { api } from '../../services/api';
import { MultiImageUploadInput } from '../../components/admin/MultiImageUploadInput';
import { MultiYouTubeInput } from '../../components/admin/MultiYouTubeInput';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { StudioLoader } from '../../components/common/StudioLoader';

export const AdminProjectsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectImageUrls, setProjectImageUrls] = useState<string[]>([]);
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addToGallery, setAddToGallery] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    projectType: '',
    description: '',
    coverImage: '',
    servicesInvolved: '',
    isPublished: true,
    isFeatured: false,
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/projects?includeUnpublished=true');
      if (res.data) {
        setProjects(res.data);
        setSelectedIds([]);
        if (editId) {
          const match = res.data.find((p: Project) => p.id === editId);
          if (match) openEditModal(match);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load works & projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [editId]);

  const toggleSelectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setProjectImageUrls([]);
    setYoutubeUrls([]);
    setFormData({
      name: '',
      location: '',
      projectType: '',
      description: '',
      coverImage: '',
      servicesInvolved: '',
      isPublished: true,
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    const existingImages = project.media?.filter((m) => m.type === 'IMAGE').map((m) => m.url) || [];
    const existingVideos = project.media?.filter((m) => m.type === 'YOUTUBE').map((m) => m.url) || [];
    setProjectImageUrls(project.coverImage ? [project.coverImage, ...existingImages] : existingImages);
    setYoutubeUrls(existingVideos);
    setFormData({
      name: project.name,
      location: project.location || '',
      projectType: project.projectType || '',
      description: project.description || '',
      coverImage: project.coverImage || '',
      servicesInvolved: project.servicesInvolved || '',
      isPublished: project.isPublished,
      isFeatured: project.isFeatured,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const cover = projectImageUrls.length > 0 ? projectImageUrls[0] : formData.coverImage;

      const payload = {
        ...formData,
        coverImage: cover,
        images: projectImageUrls,
        youtubeUrls: youtubeUrls,
      };

      if (editingProject) {
        await api.patch(`/projects/${editingProject.id}`, payload);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created successfully');
      }

      if (addToGallery && projectImageUrls.length > 0) {
        for (const imgUrl of projectImageUrls) {
          await api.post('/gallery', {
            title: `${formData.name} Showcase`,
            type: 'IMAGE',
            url: imgUrl,
          }).catch(() => {});
        }
      }

      setModalOpen(false);
      loadProjects();
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
      await api.delete(`/projects/${deleteTargetId}`);
      toast.success('Project deleted successfully');
      setDeleteTargetId(null);
      loadProjects();
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
      await Promise.all(selectedIds.map((id) => api.delete(`/projects/${id}`).catch(() => {})));
      toast.success(`Deleted ${selectedIds.length} project(s) successfully`);
      setSelectedIds([]);
      setIsBulkDeleteModal(false);
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || 'Bulk delete failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <StudioLoader fullScreen={false} message="Loading Completed Works & Projects..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Works & Projects</h1>
          <p className="text-xs text-neutral-400 mt-1">Manage completed interior architecture works, photo uploads, and YouTube video tours</p>
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
            className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 shadow-lg shadow-gold-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Work
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
                  {selectedIds.length === projects.length && projects.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-gold-400" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </th>
              <th className="p-4">Cover</th>
              <th className="p-4">Project Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {projects.map((p) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <tr key={p.id} className={`hover:bg-neutral-800/40 transition-colors ${isSelected ? 'bg-gold-500/10' : ''}`}>
                  <td className="p-4 text-center">
                    <button
                      onClick={(e) => toggleSelectOne(p.id, e)}
                      className="p-1 hover:text-gold-400 transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-gold-400" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-600" />
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <img src={p.coverImage || 'https://via.placeholder.com/100'} alt="" className="w-12 h-10 object-cover rounded border border-neutral-800" />
                  </td>
                  <td className="p-4 font-bold text-white">{p.name}</td>
                  <td className="p-4 text-neutral-300">{p.location || 'Kerala'}</td>
                  <td className="p-4 text-gold-400">{p.projectType}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      p.isPublished ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {p.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(p)} className="p-2 bg-neutral-800 hover:bg-neutral-700 text-gold-400 rounded">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setDeleteTargetId(p.id)} 
                      className="p-2 bg-neutral-800 hover:bg-rose-900 text-rose-400 rounded"
                      title="Delete Work"
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
        title="Delete Work / Project"
        message="Are you sure you want to permanently delete this portfolio work? All associated photos and video media attachments will also be removed."
        confirmText="Delete Work"
        loading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ConfirmModal
        isOpen={isBulkDeleteModal}
        title={`Delete ${selectedIds.length} Work(s)`}
        message={`Are you sure you want to permanently delete the ${selectedIds.length} selected works and their media?`}
        confirmText={`Delete ${selectedIds.length} Works`}
        loading={deleting}
        onConfirm={executeBulkDelete}
        onCancel={() => setIsBulkDeleteModal(false)}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-charcoal-900 border border-neutral-800 rounded-xl p-4 sm:p-5 max-w-xl w-full max-h-[92vh] overflow-y-auto no-scrollbar space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                {editingProject ? 'Edit Work Portfolio' : 'Add New Work'}
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
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Work / Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Project Type</label>
                  <input
                    type="text"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Services Involved</label>
                  <input
                    type="text"
                    value={formData.servicesInvolved}
                    onChange={(e) => setFormData({ ...formData, servicesInvolved: e.target.value })}
                    className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 items-start">
                <MultiImageUploadInput
                  label="Work / Project Photos (Select One or Multiple)"
                  values={projectImageUrls}
                  onChange={setProjectImageUrls}
                  showGalleryToggle={true}
                  addToGallery={addToGallery}
                  onToggleGallery={setAddToGallery}
                />
              </div>

              <MultiYouTubeInput
                label="Project YouTube Video Tours / Showcases"
                values={youtubeUrls}
                onChange={setYoutubeUrls}
              />

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Project Overview / Narrative *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg p-2 text-white text-xs focus:border-gold-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-white text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="accent-gold-500 rounded"
                  />
                  <span>Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-gold-500 rounded"
                  />
                  <span>Featured Work</span>
                </label>
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
                    <span>Save Work</span>
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
