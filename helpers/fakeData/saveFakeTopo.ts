import { api } from "helpers/services";
import { BoulderData, Description, Difficulty, Parking, Sector, SectorData, TopoAccess, TopoData, TopoType, TrackData } from "types";
import { v4 } from "uuid";
import { topoData } from "./fakeTopoV2";

export const saveFakeTopo = async () => {
    const session = api.user();
    const topo = topoData;

    if (session) {
        topo.creator = session;
        for (const boulder of topo.boulders) {
            for (const track of boulder.tracks) {
                track.creatorId = session?.id;
            }
        }
        const res = await api.saveTopo(topo);
    }
}

export const convertOldTopo = (t: any) => {
    const accesses: TopoAccess[] = [{
        id: v4(),
        difficulty: Difficulty.Good,
        duration: t.approachTime,
        steps: [{
            description: t.approachDescription,
            imagePath: undefined,
        }]
    }];

    const boulders: BoulderData[] = [];
    for (const s of t.sectors) {
        for (const b of s.boulders) {
            const newTracks: TrackData[] = [];
            let i = 0;
            for (const tr of b.tracks) {
                const newTr: TrackData = {
                    id: v4(),
                    hasMantle: tr.hasMantle,
                    isSittingStart: tr.isSittingStart,
                    isTraverse: tr.isTraverse,
                    mustSee: false,
                    index: i,
                    height: tr.height || undefined,
                    name: tr.name || undefined,
                    ratings: [],
                    lines: [],
                    creatorId: undefined,
                }
                i++;
            }
            const newB: BoulderData = {
                id: v4(),
                name: b.name,
                isHighball: b.isHighball,
                mustSee: b.isMustSee,
                location: [b.location.lat, b.location.lng],
                dangerousDescent: false,
                images: [],
                tracks: newTracks,
            }
            boulders.push(newB);
        }
    }

    const newTopo: TopoData = {
        id: v4(),
        name: t.name,
        altitude: t.altitude,
        closestCity: t.closestCity,
        location: [t.location.lat, t.location.lng],
        imagePath: t.imagePath,
        status: t.status,
        type: TopoType.Boulder,
        forbidden: false,

        // Date strings in ISO format
        // Convert into Date objects if needed
        modified: Date(),
        submitted: '',
        validated: '',
        // this one is about the physical spot
        cleaned: '',

        rockTypes: undefined,
        amenities: undefined,
        
        // these are optional, in case the profile has been deleted
        // (or the topo has not yet been validated)
        creator: undefined,
        validator: undefined,
        
        description: t.description as Description,
        faunaProtection: undefined,
        ethics: undefined,
        danger: t.dangerDescription as Description,
        otherAmenities: undefined,

        lonelyBoulders: [],

        sectors: [],
        boulders: boulders,
        waypoints: [],
        parkings: [],
        accesses: accesses,
        managers: []
    };

    return newTopo;
}