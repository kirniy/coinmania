import { popupBgStyle } from "@/constants/styles";
import React from "react";

interface InnerModalProps extends React.PropsWithChildren {
  type: "info" | "confirm" | "dialog";
  onClose: () => void;
}

export function InnerModal(props: InnerModalProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black/80 px-10">
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> */}
      <div className="w-full flex justify-end">
        <button className="" onClick={props.onClose}>
          ✕
        </button>
      </div>
      {props.type === "info" && (
        <div className="mt-2 p-6 flex gap-2 text-sm rounded-md border border-orange-400 relative">
          <div style={popupBgStyle}></div>
          {props.children}
        </div>
      )}
      {props.type === "confirm" && (
        <div className="mt-2 p-2 flex gap-2 text-sm rounded-md border border-orange-400 relative">
          <div style={popupBgStyle}></div>
          {props.children}
        </div>
      )}
      {props.type === "dialog" && (
        <div className="mt-2 p-2 flex gap-2 text-sm rounded-md border border-orange-400 relative">
          <div style={popupBgStyle}></div>
          {props.children}
        </div>
      )}
    </div>
    // </div>
  );
}
