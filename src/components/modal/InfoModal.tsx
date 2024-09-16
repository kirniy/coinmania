import { popupBgStyle } from "@/constants/styles"
import { ModalProps } from "./Modal"

interface InfoModalProps extends ModalProps {}

export function InfoModal(props: InfoModalProps) {
  return (
    <div className="mt-2 p-1 flex gap-2 text-sm rounded-lg relative">
      <div style={popupBgStyle}></div>
      {props.children}
    </div>
  );
}
