import React from 'react';
import { AverageNote, GradeCircle } from 'components';
import { Grade, gradeToLightGrade, Track, UUID } from 'types';
import { averageTrackNote } from 'helpers/topo/averageTrackRating';

interface TracksListProps {
  tracks: Track[],
  onTrackClick?: (id: UUID) => void,
  onBuilderAddClick?: () => void,
}

const gradeColors = {
  3: 'text-grade-3',
  4: 'text-grade-4',
  5: 'text-grade-5',
  6: 'text-grade-6',
  7: 'text-grade-7',
  8: 'text-grade-8',
  9: 'text-grade-9',
  None: 'border-grey-light bg-grey-light text-white',
}

export const TracksList: React.FC<TracksListProps> = (props: TracksListProps) => {

  return (
    <div className="w-full border-t border-grey-light">
      {props.tracks.map((track) => {
        const grade = gradeToLightGrade(track.grade);
        return (
          <div
            key={track.id}
            className="px-5 py-5 grid grid-cols-10 items-center border-b border-grey-light"
            onClick={() => {
              props.onTrackClick && props.onTrackClick(track.id);
            }}
          >
            <GradeCircle
              grade={grade}
              className=""
              content={track.orderIndex.toString()}
            />

            <div className={`ktext-subtitle mr-1 text-right ${gradeColors[grade]}`}>
              {track.grade || "Pas de cotation"}
            </div>
            <div className="col-span-6">
              <span className="ktext-base">{track.name}</span>
            </div>
            {track.ratings.length > 1 && (
              <div className="col-span-2">
                <AverageNote note={averageTrackNote(track.ratings)} className="justify-end" />
              </div>
            )}
          </div>
        );
      })}
      {props.onBuilderAddClick && (
        <div
          className="ktext-subtitle text-grey-medium px-5 py-5 cursor-pointer border-b border-grey-light"
          onClick={props.onBuilderAddClick}
        >
          <span className="ml-2 mr-5 text-xl">+</span>
          {' '}
          <span>Nouveau passage</span>
        </div>
      )}
    </div>
  );
};
