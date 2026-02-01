'use client'

import { useEffect } from 'react';

interface SimpleModalProps {
    isOpen: boolean;
    title: string,
    description: string,
    confirmBtnText: string,
    cancelBtnText: string,
    onConfirm: () => void
    onClose: () => void
}

export function SimpleModal({ isOpen, title, description, confirmBtnText, cancelBtnText, onConfirm, onClose }: SimpleModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      // Re-enable scrolling when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-8 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        <div className="flex flex-1 flex-col gap-y-4">
            <h2 className="text-gray-800 text-2xl font-bold">{title}</h2>
            <p className="text-gray-900">{description}</p>
            <div className="flex flex-row justify-center gap-x-16 mt-8">
                <button 
                className="bg-blue-400 rounded-2xl px-6 py-4 text-shadow-neutral-200 font-medium"
                onClick={()=>onConfirm()}
                >{confirmBtnText}
                </button>
                
                <button 
                className="bg-gray-400 rounded-2xl px-6 py-4 text-shadow-neutral-200 font-medium"
                onClick={()=>onClose()}
                >{cancelBtnText}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}