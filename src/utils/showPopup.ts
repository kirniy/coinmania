import { ShowPopupProps } from "@/types/popup";

export function showPopup({state, setState, duration = 2000}: ShowPopupProps) {
    // Очищаем таймаут если предыдущий не закончился
    if(state[1] !== null) {
        clearTimeout(state[1])
    }
    // Запускаем новый таймаут
    const timeout = setTimeout(() => {
        setState([false, null])
    }, duration);
    
    // Показываем попап
    setState([true, timeout])
}