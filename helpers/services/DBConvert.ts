import { Amenities, Boulder, BoulderData, Image, DBBoulder, DBLine, DBManager, DBParking, DBSector, DBTopo, DBTopoAccess, DBTrack, DBUserUpdate, DBWaypoint, LightTopo, Line, LinearRing, LineCoords, LineString, Manager, MultiLineString, Parking, Point, PolygonCoords, Position, RockTypes, Sector, SectorData, Topo, TopoAccess, TopoData, TopoType, Track, TrackData, User, UUID, Waypoint, ClimbTechniques } from "types";

// IMPORTANT: perform all conversions by explicitly assigning all properties.
// DO NOT destructure one of the input arguments into the result
// The inputs may contain additional properties, that are not specified by their type.
// This WILL result in a database error when trying to insert / update
// with additional properties.

const toPointNullable = (p?: Position): Point | null =>
    p ? toPoint(p) : null;

const toPoint = (p: Position): Point => ({
    type: "Point",
    coordinates: p
});

const toLineString = (l: Position[]): LineString => {
    // if (l.length < 2) throw new Error("Error: found a LineString with <2 points");
    return {
        type: "LineString",
        coordinates: l as LineCoords
    }
}

const toMultiLineString = (l?: Position[][]): MultiLineString | null => {
    if (!l) return null;
    l.forEach(x => {
        if (x.length < 2) {
            throw new Error("Error: found a line within a MultiLineString with less than 2 points")
        }
    });
    return {
        type: "MultiLineString",
        coordinates: l as LineCoords[]
    };
}

// TODO: better validation of spatial types 
export class DBConvert {
    static user(user: User): DBUserUpdate {
        return {
            id: user.id,
            userName: user.userName,
            firstName: user.firstName ?? null,
            lastName: user.lastName ?? null,
            country: user.country ?? null,
            city: user.city ?? null,
            phone: user.phone ?? null,
            birthDate: user.birthDate ?? null,
            image: user.image ?? null,
        }
    }

    static line(line: Line, topoId: UUID, trackId: UUID): DBLine {
        const result: DBLine = {
            id: line.id,
            index: line.index,
            points: line.points,
            topoId,
            trackId,
            imageId: line.imageId,
            forbidden: null,
            hand1: null,
            hand2: null,
            foot1: null,
            foot2: null
        };
        result.forbidden = toMultiLineString(line.forbidden);
        result.hand1 = toPointNullable(line.hand1);
        result.hand2 = toPointNullable(line.hand2);
        result.foot1 = toPointNullable(line.foot1);
        result.foot2 = toPointNullable(line.foot2);
        return result;
    }

    static track(track: Track | TrackData, topoId: UUID, boulderId: UUID): DBTrack {
        return {
            id: track.id,
            index: track.index,

            name: track.name ?? null,
            description: track.description ?? null,
            height: track.height ?? null,
            grade: track.grade ?? null,
            orientation: track.orientation ?? null,
            reception: track.reception ?? null,
            anchors: track.anchors ?? null,
            techniques: track.techniques ?? ClimbTechniques.None,

            isTraverse: track.isTraverse,
            isSittingStart: track.isSittingStart,
            mustSee: track.mustSee,
            hasMantle: track.hasMantle,

            topoId,
            boulderId,
            creatorId: track.creatorId ?? null
        }
    }

    static boulder(boulder: Boulder | BoulderData, topoId: UUID): DBBoulder {
        return {
            id: boulder.id,
            location: toPoint(boulder.location),
            name: boulder.name,
            isHighball: boulder.isHighball,
            mustSee: boulder.mustSee,
            dangerousDescent: boulder.dangerousDescent,
            images: boulder.images,
            topoId
        };
    }

    // TODO: better validation of sector.path?
    // Or let the DB take care of it
    static sector(sector: Sector | SectorData, topoId: UUID): DBSector {
        return {
            id: sector.id,
            index: sector.index,
            name: sector.name,
            path: toLineString(sector.path),
            boulders: sector.boulders,
            topoId,
        };
    }

    static parking(parking: Parking, topoId: UUID): DBParking {
        return {
            id: parking.id,
            name: parking.name ?? null,
            spaces: parking.spaces,
            location: toPoint(parking.location),
            description: parking.description ?? null,
            image: parking.image ?? null,
            topoId
        };
    }
    
    static waypoint(waypoint: Waypoint, topoId: UUID): DBWaypoint {
        return {
            id: waypoint.id,
            name: waypoint.name,
            location: toPoint(waypoint.location),
            description: waypoint.description ?? null,
            image: waypoint.image ?? null,
            topoId,
        };
    }

    static manager(manager: Manager, topoId: UUID): DBManager {
        return {
            id: manager.id,
            name: manager.name,
            contactName: manager.contactName,
            contactMail: manager.contactMail ?? null,
            contactPhone: manager.contactPhone ?? null,
            description: manager.description ?? null,
            address: manager.address ?? null,
            zip: manager.zip ?? null,
            city: manager.city ?? null,
            image: manager.image ?? null,
            topoId
        };
    }

    static topoAccess(access: TopoAccess, topoId: UUID): DBTopoAccess {
        return {
            id: access.id,
            danger: access.danger ?? null,
            difficulty: access.difficulty ?? null,
            duration: access.duration ?? null,
            steps: access.steps ?? [],
            topoId
        }
    }

    static topo(topo: Topo| TopoData): DBTopo {
        return {
            id: topo.id,
            name: topo.name,
            status: topo.status,
            location: toPoint(topo.location),
            forbidden: topo.forbidden,

            modified: topo.modified,
            submitted: topo.submitted ?? null,
            validated: topo.validated ?? null,
            cleaned: topo.cleaned ?? null,

            amenities: topo.amenities ?? Amenities.None,
            rockTypes: topo.rockTypes ?? RockTypes.None,

            type: topo.type ?? null,
            description: topo.description ?? null,
            faunaProtection: topo.faunaProtection ?? null,
            ethics: topo.ethics ?? null,
            danger: topo.danger ?? null,
            altitude: topo.altitude ?? null,
            closestCity: topo.closestCity ?? null,
            otherAmenities: topo.otherAmenities ?? null,

            lonelyBoulders: topo.lonelyBoulders,
            
            // TODO: is this behavior correct?
            creatorId: topo.creator?.id ?? null,
            validatorId: topo.validator?.id ?? null,
            image: topo.image ?? null,
        };
    }
}