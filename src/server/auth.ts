import { User } from "@clerk/nextjs/api";
import { Img } from "types";

export interface ClerkMetadata {
	role: "user" | "admin";
	image?: Img;
}

export function getAuthMetadata(
	user: { publicMetadata?: Record<string, any> } | null | undefined
) {
	if (!user || !user.publicMetadata) {
		return undefined;
	}
	return user.publicMetadata as ClerkMetadata;
}
