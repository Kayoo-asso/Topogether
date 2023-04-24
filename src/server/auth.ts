import { User } from "@clerk/nextjs/api";
import { Img } from "~/types";

export interface ClerkMetadata {
	role: "user" | "admin";
	country?: string;
	city?: string;
	image?: Img;
}
export function getAuthMetadata(user: {
	publicMetadata?: Record<string, any>;
}): ClerkMetadata;
export function getAuthMetadata(
	user: { publicMetadata?: Record<string, any> } | null | undefined
): ClerkMetadata | undefined;
export function getAuthMetadata(
	user: { publicMetadata?: Record<string, any> } | null | undefined
) {
	if (!user || !user.publicMetadata) {
		return undefined;
	}
	return user.publicMetadata as ClerkMetadata;
}
