let activeId: string | null = null;

const listeners = new Set<(id: string | null) => void>();

export function setActive(id: string | null) {
    activeId = id;
    listeners.forEach((l) => l(activeId));
}

export function subscribe(listener: (id: string | null) => void) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

export function getActive() {
    return activeId;
}
