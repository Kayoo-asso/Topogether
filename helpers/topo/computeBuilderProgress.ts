import { Topo } from "types";

const rules = [
  'TOPO_IMAGE',
  'DESCRIPTION',
  'ROCK_TYPE',
  'ALTITUDE',
  'PARKINGS',
  'ACCESS_DURATION',
  'ACCESS_DIFFICULTY',
  'ACCESS_STEP',
  'MANAGRES',
  'BOULDERS',
  'TRACKS'
] as const;

type Rule = typeof rules[number];

export const computeBuilderProgress = (topo: Topo) => {
    return rules.filter(rule => validateRule(topo, rule)).length/rules.length
}

const validateRule = (topo: Topo, rule: Rule): boolean => {
    switch (rule) {
        case 'TOPO_IMAGE':
          return !!topo.imagePath;
          case 'DESCRIPTION':
            return !!topo.description;
          case 'ROCK_TYPE':
            return !!topo.rockTypes; 
          case 'ALTITUDE':
            return !!topo.altitude ||topo.altitude === 0 ; 
          case 'PARKINGS':
            return topo.parkings.length > 0
          case 'ACCESS_DURATION':
            return topo.accesses.toArray().every(access => !!access.duration);
          case 'ACCESS_DIFFICULTY':
            return topo.accesses.toArray().every(access => !!access.difficulty);
          case 'ACCESS_STEP':
            return topo.accesses.toArray().every(access => access.steps && access.steps.length > 0);
          case 'MANAGRES':
            return topo.managers.length > 0;
          case 'BOULDERS':
            return topo.boulders.length > 0;
          case 'TRACKS':
            return topo.boulders.toArray().map(boulder => boulder.tracks.toArray()).flat().length > 0;
          default:
            return false;
    }
}


