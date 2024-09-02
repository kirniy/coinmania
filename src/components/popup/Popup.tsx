import { PopupType } from "@/types/popup";
import React from "react";

const popupBgStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  "background-color": "rgba(255, 255, 255, 0.1)",
  "backdrop-filter": "blur(10px)",
  "-webkit-backdrop-filter": "blur(10px)",
};

export function Popup({ popup }: PopupType) {
  return (
    <div className="fixed w-[calc(100%-64px)] top-0 left-8 right-8 min-h-fit flex justify-center z-50">
      <div className="mt-2 p-2 flex gap-2 text-sm rounded-md border border-orange-400 relative">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            zIndex: -1
          }}
        ></div>
        {popup.pic === "info" && (
          <div className="w-5 h-5 flex justify-center shrink-0 items-center border-2 border-blue-400 rounded-full text-blue-400">
            i
          </div>
        )}
        {popup.pic === "attention" && (
          <div className="w-5 h-5 flex justify-center shrink-0 items-center border-2 border-orange-500 rounded-full text-orange-500">
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
