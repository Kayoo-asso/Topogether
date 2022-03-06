import { quark, Quark } from 'helpers/quarky';
import { Name, Image, Description, Amenities, TopoStatus, TopoType, RockTypes, LightTopo } from 'types';
import { v4 as uuid } from 'uuid';

export const images: Image[] = [
    // Topo image
    {
        id: uuid(),
        url: "https://builder.topogether.com/public/uploads/topo/main-image/dad449499de38f1bdee5872de1a354d52fff6183.jpeg",
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

    isForbidden: false,
    amenities: Amenities.AdaptedToChildren | Amenities.Waterspot | Amenities.PicnicArea,
    // the real topo doesn't have composite rock, but this allows us to test the bitflag
    rockTypes: RockTypes.Gneiss | RockTypes.Composite,

    danger: "Il y a beaucoup de pentes" as Description,

    image: images[0],
    creatorId: topoCreatorId,
    creatorPseudo: 'Flavien' as Name,
    validatorId: validatorId,

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
    submittedAt: new Date(),
    validatedAt: new Date(),
    // IMPORTANT: modifying anything in a topo changes the last modified at
    // TODO: if someone is editing a topo offline, should we reflect that
    // in the modifiedAt date for them?
    modifiedAt: new Date(),
}

export const quarkLightTopo: Quark<LightTopo> = quark(lightTopo);