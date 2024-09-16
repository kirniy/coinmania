import { X } from 'lucide-react'
import { PropsWithChildren, useEffect } from "react"

export interface ModalProps extends PropsWithChildren {
    onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            e.stopPropagation();
        };
    
        const modalContent = document.querySelector('.bg-background');
        if (modalContent) {
            modalContent.addEventListener('touchmove' as any, handleTouchMove, { passive: false });
        }
    
        return () => {
            if (modalContent) {
                modalContent.removeEventListener('touchmove' as any, handleTouchMove);
            }
        };
    })
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 pt-0 backdrop-blur-[5px]"
      onClick={onClose}
      style={{zIndex: 200}}
    >
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm max-h-[90vh] scrollbar-hide overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={onClose}>
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
