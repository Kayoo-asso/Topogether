import React from 'react';
import { Checkbox, GradeCircle, Icon, MultipleSelect, TextArea, TextInput } from 'components';
import { Description, gradeToLightGrade, Name, Track } from 'types';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { TrackForm } from '../form/TrackForm';

interface TracksListBuilderProps {
  tracks: Iterable<Quark<Track>>,
  selectedTrack: SelectQuarkNullable<Track>,
  onAddTrack: () => void,
  onDrawButtonClick?: () => void,
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
  const selectedTrack = props.selectedTrack();

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
              if (props.selectedTrack()?.id === track.id) props.selectedTrack.select(undefined)
              else props.selectedTrack.select(trackQuark)
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
              <div className="ml-4 w-3/4 flex flex-col">
                <span className="ktext-base">{track.name}</span>
                {track.isTraverse && <div className='ktext-subtext'>Traversée</div>}
                {track.isSittingStart && <div className='ktext-subtext'>Départ assis</div>}
              </div>
              
              {props.onDrawButtonClick &&
                <Icon 
                  name='draw'
                  SVGClassName='w-6 h-6 stroke-main'
                  onClick={props.onDrawButtonClick}
                />
              }
            </div>
            {selectedTrack?.id === track.id &&
              <TrackForm 
                track={trackQuark}
                className='mt-8'
              />
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
