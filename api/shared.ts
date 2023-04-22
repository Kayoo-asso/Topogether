import { User } from "@clerk/nextjs/api";
import { and, eq } from "drizzle-orm";
import { UUID } from "types";
import { contributors, db } from "~/db";

export interface ClerkMetadata {
	role?: "user" | "admin";
}

export async function topoRights(user: User, topoId: UUID) {
	// Need to force TypeScript's hand
	const metadata = user.publicMetadata as unknown as ClerkMetadata;
	if (metadata.role === "admin") {
		return "admin";
	}

	const roleQuery = db
		.select({
			role: contributors.role,
		})
		.from(contributors)
		.where(
			and(eq(contributors.userId, user.id), eq(contributors.topoId, topoId))
		);
}
