import { popupBgStyle } from "@/constants/styles";
import { PopupType } from "@/types/popup";
import React, { use, useEffect } from "react";

export function Popup({ popup }: PopupType) {
  popup.duration = popup.duration || 2000;

  useEffect(() => {
    const timeout = setTimeout(() => {
      popup.setState([false, null]);
    }, popup.duration);

    return () => {      
      clearTimeout(timeout);
    };
  }, []);
  return (
    <div className="popup-active fixed w-[calc(100%-64px)] top-0 left-8 right-8 min-h-fit flex justify-center z-[150]">
      <div className="mt-2 p-2 flex gap-2 text-sm rounded-lg border border-yellow-500 relative">
        <div style={popupBgStyle}></div>
        {popup.pic === "info" && (
          <div className="w-5 h-5 flex justify-center shrink-0 items-center border-2 border-blue-400 rounded-full text-blue-400">
            i
          </div>
        )}
        {popup.pic === "attention" && (
          <div className="w-5 h-5 flex justify-center shrink-0 items-center border-2 border-yellow-500 rounded-full text-yellow-500">
            !
          </div>
        )}
        {popup.pic === "error" && (
          <div className="w-5 h-5 flex justify-center shrink-0 items-center border-2 border-red-600 rounded-full text-red-600">
            ✕
          </div>
        )}
        {popup.pic === "success" && (
          <div className="w-5 h-5 flex justify-center shrink-0 items-center border-2 border-green-500 rounded-full text-green-500">
            ✓
          </div>
        )}
        {popup.pic === "achivement" && <div>🏆</div>}
        <span className="text-white">{popup.text}</span>
      </div>
    </div>
  );
}
