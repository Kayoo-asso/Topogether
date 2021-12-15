export type RequireKeys<T, Keys extends keyof T> =
    Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: T[K]
    }