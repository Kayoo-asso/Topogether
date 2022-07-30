import { UUID } from "types";

export type Img = {
	readonly id: UUID;
	readonly ratio: number;
	readonly placeholder?: string;
};
