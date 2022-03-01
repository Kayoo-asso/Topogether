import {
  Amenities, Description, Difficulty, LightTopo, Name, RockTypes, StringBetween, TopoStatus, TopoType,
} from 'types';
import { v4 as uuid } from 'uuid';

export const fakeLightTopo: LightTopo = {
  id: uuid(),
  name: 'Yzéron' as Name,
  submitted: new Date(2019, 1, 2),
  validated: new Date(2019, 3, 1),
  modified: new Date(2020, 1, 1),
  cleaned: new Date(2019, 11, 23),
  status: TopoStatus.Draft,
  type: TopoType.Boulder,
  forbidden: false,

  location: { lat: 45.701356, lng: 4.607264 },
  // no idea if there"s actually composite rock at Yzeron
  rockTypes: RockTypes.Gneiss | RockTypes.Composite,
  amenities: Amenities.Bins | Amenities.AdaptedToChildren,
  otherAmenities: undefined,

  creatorId: uuid(),
  validatorId: uuid(),
  image: {
    id: uuid(),
    url: 'https://builder.topogether.com/public/uploads/topo/main-image/dad449499de38f1bdee5872de1a354d52fff6183.jpeg',
    width: 4592,
    height: 3064,
  },

  closestCity: 'Yzéron' as Name,
  altitude: 775.00,
  description: "Le site d'Yzéron est situé sur le massif de Py froid à environ 800m d'altitude. Il est le plus grand site de bloc de la région Lyonnaise avec une grande diversité de profil (dévers, dalle, réta...). L'esplanade sépare la plus grande partie du site en amont, et une falaise idéale pour l'initiation, située en contrebas. La forêt protège une bonne partie du site contre les aléas météorologiques ce qui, combiné à l'altitude, permet la pratique de la grimpe toute l'année." as Description,
  faunaProtection: undefined,
  ethics: undefined,
  danger: 'Beaucoup de pentes' as Description,

  grades: {
    3: 2,
    4: 7,
    5: 23,
    6: 35,
    7: 18,
    8: 5,
    9: 1,
    None: 11,
    Total: 102,
  },
  nbSectors: 7,
  nbBoulders: 67,
  nbTracks: 162,

  // approachDescription: "Depuis le parking, prendre le sentier qui monte dans la continuité de la route. Après 12-15min de marche, vous arriverez à une esplanade d"herbe surmontant une petite falaise (où il est possible de faire de l"initiation). Un panneau indique le site d"escalade à l"entrée de l"esplanade.\nDepuis l"esplanade, prendre le sentier qui part derrière le panneau pour monter vers les premiers blocs.",
  // approachDifficultyId: 2,
  // approachTime: 15,
};
