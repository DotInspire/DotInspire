import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Inquiry } from '../../types';
import { api } from '../../services/api';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { StudioLoader } from '../../components/common/StudioLoader';

export const AdminInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/inquiries');
      if (res.data) setInquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'UNREAD' | 'READ' | 'CONTACTED') => {
    try {
      await api.patch(`/inquiries/${id}`, { status });
      toast.success(`Inquiry status updated to ${status}`);
      loadInquiries();
    } catch (err: any) {
      toast.error(err.message || 'Update status failed');
    }
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.delete(`/inquiries/${deleteTargetId}`);
      toast.success('Inquiry entry deleted');
      setDeleteTargetId(null);
      loadInquiries();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <StudioLoader fullScreen={false} message="Loading Client Inquiries..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Client Inquiries</h1>
        <p className="text-xs text-neutral-400 mt-1">Review design consultation requests submitted through website forms</p>
      </div>

      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <div className="bg-charcoal-900 border border-neutral-800 p-8 rounded text-center text-neutral-400 text-xs">
            No client inquiries received yet.
          </div>
        ) : (
          inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`bg-charcoal-900 border rounded-lg p-6 space-y-4 shadow-xl transition-colors ${
                inq.status === 'UNREAD' ? 'border-gold-500/80 bg-charcoal-900/90' : 'border-neutral-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <span>{inq.name}</span>
                    {inq.status === 'UNREAD' && (
                      <span className="px-2 py-0.5 bg-gold-500 text-charcoal-950 text-[10px] font-bold rounded">
                        NEW INQUIRY
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-1">
                    <span className="flex items-center gap-1 font-mono text-gold-400">
                      <Phone className="w-3.5 h-3.5" /> +91 {inq.phone}
                    </span>
                    {inq.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-neutral-500" /> {inq.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" /> {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                  <select
                    value={inq.status}
                    onChange={(e) => handleUpdateStatus(inq.id, e.target.value as any)}
                    className="bg-charcoal-950 border border-neutral-800 text-xs text-white rounded px-3 py-1.5 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="UNREAD">Mark Unread</option>
                    <option value="READ">Mark Read</option>
                    <option value="CONTACTED">Mark Contacted</option>
                  </select>
                  <button
                    onClick={() => setDeleteTargetId(inq.id)}
                    className="p-2 bg-neutral-800 hover:bg-rose-900 text-rose-400 rounded transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {inq.service?.name && (
                <div className="text-xs">
                  <span className="text-neutral-400 uppercase tracking-widest font-serif text-[10px]">Service Scope: </span>
                  <span className="text-gold-400 font-semibold">{inq.service.name}</span>
                </div>
              )}

              <p className="text-xs text-neutral-200 font-light leading-relaxed bg-charcoal-950 p-4 rounded border border-neutral-800 whitespace-pre-line">
                {inq.message}
              </p>

              <div className="flex items-center gap-4 text-xs pt-2">
                <a
                  href={`https://wa.me/91${inq.phone}?text=${encodeURIComponent(`Hi ${inq.name}, thank you for contacting Dot Inspire Design Studio.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5"
                >
                  Reply via WhatsApp
                </a>
                <a
                  href={`tel:+91${inq.phone}`}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-bold uppercase tracking-wider text-[10px]"
                >
                  Call Client
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Client Inquiry"
        message="Are you sure you want to permanently delete this client inquiry log?"
        confirmText="Delete Inquiry"
        loading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
