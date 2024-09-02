import { popupBgStyle } from "@/constants/styles";
import React from "react";
import { InfoModal } from "./InfoModal";
import { DialogModal } from "./DialogModal";
import { ModalProps } from "./Modal";
import { ConfirmModal } from "./ConfirmModal";

interface InnerModalProps extends ModalProps {
  type: "info" | "confirm" | "dialog";
  description?: string;
  onConfirm?: () => void;
  title?: string;
  confirmMessage?: string;
  cancelMessage?: string;
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
        <InfoModal onClose={props.onClose}>{props.children}</InfoModal>
      )}
      {props.type === "confirm" && (
        <ConfirmModal
          onClose={props.onClose}
          description={props.description ?? ""}
          onConfirm={props.onConfirm ? props.onConfirm : () => {}}
          title={props.title ?? ""}
          confirmMessage={props.confirmMessage ?? "Да"}
          cancelMessage={props.cancelMessage ?? "Нет"}
        >
          {props.children}
        </ConfirmModal>
      )}
      {props.type === "dialog" && (
        <DialogModal
          onClose={props.onClose}
          description={props.description ?? ""}
          onConfirm={props.onConfirm ? props.onConfirm : () => {}}
          title={props.title ?? ""}
          confirmMessage={props.confirmMessage ?? "Да"}
          cancelMessage={props.cancelMessage ?? "Нет"}
        >
          {props.children}
        </DialogModal>
      )}
    </div>
    // </div>
  );
}
