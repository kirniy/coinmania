
export interface PopupProps {
    text: string;
    pic: "info" | "attention" | "error" | "success" | "achivement" | "";
    type?: "modal" | "popup";
}

export type PopupType = {
    popup: PopupProps;
}