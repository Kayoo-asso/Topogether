import { Signal } from 'helpers/quarky';
import { Boulder, GradeHistogram, gradeToLightGrade, Track } from 'types';

export const buildBoulderGradeHistogram = (boulder: Boulder): Signal<GradeHistogram> => {
  return boulder.tracks.lazy()
    .reduce(addTrackToHistogram, defaultGradeHistogram);
};

export const addTrackToHistogram = (histogram: GradeHistogram, track: Track) => {
  histogram[gradeToLightGrade(track.grade)] += 1;
  histogram.Total += 1;
  return histogram;
}

export const defaultGradeHistogram  = (): GradeHistogram => ({
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    None: 0,
    Total: 0,
})

  // for (const track of boulder.tracks) {
  //   if (track.grade) {
  //     const lightGrade = gradeToLightGrade(track.grade);
  //     histogram[lightGrade] += 1;
  //     histogram.Total += 1;
  //   } else {
  //     histogram.None += 1;
  //     histogram.Total += 1;
  //   }
  // }
  // return histogram;