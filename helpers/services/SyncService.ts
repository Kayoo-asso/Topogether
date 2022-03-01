import { LineDTO, TrackDTO, UUID } from "types";
 
export class SyncService {


    updatedTracks: Map<UUID, TrackDTO> = new Map();
    deletedTracks: Set<UUID> = new Set();

    updatedLines: Map<UUID, LineDTO> = new Map();
    deletedLines: Set<UUID> = new Set();

    onTrackAdd(track: TrackDTO) {
        this.deletedTracks.delete(track.id);
        this.updatedTracks.set(track.id, track);
    }
}


