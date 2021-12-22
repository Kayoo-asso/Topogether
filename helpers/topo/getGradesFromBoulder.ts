import { Boulder, Grade } from 'types';

export const getGradesFromBoulder = (boulder: Boulder): Grade[] => {
  const grades: Grade[] = [];
  for (const track of boulder.tracks) {
    if (track.grade) grades.push(track.grade);
  }
  return grades;
};
