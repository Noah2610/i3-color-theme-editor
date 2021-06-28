export interface Unsubs {
    add(fn: () => void): void;
    unsubAll(): void;
    fns: (() => void)[];
}

export function createUnsubs(): Unsubs {
    const fns: Unsubs["fns"] = [];

    return {
        add(fn) {
            fns.push(fn);
        },
        unsubAll() {
            fns.forEach((unsub) => unsub());
        },
        fns,
    };
}
