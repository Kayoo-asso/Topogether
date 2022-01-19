import React from 'react';
import { GradeCircle, Icon } from 'components';
import { gradeToLightGrade, Track } from 'types';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';

interface TracksListBuilderProps {
  tracks: Iterable<Quark<Track>>,
  selectedTrack: SelectQuarkNullable<Track>,
  onTrackClick: (track: Quark<Track>) => void,
  onAddTrack: () => void,
  onDrawButtonClick: () => void,
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
export const TracksListBuilder: React.FC<TracksListBuilderProps> = watchDependencies((props: TracksListBuilderProps) => {
  const tracks = Array.from(props.tracks);
  const selectedTrack = props.selectedTrack ? props.selectedTrack() : undefined;

  return (
    <div className="w-full border-t border-grey-light">

      {tracks.map((trackQuark) => {
        const track = trackQuark();
        const grade = gradeToLightGrade(track.grade);
        return (
          <div
            key={track.id}
            className="px-5 py-5 md:py-3 flex flex-col border-b border-grey-light cursor-pointer md:hover:bg-grey-superlight"
            onClick={() => props.selectedTrack.select(trackQuark)}
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
              <div className="ml-4 w-3/4 flex flex-col">
                <span className="ktext-base">{track.name}</span>
                {track.isTraverse && <div className='ktext-subtext'>Traversée</div>}
                {track.isSittingStart && <div className='ktext-subtext'>Départ assis</div>}
              </div>

              <Icon 
                name='draw'
                SVGClassName='w-6 h-6 stroke-main'
                onClick={props.onDrawButtonClick}
              />
            </div>
            {selectedTrack?.id === track.id &&
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

      <div
        className="ktext-subtitle text-grey-medium px-5 py-5 md:py-3 cursor-pointer border-b border-grey-light hover:bg-grey-superlight"
        onClick={props.onAddTrack}
      >
        <span className="ml-2 mr-5 text-xl">+</span>
        {' '}
        <span>Nouveau passage</span>
      </div>

    </div>
  );
});
