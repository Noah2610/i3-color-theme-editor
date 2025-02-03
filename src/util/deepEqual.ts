/* https://medium.com/@pancemarko/deep-equality-in-javascript-determining-if-two-objects-are-equal-bf98cf47e934 */
export function deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;

        return obj1.every((elem, index) => {
            return deepEqual(elem, obj2[index]);
        });
    }

    if (
        typeof obj1 === "object" &&
        typeof obj2 === "object" &&
        obj1 !== null &&
        obj2 !== null
    ) {
        if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

        const keys1 = Object.keys(obj1);
        const keys2 = new Set(Object.keys(obj2));

        if (
            keys1.length !== keys2.size ||
            !keys1.every((key) => keys2.has(key))
        ) {
            return false;
        }

        for (const key in obj1) {
            const isEqual = deepEqual(obj1[key], obj2[key]);
            if (!isEqual) {
                return false;
            }
        }

        return true;
    }

    return false;
}
