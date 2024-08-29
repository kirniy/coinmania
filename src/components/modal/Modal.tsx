import React, { PropsWithChildren, useEffect } from "react";

interface ModalProps extends PropsWithChildren {
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
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-black bg-opacity-80 modal_window">
        <div className="relative left-[50%] top-[43%] translate-x-[-50%] translate-y-[-50%] px-4">
            <div className="fixed right-6 -top-6">
                <button className="" onClick={onClose}>✕</button>
            </div>
            <div style={{zIndex: 100}} className="bg-background w-full gap-4 mx-auto p-6 shadow-lg duration-200 sm:rounded-lg bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-500 text-white max-w-[23rem] max-h-[75vh] overflow-y-scroll scrollbar-hide flex flex-col rounded-2xl">
                {children}
            </div>
        </div>
    </div>
  );
}
