import { Quark } from 'helpers/quarky';
import { BoulderData, Line, Name, Image, TrackData, Description, Difficulty, ClimbTechniques, SectorData, TopoData, Amenities, TopoStatus, TopoType, RockTypes, TopoAccess, Topo, Parking, StringBetween } from 'types';
import { v4 as uuid, v4 } from 'uuid';
import { quarkifyTopo } from './quarkifyTopo';

export const images: Image[] = [
    // Topo image
    {
        id: uuid(),
        url: "https://builder.topogether.com/public/uploads/topo/main-image/dad449499de38f1bdee5872de1a354d52fff6183.jpeg",
        width: 4592,
        height: 3064,
    },
    // Boulder 0 image
    {
        id: uuid(),
        url: "https://builder.topogether.com/public/uploads/boulder/image/5b558375709fbbacae9e5dcb746c8e10e7fa083f.jpeg",
        width: 4592,
        height: 3064,
        // boulderImageDimensions = 674x450 in the original fakeTopo
        // multiply every line coordinate by 4592 / 674 to scale the data
    },
    // Parking 0 image
    {
        id: uuid(),
        url: 'https://builder.topogether.com/public/uploads/parking/image/f1e65106ded2f0aafa14f1e6208a13178aae28b5.png',
        width: 1082,
        height: 476,
    }
]

// TODO: create proper users and load them into quarks
const topoCreatorId = uuid();
const contributorId = uuid();
const validatorId = uuid();

export const lines: Line[] = [
    // Line 0, track 0
    {
        id: uuid(),
        imageId: images[1].id,
        points: [
            [2044, 1948],
            [2125, 770],
            [1764, 55],
            [1717, 1349],
            [2269, 1200]
        ],
        forbidden: null,
        handDepartures: [
            [1050, 620],
        ],
        feetDepartures: null,
    },
    // Line 1, track 1
    {
        id: uuid(),
        imageId: images[1].id,
        points: [
            [2207, 1942],
            [2262, 787],
            [1901, 51]
        ],
        forbidden: [{
            0: [1200, 50],
            1: [1650, 50],
            2: [1650, 400],
            3: [1200, 400],
        }],
        handDepartures: null,
        feetDepartures: [
            [600, 250],
        ],
    }
]

export const tracks: TrackData[] = [
    // Track 0, boulder 0
    {
        id: uuid(),
        orderIndex: 0,
        name: "Passage 1" as Name,
        grade: "4+",
        reception: Difficulty.OK,
        techniques: ClimbTechniques.Adherence,
        description: "Une petite montée facile" as Description,

        lines: [lines[0]],
        ratings: [],
        creatorId: topoCreatorId,
    },
    // Track 1, boulder 0
    {
        id: uuid(),
        orderIndex: 1,
        name: "Passage 2" as Name,
        description: "Le départ assis est sévère mais le reste de la voie est trivial" as Description,
        height: 2,
        grade: "6a",
        reception: Difficulty.OK,
        // -> Bitflag example
        techniques: ClimbTechniques.Adherence | ClimbTechniques.Pince,
        isSittingStart: true,

        lines: [lines[1]],
        ratings: [],
        creatorId: topoCreatorId,
    },
]

export const boulders: BoulderData[] = [
    {
        id: uuid(),
        name: "PearlHarbor" as Name,
        location: {
            lat: 45.70201,
            lng: 4.605412,
        },
        isHighball: true,
        mustSee: false,
        descent: Difficulty.Dangerous,
        orderIndex: 0,
        images: [images[1]],
        tracks
    }
]

export const sectors: SectorData[] = [
    {
        id: uuid(),
        name: "ABO" as Name,
        boulders,
        waypoints: [
            {
                id: uuid(),
                name: 'Pont de pierre' as Name,
                location: {
                    lat: 45.70256,
                    lng: 4.605462,
                },
            }
        ]
    }
]

export const access: TopoAccess = {
    id: uuid(),
    duration: 15,
    difficulty: Difficulty.OK,
    steps: [
        {
            description: "Depuis le parking, prendre le sentier qui monte dans la continuité de la route. Après 12-15min de marche, vous arriverez à une esplanade d'herbe surmontant une petite falaise (où il est possible de faire de l'initiation). Un panneau indique le site d'escalade à l'entrée de l'esplanade.\nDepuis l'esplanade, prendre le sentier qui part derrière le panneau pour monter vers les premiers blocs." as Description,
            image: images[0]
        },
        {
            description: "Et ceci est une autre étape incroyable pour s'approcher du spot." as Description,
            image: images[0]
        }
    ]
}

export const parkings: Parking[] = [
    {
        id: v4(),
        spaces: 80,
        location: { lat: 45.701321, lng: 4.607274 },
        name: 'Parking 1' as StringBetween<1, 255>,
        description: 'Le parking de Rocher Canon est facile d’accès depuis la N12. Attention toutefois, beaucoup de GPS indique un itinéraire qui passe à travers la forêt et qui est en fait fermé. Il faut bien arriver par la N12. ' as StringBetween<1, 5000>,
        image: images[2]
    }
]

export const topo: TopoData = {
    id: uuid(),
    name: "Yzéron" as Name,
    description: "Le site d'Yzéron est situé sur le massif de Py froid à environ 800m d'altitude. Il est le plus grand site de bloc de la région Lyonnaise avec une grande diversité de profil (dévers, dalle, réta...). L'esplanade sépare la plus grande partie du site en amont, et une falaise idéale pour l'initiation, située en contrebas. La forêt protège une bonne partie du site contre les aléas météorologiques ce qui, combiné à l'altitude, permet la pratique de la grimpe toute l'année." as Description,
    status: TopoStatus.Draft,
    type: TopoType.Boulder,

    altitude: 775,
    closestCity: "Yzéron" as Name,
    location: { lat: 45.701356, lng: 4.607264 },

    isForbidden: false,
    amenities: Amenities.AdaptedToChildren | Amenities.Waterspot | Amenities.PicnicArea,
    // the real topo doesn't have composite rock, but this allows us to test the bitflag
    rockTypes: RockTypes.Gneiss | RockTypes.Composite,

    danger: "Il y a beaucoup de pentes" as Description,

    image: images[0],
    creatorId: topoCreatorId,
    creatorPseudo: 'Flavien' as Name,
    validatorId: validatorId,

    sectors: sectors,
    parkings: parkings,
    access: [access],
}

export const quarkTopo: Quark<Topo> = quarkifyTopo(topo);