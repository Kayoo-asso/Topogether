import { Quark, QuarkArray } from "helpers/quarky";
import { Boulder, GradeHistogram, gradeToLightGrade, Topo, TopoData, Track } from "types";
import { addTrackToHistogram, defaultGradeHistogram } from "./buildBoulderGradeHistogram";

// The dependencies we'd want if we were doing this by hand:
// - sectors array
// - boulders array
// - tracks array
// - each track quark
// Technically, we need to subscribe to each sector / boulder quark as well, in case someone replaces the QuarkArray within them?
// So we could replace the reads with a peek here

export function buildGradeHistogram(topo: Topo): Quark<GradeHistogram> {
    return topo.sectors
        .lazy()
        .map(x => x.boulders)
        .flatten()
        .map(x => x.tracks)
        .flatten()
        .reduce(addTrackToHistogram, defaultGradeHistogram());
}

    // for (const sector of topo.sectors) {
    //     for (const boulder of sector.boulders) {
    //         for (const track of boulder.tracks) {
    //             if (track.grade) {
    //                 const lightGrade = gradeToLightGrade(track.grade);
    //                 histogram[lightGrade] += 1;
    //                 histogram.Total += 1;
    //             } else {
    //                 histogram.None += 1;
    //                 histogram.Total += 1;
    //             }
    //         }
    //     }
    // }
    // return histogram;