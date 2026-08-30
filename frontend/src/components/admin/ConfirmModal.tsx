import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Do you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-charcoal-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full shrink-0 ${
            isDestructive ? 'bg-rose-950/80 text-rose-500 border border-rose-800/50' : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-white leading-snug">{title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-5 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                : 'bg-gold-500 hover:bg-gold-400 text-charcoal-950 shadow-gold-500/20'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
