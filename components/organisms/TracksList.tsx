import React from 'react';
import { AverageNote, GradeCircle } from 'components';
import { gradeToLightGrade, Track } from 'types';
import { Quark, watchDependencies } from 'helpers/quarky';

interface TracksListProps {
  tracks: Iterable<Quark<Track>>,
  onTrackClick?: (track: Quark<Track>) => void,
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
};

// TODO: separate into a TracksListItem component?
export const TracksList: React.FC<TracksListProps> = watchDependencies((props: TracksListProps) => {
  const tracks = Array.from(props.tracks);

  return (
    <div className="w-full border-t border-grey-light">

      {tracks.map((trackQuark) => {
        const track = trackQuark();
        const grade = gradeToLightGrade(track.grade);
        return (
          <div
            key={track.id}
            className="px-5 py-5 md:py-3 grid grid-cols-10 items-center border-b border-grey-light cursor-pointer hover:bg-grey-superlight"
            onClick={() => {
              props.onTrackClick && props.onTrackClick(trackQuark);
            }}
          >
            <GradeCircle
              grade={grade}
              className="cursor-pointer"
              content={(track.orderIndex + 1).toString()}
            />

            {track.grade
              && (
              <div className={`ktext-subtitle ml-3 text-right ${gradeColors[grade]}`}>
                {track.grade}
              </div>
)}
            <div className="col-span-5 ml-3">
              <span className="ktext-base">{track.name}</span>
            </div>

            <AverageNote ratings={track.ratings} className="justify-end" wrapperClassName="col-span-2" />
          </div>
        );
      })}

      {props.onBuilderAddClick && (
        <div
          className="ktext-subtitle text-grey-medium px-5 py-5 md:py-3 cursor-pointer border-b border-grey-light hover:bg-grey-superlight"
          onClick={props.onBuilderAddClick}
        >
          <span className="ml-2 mr-5 text-xl">+</span>
          {' '}
          <span>Nouveau passage</span>
        </div>
      )}
    </div>
  );
});
