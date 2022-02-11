import { RockTypes } from "./Bitflags";
import { Reception, Difficulty } from "./Enums";

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
