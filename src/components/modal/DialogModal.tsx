import { ModalProps } from "./Modal"

export interface DialogModalProps extends ModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  confirmMessage: string;
  cancelMessage?: string;
}

export function DialogModal(props: DialogModalProps) {
  return (
    <div className="bg-gray-800/80 backdrop-blur-sm text-center p-1 rounded-2xl">
      <h3 className="text-yellow-500 text-xl font-bold mb-3">{props.title}</h3>
      <p className="text-white mb-4">{props.description}</p>
      <div className="space-y-2">
        <button
          onClick={props.onConfirm}
          className="w-full bg-yellow-500 text-gray-900 py-2 rounded-lg font-semibold"
        >
          {props.confirmMessage}
        </button>
        <button
          onClick={props.onClose}
          className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold"
        >
          {props.cancelMessage ?? "Нет"}
        </button>
      </div>
    </div>
  );
}
