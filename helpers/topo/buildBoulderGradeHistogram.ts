import { Boulder, GradeHistogram, gradeToLightGrade } from 'types';

export const buildBoulderGradeHistogram = (boulder: Boulder): GradeHistogram => {
  const histogram: GradeHistogram = {
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    None: 0,
    Total: 0,
  };
  for (const track of boulder.tracks) {
    if (track.grade) {
      const lightGrade = gradeToLightGrade(track.grade);
      histogram[lightGrade] += 1;
      histogram.Total += 1;
    } else {
      histogram.None += 1;
      histogram.Total += 1;
    }
  }
  return histogram;
};
