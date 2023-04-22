import Y from "yjs";
import { proxy, useSnapshot } from "valtio";
import { bind } from "valtio-yjs";
import {
	topos,
	waypoints,
	managers,
	topoAccesses,
	sectors,
	rocks,
	tracks,
	trackVariants,
	lines,
} from "~/db";
import { InferModel } from "drizzle-orm";
import { UUID } from "types";
