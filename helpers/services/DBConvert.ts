import { Amenities, Boulder, BoulderData, BoulderImage, DBBoulder, DBBoulderImage, DBLine, DBManager, DBParking, DBSector, DBTopo, DBTopoAccess, DBTrack, DBWaypoint, Line, LinearRing, LineCoords, Manager, Parking, PolygonCoords, Position, RockTypes, Sector, SectorData, Topo, TopoAccess, TopoData, TopoType, Track, TrackData, UUID, Waypoint, WaypointDTO } from "types";

// IMPORTANT: perform all conversions by explicitly assigning all properties.
// DO NOT destructure one of the input arguments into the result
// The inputs may contain additional properties, that are not specified by their type.
// This WILL result in a database error when trying to insert / update
// with additional properties.


// TODO: better validation of spatial types 
export class DBConvert {
    static line(line: Line, topoId: UUID, trackId: UUID): DBLine {
        const result: DBLine = {
            id: line.id,
            index: line.index,
            points: {
                type: "LineString",
                coordinates: line.points as LineCoords
            },
            topoId,
            trackId,
            imageId: line.imageId
        }
        if (line.forbidden) {
            result.forbidden = {
                type: "MultiLineString",
                coordinates: line.forbidden as LineCoords[],
            }
        }
        if (line.handDepartures) {
            result.hand1 = {
                type: "Point",
                coordinates: line.handDepartures[0]
            };
            result.hand2 = {
                type: "Point",
                coordinates: line.handDepartures[1]
            }
        }
        if (line.feetDepartures) {
            result.foot1 = {
                type: "Point",
                coordinates: line.feetDepartures[0]
            };
            result.foot2 = {
                type: "Point",
                coordinates: line.feetDepartures[1]
            };
        }

        return result;
    }

    static track(track: Track, topoId: UUID, boulderId: UUID): DBTrack {
        return {
            id: track.id,
            index: track.index,

            name: track.name,
            description: track.description,
            height: track.height,
            grade: track.grade,
            orientation: track.orientation,
            reception: track.reception,
            anchors: track.anchors,
            techniques: track.techniques,

            isTraverse: track.isTraverse,
            isSittingStart: track.isSittingStart,
            mustSee: track.mustSee,
            hasMantle: track.hasMantle,

            topoId,
            boulderId,
            creatorId: track.creatorId
        }
    }

    static boulder(boulder: Boulder, topoId: UUID): DBBoulder {
        return {
            id: boulder.id,
            location: {
                type: "Point",
                coordinates: boulder.location
            },
            name: boulder.name,
            isHighball: boulder.isHighball,
            mustSee: boulder.mustSee,
            dangerousDescent: boulder.dangerousDescent,
            topoId
        };
    }

    static boulderImage(img: BoulderImage, topoId: UUID): DBBoulderImage {
        return {
            id: img.id,
            url: img.url,
            width: img.width,
            height: img.height,
            topoId
        };
    }

    // TODO: better validation of sector.path?
    // Or let the DB take care of it
    static sector(sector: Sector, topoId: UUID): DBSector {
        return {
            id: sector.id,
            name: sector.name,
            path: {
                type: "LineString",
                coordinates: sector.path as LineCoords
            },
            topoId,
        };
    }

    static parking(parking: Parking, topoId: UUID): DBParking {
        return {
            id: parking.id,
            spaces: parking.spaces,
            location: {
                type: "Point",
                coordinates: parking.location
            },
            description: parking.description,
            imageUrl: parking.imageUrl,
            topoId
        };
    }
    
    static waypoint(waypoint: Waypoint, topoId: UUID): DBWaypoint {
        return {
            id: waypoint.id,
            name: waypoint.name,
            location: {
                type: "Point",
                coordinates: waypoint.location
            },
            description: waypoint.description,
            imageUrl: waypoint.imageUrl,
            topoId,
        };
    }

    static manager(manager: Manager, topoId: UUID): DBManager {
        return {
            id: manager.id,
            name: manager.name,
            contactName: manager.contactName,
            contactMail: manager.contactMail,
            contactPhone: manager.contactPhone,
            description: manager.description,
            address: manager.adress,
            zip: manager.zip,
            city: manager.city,
            imageUrl: manager.imageUrl,
            topoId
        };
    }

    static topoAccess(access: TopoAccess, topoId: UUID): DBTopoAccess {
        return {
            id: access.id,
            danger: access.danger,
            difficulty: access.difficulty,
            duration: access.duration,
            steps: access.steps ?? [],
            topoId
        }
    }

    static topo(topo: Topo): DBTopo {
        return {
            id: topo.id,
            name: topo.name,
            status: topo.status,
            location: {
                type: "Point",
                coordinates: topo.location
            },
            forbidden: topo.forbidden,

            modified: topo.modified,
            submitted: topo.submitted,
            validated: topo.validated,
            cleaned: topo.cleaned,

            amenities: topo.amenities ?? Amenities.None,
            rockTypes: topo.rockTypes ?? RockTypes.None,

            type: topo.type,
            description: topo.description,
            faunaProtection: topo.faunaProtection,
            ethics: topo.ethics,
            danger: topo.danger,
            altitude: topo.altitude,
            otherAmenities: topo.otherAmenities,

            lonelyBoulders: topo.lonelyBoulders,

            imageUrl: topo.imageUrl,

            creatorId: topo.creator?.id,
            validatorId: topo.validator?.id
        };
    }
}