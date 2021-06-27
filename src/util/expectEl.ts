export function expectEl<T extends HTMLElement = HTMLElement>(
    query: string,
    rootEl: Element | Document = document,
): T {
    const el = rootEl.querySelector<T>(query);

    if (!el) {
        throw new Error(`[expectEl] Can't find \`${query}\` element`);
    }

    return el;
}

export function expectEls<T extends HTMLElement = HTMLElement>(
    query: string,
    rootEl: Element | Document = document,
): T[] {
    const els = rootEl.querySelectorAll<T>(query);
    return Array.from(els);
}
