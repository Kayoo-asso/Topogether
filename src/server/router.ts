import {
	db,
	topos as toposTable,
	sectors as sectorsTable,
	managers as managersTable,
	waypoints as waypointsTable,
	parkings as parkingsTable,
	topoAccesses as accessesTable,
	rocks as rocksTable,
	tracks as tracksTable,
	lines as linesTable,
	trackVariants as variantsTable,
	contributors as contributorsTable,
	topoLikes as topoLikesTable,
	rockLikes as rockLikesTable,
	count,
	countDistinct,
} from "~/db";
import { z } from "zod";
import { InferModel, and, eq, sql } from "drizzle-orm";
import { UUID } from "~/types";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "./trpc";
import { getLightTopos, getTopo } from "./queries";
import { User, clerkClient } from "@clerk/nextjs/api";
import { getAuthMetadata } from "./auth";

export const appRouter = createTRPCRouter({
	getTopo: publicProcedure.input(z.string().uuid()).query(({ input, ctx }) => {
		return getTopo(input as UUID, ctx.user?.id as UUID | undefined);
	}),

	// Protected procedure: need to be logged in to delete a topo
	deleteTopo: protectedProcedure
		.input(z.string().uuid())
		.mutation(async ({ input, ctx }) => {
			const topoId = input as UUID;
			const userId = ctx.user.id as UUID;
			const roleQuery = await db
				.select({
					role: contributorsTable.role,
				})
				.from(contributorsTable)
				.where(
					and(
						eq(contributorsTable.topoId, topoId),
						eq(contributorsTable.userId, userId)
					)
				);
			// The user is not a contributor of this topo
			if (roleQuery.length === 0) {
				return;
			}
			const role = roleQuery[0].role;
			// The user needs to be an admin for this topo
			if (role !== "ADMIN") {
				return;
			}
			return db
				.update(toposTable)
				.set({ trashed: true })
				.where(eq(toposTable.id, topoId));
		}),

	// Need to be logged in to modify a tpo
	setTopoStatus: protectedProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				status: z.enum(["draft", "submitted", "validated"]),
			})
		)
		.mutation(({ input }) => {}),

	getLightTopos: publicProcedure
		.input(
			z.object({
				status: z.union([
					z.literal("validated"),
					z.literal("submitted"),
					z.literal("draft"),
				]),
			})
		)
		.query(({ input }) => getLightTopos(input)),

	getTopoLikes: protectedProcedure
		.input(z.string().uuid())
		.query(async ({ input }) => {
			const userId = input as UUID;
			return db
				.select({
					topoId: topoLikesTable.topoId,
				})
				.from(topoLikesTable)
				.where(eq(topoLikesTable.userId, userId));
		}),

	getProfile: publicProcedure
		.input(z.string().uuid())
		.query(async ({ input }) => {
			const user = await clerkClient.users.getUser(input);
			const meta = getAuthMetadata(user);

			return {
				id: user.id,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				created: user.createdAt,
				image: meta.image,
				role: meta.role,
				country: meta.country,
				city: meta.city,
			};
		}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
