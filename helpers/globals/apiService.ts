import { Quarkify, read } from "helpers/quarky";
import { BoulderData, Entities, Image, Line, SectorData, TopoData, TopoDTO, TrackData, User } from "types";

export interface IApiService {
    uploadImage(file: File): Image;
}

class ApiService implements IApiService {
    ignoreUpdates: boolean;

    constructor() {
        this.ignoreUpdates = false;
    }

    dryRun(work: () => void) {
        this.ignoreUpdates = true;
        work();
        this.ignoreUpdates = false;
    }

    uploadImage(file: File): Image {
        throw new Error("Method not implemented.");
    }

    onTopoUpdate(topoQuark: Quarkify<TopoData, Entities>) {
    }
    
    onSectorUpdate(sector: Quarkify<SectorData, Entities>) {

    }

    onBoulderUpdate(boulder: Quarkify<BoulderData, Entities>) {

    }

    onTrackUpdate(track: Quarkify<TrackData, Entities>) {

    }

    onLineUpdate(line: Quarkify<Line, Entities>) {

    }

    onUserUpdate(user: User) {

    }
}

export const apiService = new ApiService();