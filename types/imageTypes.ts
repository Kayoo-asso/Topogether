import { NumberBetween } from "./numberBetween"

export type imageBeforeServer = {
    name: string,
    type: "image/png" | "image/jpg" | "image/jpeg",
    size: NumberBetween<0, 10000000>,
    content: string,
}

export type image = {
    id: number,
    url: string,
}