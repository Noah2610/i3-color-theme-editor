export function expectEl<T extends HTMLElement = HTMLElement>(
    query: string,
): T {
    const el = document.querySelector<T>(query);

    if (!el) {
        throw new Error(`[findEl] Can't find \`${query}\` element`);
    }

    return el;
}
