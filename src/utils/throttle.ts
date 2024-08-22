export function throttle<T extends (...args: any[]) => void>(func: T, delay: number) {
    let lastCall = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
        const now = Date.now();

        if (lastCall && now < lastCall + delay) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastCall = now;
                func.apply(this, args);
            }, delay - (now - lastCall));
        } else {
            lastCall = now;
            func.apply(this, args);
        }
    };
}
