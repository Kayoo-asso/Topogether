import { Quarkify, read } from "helpers/quarky";
import { Boulder, Entities, Image, Line, Sector, Topo, TopoDTO, Track, User } from "types";

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

    onTopoUpdate(topoQuark: Quarkify<Topo, Entities>) {
    }
    
    onSectorUpdate(sector: Quarkify<Sector, Entities>) {

    }

    onBoulderUpdate(boulder: Quarkify<Boulder, Entities>) {

    }

    onTrackUpdate(track: Quarkify<Track, Entities>) {

    }

    onLineUpdate(line: Quarkify<Line, Entities>) {

    }

    onUserUpdate(user: User) {

    }
}

export const apiService = new ApiService();