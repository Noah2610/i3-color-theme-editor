import { RecursivePartial } from "./recursivePartial";

type Dict = Record<string, unknown>;

export function merge<O extends object>(
    objA: RecursivePartial<O>,
    objB: RecursivePartial<O>,
): O {
    const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

    const merged = {} as Dict;

    for (const key of allKeys) {
        const a = (objA as Dict)[key];
        const b = (objB as Dict)[key];
        merged[key] = aOrB(a, b);
    }

    return merged as O;
}

function aOrB(a: unknown, b: unknown): unknown {
    const aIsObject = typeof a === "object";
    const bIsObject = typeof b === "object";

    if (a && b && aIsObject && bIsObject) {
        return merge(a as Dict, b as Dict);
    }

    if (b && bIsObject) {
        return b;
    }

    if (a && aIsObject) {
        return a;
    }

    return b ?? a;
}
