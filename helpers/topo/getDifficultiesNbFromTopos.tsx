import { Topo } from "types";
import { getLightGradeFromDiffIds } from ".";

export const getDifficultiesNbFromTopos = (topo: Topo) => {
  const diffIds: number[] = [];
  for (const sector of topo.sectors) {
    if (sector.boulders) {
      for (const boulder of sector.boulders) {
        if (boulder.tracks) {
          for (const track of boulder.tracks) {
            if (track.difficultyId) diffIds.push(track.difficultyId);
          }
        }
      }
    }
  }
  const difficultiesList = getLightGradeFromDiffIds(diffIds);
  
  const difficultiesNb: {
    [key: string]: number, 
  } = {
    '3': 0, 
    '4': 0, 
    '5': 0, 
    '6': 0, 
    '7': 0, 
    '8': 0, 
    '9': 0
  };

  difficultiesList.forEach(difficulty => difficultiesNb[difficulty] += 1);
  return difficultiesNb;
}