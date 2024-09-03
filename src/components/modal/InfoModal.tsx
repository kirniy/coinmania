import { popupBgStyle } from "@/constants/styles";
import React from "react";
import { ModalProps } from "./Modal";

interface InfoModalProps extends ModalProps {}

export function InfoModal(props: InfoModalProps) {
  return (
    <div className="mt-2 p-6 flex gap-2 text-sm rounded-lg border border-yellow-500 relative">
      <div style={popupBgStyle}></div>
      {props.children}
    </div>
  );
}
