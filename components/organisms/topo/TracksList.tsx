import React, { useState } from 'react';
import { AverageNote, GradeCircle } from 'components';
import { gradeToLightGrade, Track } from 'types';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';

interface TracksListProps {
  tracks: Iterable<Quark<Track>>,
  selectedTrack: SelectQuarkNullable<Track>,
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
            className="px-5 py-5 md:py-3 flex flex-col border-b border-grey-light cursor-pointer md:hover:bg-grey-superlight"
            onClick={() => {
              if (props.selectedTrack()?.id === track.id) props.selectedTrack.select(undefined);
              else props.selectedTrack.select(trackQuark);
            }}
          >
            <div className='flex flex-row w-full items-center'>
              <GradeCircle
                grade={grade}
                className="cursor-pointer"
                content={(track.orderIndex + 1).toString()}
              />

              {track.grade && (
                <div className={`ktext-subtitle ml-3 text-right ${gradeColors[grade]}`}>
                  {track.grade}
                </div>
              )}
              <div className="ml-4 w-7/12 flex flex-col">
                <span className="ktext-base">{track.name}</span>
                {track.isTraverse && <div className='ktext-subtext'>Traversée</div>}
                {track.isSittingStart && <div className='ktext-subtext'>Départ assis</div>}
              </div>

              <AverageNote 
                ratings={track.ratings} 
                className="justify-end" 
                wrapperClassName="col-span-2" 
              />
            </div>
            {props.selectedTrack()?.id === track.id &&
              <>
                <div className='mt-4'>
                  {track.description}
                </div>
                <div className='flex flex-row gap-2 justify-between mt-4'>
                  <div className="flex flex-col w-1/3">
                    <div className="ktext-subtitle">Techniques</div>
                    {/* TODO */}
                  </div>

                  <div className="flex flex-col w-1/3">
                    <div className="ktext-subtitle">Réception</div>
                    {/* TODO */}
                  </div>

                  <div className="flex flex-col w-1/3">
                    <div className="ktext-subtitle">Orientation</div>
                    {/* TODO */}
                  </div>
                </div>
              </>
            }
          </div>  
        );
      })}
    </div>
  );
});
