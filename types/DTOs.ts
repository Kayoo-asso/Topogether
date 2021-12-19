import { Line, Track } from "./Topo";
import { UUID } from "./UUID";

export type DTO<T, Refs extends keyof T, Ids extends string> = Omit<T, Refs> & {
    [K in Ids]: UUID
};

export type LineDTO = Line & {
    trackId: UUID
};

export type TrackDTO = Omit<Track, 'lines' | 'creator' | 'ratings'> & {
    sectorId: UUID,
    creatorId: UUID
};