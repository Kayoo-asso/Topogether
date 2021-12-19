import { Grade, Topo } from "types";

export const getGradesNbFromTopos = (topo: Topo) => {
  const grades: Grade[] = [];
  for (const sector of topo.sectors) {
    if (sector.boulders) {
      for (const boulder of sector.boulders) {
        if (boulder.tracks) {
          for (const track of boulder.tracks) {
            if (track.grade) grades.push(track.grade);
          }
        }
      }
    }
  }
  
  const gradesNb: {
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

  grades.forEach(grade => gradesNb[grade[0]] += 1);
  return gradesNb;
}