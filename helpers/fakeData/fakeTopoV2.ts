import { Quark } from 'helpers/quarky';
import { BoulderData, Line, Name, BoulderImage, TrackData, Description, Difficulty, ClimbTechniques, SectorData, TopoData, Amenities, TopoStatus, TopoType, RockTypes, TopoAccess, Topo, Parking, StringBetween, Manager, UUID, Reception, Waypoint } from 'types';
import { v4 as uuid, v4 } from 'uuid';
import { quarkifyTopo } from './quarkifyTopo';

// Note: using hardcoded strings instead of UUIDs everywhere to make cross-tab sync work with the fake data

export const images: BoulderImage[] = [
    // Topo image
    {
        id: "image-1" as UUID,
        url: "https://builder.topogether.com/public/uploads/topo/main-image/dad449499de38f1bdee5872de1a354d52fff6183.jpeg",
        width: 4592,
        height: 3064,
    },
    // Boulder 0 image
    {
        id: "image-2" as UUID,
        url: "https://builder.topogether.com/public/uploads/boulder/image/5b558375709fbbacae9e5dcb746c8e10e7fa083f.jpeg",
        width: 4592,
        height: 3064,
        // boulderImageDimensions = 674x450 in the original fakeTopo
        // multiply every line coordinate by 4592 / 674 to scale the data
    },
    {
        id: "image-3" as UUID,
        url: "https://builder.topogether.com/public/uploads/boulder/image/a486a4432feafc909d335e8f18ee5448212af176.jpeg",
        width: 1334,
        height: 2000,
    },
    // Parking 0 image
    {
        id: "image-4" as UUID,
        url: 'https://builder.topogether.com/public/uploads/parking/image/f1e65106ded2f0aafa14f1e6208a13178aae28b5.png',
        width: 1082,
        height: 476,
    }
]

// TODO: create proper users and load them into quarks
const topoCreatorId = "topo-creator" as UUID;
const contributorId = "contributor" as UUID;
const validatorId = "validator" as UUID;

export const lines: Line[] = [
    // Line 0, track 0
    {
        id: v4(),
        order: 0,
        imageId: images[1].id,
        points: [
            [2044, 1948],
            [2125, 770],
            [1764, 55],
            [1717, 1349],
            [2269, 1200]
        ],
        handDepartures: [
            [1050, 620],
        ],
    },
    // Line 1, track 1
    {
        id: v4(),
        order: 1,
        imageId: images[1].id,
        points: [
            [2207, 1942],
            [2262, 787],
            [1901, 51]
        ],
        forbidden: [
            [[1200, 50],
            [1650, 50],
            [1650, 400],
            [1200, 400]],
        ],
        feetDepartures: [
            [600, 250],
        ],
    }
]

export const tracks: TrackData[] = [
    // Track 0, boulder 0
    {
        id: "track-1" as UUID,
        index: 0,
        name: "Passage 1" as Name,
        grade: "4+",
        reception: Reception.OK,
        techniques: ClimbTechniques.Adherence,
        description: "Une petite montée facile" as Description,

        isTraverse: false,
        isSittingStart: true,
        mustSee: true,

        lines: [lines[0]],
        ratings: [],
        creatorId: topoCreatorId,
        hasMantle: false,
    },
    // Track 1, boulder 0
    {
        id: "track-2" as UUID,
        index: 1,
        name: "Passage 2" as Name,
        description: "Le départ assis est sévère mais le reste de la voie est trivial" as Description,
        height: 2,
        grade: "6a",
        reception: Reception.OK,
        // -> Bitflag example
        techniques: ClimbTechniques.Adherence | ClimbTechniques.Pince,

        isTraverse: true,
        isSittingStart: false,
        mustSee: false,

        lines: [lines[1]],
        ratings: [],
        creatorId: topoCreatorId,
        hasMantle: false,
    },
]

export const boulders: BoulderData[] = [
    {
        id: v4(),
        name: "PearlHarbor" as Name,
        location: [4.605412, 45.70201],
        isHighball: true,
        mustSee: false,
        dangerousDescent: false,
        images: [images[0], images[1], images[2], images[3]],
        tracks
    },
    {
        id: v4(),
        name: "Mystiquette" as Name,
        location: [4.606412, 45.70401],
        isHighball: true,
        mustSee: false,
        dangerousDescent: false,
        images: [images[0], images[1], images[2], images[3]],
        tracks
    },
    {
        id: v4(),
        name: "Hoummmmous" as Name,
        location: [4.606712, 45.70461],
        isHighball: true,
        mustSee: false,
        dangerousDescent: false,
        images: [images[0], images[1], images[2], images[3]],
        tracks
    },
    {
        id: v4(),
        name: "SupremeNTM" as Name,
        location: [4.608712, 45.70661],
        isHighball: false,
        mustSee: true,
        dangerousDescent: true,
        images: [images[0], images[1]],
        tracks
    }
]

export const sectors: SectorData[] = [
    {
        id: v4(),
        name: "ABO" as Name,
        path: [
            [4.604512, 45.70101],
            [4.608712, 45.70401],
            [4.606912, 45.70661]
        ],
        boulders: [boulders[0].id, boulders[1].id, boulders[2].id],
    }
]

export const access: TopoAccess[] = [
    {
        id: v4(),
        duration: 15,
        difficulty: Difficulty.OK,
        steps: [
            {
                description: "Depuis le parking, prendre le sentier qui monte dans la continuité de la route. Après 12-15min de marche, vous arriverez à une esplanade d'herbe surmontant une petite falaise (où il est possible de faire de l'initiation). Un panneau indique le site d'escalade à l'entrée de l'esplanade.\nDepuis l'esplanade, prendre le sentier qui part derrière le panneau pour monter vers les premiers blocs." as Description,
                imageUrl: images[0].url
            },
            {
                description: "Et ceci est une autre étape incroyable pour s'approcher du spot." as Description,
                imageUrl: images[0].url
            }
        ]
    },
    {
        id: v4(),
        duration: 25,
        difficulty: Difficulty.OK,
        steps: [
            {
                description: "Depuis le parking, prendre le sentier qui monte dans la continuité de la route. Après 12-15min de marche, vous arriverez à une esplanade d'herbe surmontant une petite falaise (où il est possible de faire de l'initiation). Un panneau indique le site d'escalade à l'entrée de l'esplanade.\nDepuis l'esplanade, prendre le sentier qui part derrière le panneau pour monter vers les premiers blocs." as Description,
                imageUrl: images[0].url
            },
            {
                description: "Et ceci est une autre étape incroyable pour s'approcher du spot." as Description,
                imageUrl: images[0].url
            }
        ]
    },    
]

export const parkings: Parking[] = [
    {
        id: v4(),
        spaces: 80,
        location: [4.607274, 45.701321],
        name: 'Parking 1' as StringBetween<1, 255>,
        description: 'Le parking de Rocher Canon est facile d’accès depuis la N12. Attention toutefois, beaucoup de GPS indique un itinéraire qui passe à travers la forêt et qui est en fait fermé. Il faut bien arriver par la N12. ' as StringBetween<1, 5000>,
        image: images[2]
    }
]

export const managers: Manager[] = [
    {
        id: v4(),
        name: 'La dégaine' as Name,
        imageUrl: images[3].url,
        contactName: 'Jérôme Foobar' as Name,
        contactPhone: '06 69 43 44 92' as Name,
        contactMail: 'ladegaine@ladegaine.com' as Name,
        adress: 'Maison des Arts, Chemin de la Ferrière' as Name,
        zip: 69260,
        city: 'Charbonnières-les-Bains' as Name,
    }
]

export const waypoints: Waypoint[] = [
    {
        id: v4(),
        name: 'Pont de pierre' as Name,
        location: [4.605462, 45.70256],
        description: "C'est un joli petit pont tout mignon qui permet de traverser une rivière ... DE SANNNNNG GNIAHAHAHAHA !!!" as Description,
    }
]

export const topo: TopoData = {
    id: v4(),
    name: "Yzéron" as Name,
    description: "Le site d'Yzéron est situé sur le massif de Py froid à environ 800m d'altitude. Il est le plus grand site de bloc de la région Lyonnaise avec une grande diversité de profil (dévers, dalle, réta...). L'esplanade sépare la plus grande partie du site en amont, et une falaise idéale pour l'initiation, située en contrebas. La forêt protège une bonne partie du site contre les aléas météorologiques ce qui, combiné à l'altitude, permet la pratique de la grimpe toute l'année." as Description,
    status: TopoStatus.Draft,
    type: TopoType.Boulder,

    altitude: 775,
    closestCity: "Yzéron" as Name,
    location: [4.607264, 45.701356],

    forbidden: false,
    amenities: Amenities.AdaptedToChildren | Amenities.Waterspot | Amenities.PicnicArea,
    // the real topo doesn't have composite rock, but this allows us to test the bitflag
    rockTypes: RockTypes.Gneiss | RockTypes.Composite,

    danger: "Il y a beaucoup de pentes" as Description,

    image: images[0],
    creatorId: topoCreatorId,
    creatorPseudo: 'Flavien' as Name,
    validatorId: validatorId,

    sectors: sectors,
    boulders: boulders,
    lonelyBoulders: [boulders[3].id],
    waypoints: waypoints,
    parkings: parkings,
    accesses: access,
    managers: managers,
}

export const quarkTopo: Quark<Topo> = quarkifyTopo(topo);