export type UUID = string & {
    readonly _phantom: unique symbol
};