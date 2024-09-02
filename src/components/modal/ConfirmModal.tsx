import React from "react";
import { ModalProps } from "./Modal";
import { popupBgStyle } from "@/constants/styles";
import { DialogModalProps } from "./DialogModal";

interface ConfirmModalProps extends DialogModalProps {}

export function ConfirmModal(props: ConfirmModalProps) {
  return (
    <div className="mt-2 p-6 flex gap-2 text-sm rounded-lg border border-yellow-500 relative">
      <div className="mt-2 p-6 flex gap-2 text-sm rounded-lg border border-yellow-500 relative">
        <div style={popupBgStyle}></div>
        <h2>{props.title}</h2>
        <p>{props.description}</p>
        {props.children}
        <button onClick={props.onConfirm}>{props.confirmMessage ?? "Хорошо"}</button>
      </div>
    </div>
  );
}
