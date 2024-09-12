import { X } from 'lucide-react'
import { ConfirmModal } from "./ConfirmModal"
import { DialogModal } from "./DialogModal"
import { InfoModal } from "./InfoModal"
import { ModalProps } from "./Modal"

interface InnerModalProps extends ModalProps {
  type: "info" | "confirm" | "dialog";
  description?: string | null;
  onConfirm?: () => void;
  title?: string;
  confirmMessage?: string;
  cancelMessage?: string;
}

export function InnerModal(props: InnerModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={props.onClose} style={{zIndex: 300}}>
    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm max-h-[70vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
      <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={props.onClose}>
        <X size={24} />
      </button>
      {props.type === "info" && (
          <InfoModal onClose={props.onClose}>{props.children}</InfoModal>
        )}
        {props.type === "confirm" && (
          <ConfirmModal
            onClose={props.onClose}
            description={props.description ?? ""}
            onConfirm={props.onConfirm ? props.onConfirm : props.onClose}
            title={props.title ?? ""}
            confirmMessage={props.confirmMessage ?? "Понятно"}
          >
            {props.children}
          </ConfirmModal>
        )}
        {props.type === "dialog" && (
          <DialogModal
            onClose={props.onClose}
            description={props.description ?? ""}
            onConfirm={props.onConfirm ? props.onConfirm : props.onClose}
            title={props.title ?? ""}
            confirmMessage={props.confirmMessage ?? "Да"}
            cancelMessage={props.cancelMessage ?? "Нет"}
          >
            {props.children}
          </DialogModal>
        )}
    </div>
  </div>
    
  );
}
