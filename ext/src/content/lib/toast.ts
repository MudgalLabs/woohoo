export interface ToastPayload {
    message: string;
    href?: string;
}

const EVENT_NAME = "woohoo:toast";

export function emitToast(payload: ToastPayload): void {
    window.dispatchEvent(new CustomEvent<ToastPayload>(EVENT_NAME, { detail: payload }));
}

export function onToast(cb: (payload: ToastPayload) => void): () => void {
    const listener = (e: Event) => {
        const detail = (e as CustomEvent<ToastPayload>).detail;
        if (detail) cb(detail);
    };
    window.addEventListener(EVENT_NAME, listener);
    return () => window.removeEventListener(EVENT_NAME, listener);
}
