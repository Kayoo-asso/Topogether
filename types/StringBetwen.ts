export type StringBetween<Min extends number, Max extends number> = string & {
    readonly _phantom: unique symbol
};

export function isStringBetween<Min extends number, Max extends number>(
    s: string,
    min: Min,
    max: Max
): s is StringBetween<Min, Max> {
    return min <= s.length && s.length < max;
}

export function stringBetween<Min extends number, Max extends number>(
    s: string,
    min: Min,
    max: Max
): StringBetween<Min, Max> | null {
    if (isStringBetween(s, min, max)) {
        return s;
    }
    return null;
}