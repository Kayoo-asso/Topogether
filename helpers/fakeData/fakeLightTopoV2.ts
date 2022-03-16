import { quark, Quark } from 'helpers/quarky';
import { Name, BoulderImage, Description, Amenities, TopoStatus, TopoType, RockTypes, LightTopo } from 'types';
import { v4 as uuid } from 'uuid';

export const images: BoulderImage[] = [
    // Topo image
    {
        id: uuid(),
        index: 0,
        imagePath: "https://builder.topogether.com/public/uploads/topo/main-image/dad449499de38f1bdee5872de1a354d52fff6183.jpeg",
        width: 4592,
        height: 3064,
    },
]

// TODO: create proper users and load them into quarks
const topoCreatorId = uuid();
const contributorId = uuid();
const validatorId = uuid();

export const lightTopo: LightTopo = {
    id: uuid(),
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

    imagePath: images[0].imagePath,
    creator: {
        id: topoCreatorId,
        userName: 'Flavien' as Name,
        role: 'ADMIN',
        created: (new Date(2020, 9, 14)).toISOString()
    },

    firstParkingLocation: [4.607274, 45.701321],
    nbSectors: 4,
    nbBoulders: 82,
    nbTracks: 241,
    grades: {
        3: 25,
        4: 38,
        5: 49,
        6: 72,
        7: 41,
        8: 4,
        9: 0,
        'None': 12,
        Total: 241
    },
    submitted: (new Date(2020, 9, 14)).toISOString(),
    validated: (new Date(2020, 9, 14)).toISOString(),
    modified: (new Date(2020, 9, 14)).toISOString(),
    // IMPORTANT: modifying anything in a topo changes the last modified at
    // TODO: if someone is editing a topo offline, should we reflect that
    // in the modifiedAt date for them?
}

export const quarkLightTopo: Quark<LightTopo> = quark(lightTopo);