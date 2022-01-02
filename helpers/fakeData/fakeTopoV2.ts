import { Quarkify } from 'helpers/quarky';
import { Boulder, Line, Name, Image, Track, Description, Difficulty, ClimbTechniques, Sector, Topo, Amenities, TopoStatus, TopoType, RockTypes, TopoAccess, Entities } from 'types';
import { v4 as uuid } from 'uuid';
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
    }
]

// TODO: create proper users and load them into quarks
export const topoCreatorId = uuid();
export const contributorId = uuid();
export const validatorId = uuid();

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
    },
    // Line 1, track 1
    {
        id: uuid(),
        imageId: images[1].id,
        points: [
            [2207, 1942],
            [2262, 787],
            [1901, 51]
        ]
    }
]

export const tracks: Track[] = [
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

export const boulders: Boulder[] = [
    {
        id: uuid(),
        name: "PearlHarbor" as Name,
        location: {
            lat: 45.70201,
            lng: 4.605412,
        },
        isHighball: true,
        descent: Difficulty.Dangerous,
        orderIndex: 0,
        images: [images[1]],
        tracks
    }
]

export const sectors: Sector[] = [
    {
        id: uuid(),
        name: "ABO" as Name,
        boulders,
        waypoints: []
    }
]

export const access: TopoAccess = {
    id: uuid(),
    duration: 15,
    difficulty: Difficulty.OK,
    steps: [
        {
            description: "Depuis le parking, prendre le sentier qui monte dans la continuité de la route. Après 12-15min de marche, vous arriverez à une esplanade d'herbe surmontant une petite falaise (où il est possible de faire de l'initiation). Un panneau indique le site d'escalade à l'entrée de l'esplanade.\nDepuis l'esplanade, prendre le sentier qui part derrière le panneau pour monter vers les premiers blocs." as Description,
        }
    ]
}

export const topo: Topo = {
    id: uuid(),
    name: "Yzéron" as Name,
    description: "Le site d'Yzéron est situé sur le massif de Py froid à environ 800m d'altitude. Il est le plus grand site de bloc de la région Lyonnaise avec une grande diversité de profil (dévers, dalle, réta...). L'esplanade sépare la plus grande partie du site en amont, et une falaise idéale pour l'initiation, située en contrebas. La forêt protège une bonne partie du site contre les aléas météorologiques ce qui, combiné à l'altitude, permet la pratique de la grimpe toute l'année." as Description,
    status: TopoStatus.Draft,
    type: TopoType.Boulder,

    altitude: 775,
    closestCity: "Yzéron" as Name,
    location: { lat: 45.701356, lng: 4.607264 },

    isForbidden: false,
    amenities: Amenities.AdaptedToChildren,
    // the real topo doesn't have composite rock, but this allows us to test the bitflag
    rockTypes: RockTypes.Gneiss | RockTypes.Composite,

    danger: "Il y a beaucoup de pentes" as Description,

    imageId: images[0].id,
    creatorId: topoCreatorId,
    validatorId: validatorId,

    sectors: sectors,
    parkings: [],
    access: [access],
}

export const quarkTopo: Quarkify<Topo, Entities> = quarkifyTopo(topo);