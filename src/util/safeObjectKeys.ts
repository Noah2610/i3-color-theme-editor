export type SafeObjectKeysFn = <
    O extends Record<K, unknown>,
    K extends keyof O,
>(
    o: O,
) => K[];

export const safeObjectKeys: SafeObjectKeysFn = Object.keys;
