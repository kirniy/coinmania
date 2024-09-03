import { PropsWithChildren } from "react";

export interface PopupProps extends PropsWithChildren {
    text: string;
    pic: "info" | "attention" | "error" | "success" | "achivement" | "";
    type?: "modal" | "popup";
}

export type PopupType = {
    popup: PopupProps;
}

export interface ShowPopupProps {
    state: [boolean, null | NodeJS.Timeout];
    setState: React.Dispatch<React.SetStateAction<[boolean, null | NodeJS.Timeout]>>;
    duration?: number;
}