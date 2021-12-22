import { GradeHistogram, gradeToLightGrade, Topo } from "types";

export function buildGradeHistogram(topo: Topo): GradeHistogram {
    const histogram: GradeHistogram = {
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        None: 0
    };
    for (const sector of topo.sectors) {
        for (const boulder of sector.boulders) {
            for (const track of boulder.tracks) {
                if (track.grade) {
                    const lightGrade = gradeToLightGrade(track.grade);
                    histogram[lightGrade] += 1;
                } else {
                    histogram.None += 1;
                }
            }
        }
    }
    return histogram;
}