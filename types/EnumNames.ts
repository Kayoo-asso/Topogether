import { RockTypes } from "./Bitflags";
import { Reception, Difficulty, TopoType, Orientation } from "./Enums";

export const DifficultyName: {[key in Difficulty]: string} = {
  [Difficulty.Good]: 'Facile',
  [Difficulty.OK]: 'Moyen',
  [Difficulty.Bad]: 'Difficile',
  [Difficulty.Dangerous]: 'Dangereuse'
};

export const ReceptionName: {[key in Reception]: string} = {
  [Reception.Good]: 'Bonne : sol plat',
  [Reception.OK]: 'Moyenne : sol irrégulier ou en pente',
  [Reception.None]: "ATTENTION ! Pas d'espace de réception",
  [Reception.Dangerous]: 'Dangereuse : rocher présent'
};

export const TopoTypeName: {[key in TopoType]: string} = {
  [TopoType.Artificial]: 'Artificiel',
  [TopoType.Boulder]: 'Bloc',
  [TopoType.Cliff]: "Falaise",
  [TopoType.DeepWater]: 'Deep water',
  [TopoType.Multipitch]: 'Grande voie'
};

export const OrientationName: {[key in Orientation]: string} = {
    [Orientation.N]: 'N',
    [Orientation.NE]: 'NE',
    [Orientation.E]: 'E',
    [Orientation.SE]: 'SE',
    [Orientation.S]: 'S',
    [Orientation.SW]: 'SW',
    [Orientation.W]: 'W',
    [Orientation.NW]: 'NW',
}