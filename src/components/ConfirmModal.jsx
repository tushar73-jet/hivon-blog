'use client';
import { useEffect } from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-red-500/20",
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20",
    warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <h3 className="text-xl font-black text-gray-950 dark:text-gray-50 mb-3 tracking-tighter">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 text-sm font-black rounded-xl transition-all shadow-lg active:scale-95 ${typeConfig[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
