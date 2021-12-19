import { Boulder, Grade } from 'types';

export const getGradesFromBoulder = (boulder: Boulder) => {
  const grades: Grade[] = [];
  if (boulder.tracks) {
    for (const track of boulder.tracks) {
      if (track.grade) grades.push(track.grade);
    }
  }
  return grades;
};
