import { TrackRating } from "types";

export function averageTrackNote(ratings: TrackRating[]): number {
    let total = 0;
    for (let i = 0; i < ratings.length; i++) {
        total += ratings[i].rating
    };
    return total / ratings.length;
}