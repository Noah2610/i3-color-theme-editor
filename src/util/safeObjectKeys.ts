export type SafeObjectKeysFn = <
    O extends Record<K, unknown> | Partial<Record<K, unknown>>,
    K extends keyof O,
>(
    o: O,
) => (keyof typeof o)[];

export const safeObjectKeys: SafeObjectKeysFn = Object.keys;
