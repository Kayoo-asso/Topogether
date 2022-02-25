import React, { useContext } from 'react';
import { GradeCircle, Icon, ModalDelete} from 'components';
import { Boulder, gradeToLightGrade, Line, Name, Track, TrackRating, UUID } from 'types';
import { Quark, QuarkArray, SelectQuarkNullable, useSelectQuark, watchDependencies } from 'helpers/quarky';
import { TrackForm } from '../form/TrackForm';
import { v4 } from 'uuid';
import { DeviceContext } from 'helpers';
import { api } from 'helpers/services/ApiService';

interface TracksListBuilderProps {
  boulder: Quark<Boulder>,
  selectedTrack: SelectQuarkNullable<Track>,
  onTrackClick: (trackQuark: Quark<Track>) => void,
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

export const createTrack = (boulder: Boulder, creatorId: UUID) => {
  const newTrack: Track = {
    id: v4(),
    creatorId: creatorId,
    index: boulder.tracks.length,
    name: 'Voie ' + (boulder.tracks.length+1) as Name,
    mustSee: false,
    isTraverse: false,
    isSittingStart: false,
    lines: new QuarkArray<Line>([]),
    ratings: new QuarkArray<TrackRating>([])
  }
  boulder.tracks.push(newTrack);
  const newTrackQuark = boulder.tracks.quarkAt(-1);
  return newTrackQuark;
}

export const TracksListBuilder: React.FC<TracksListBuilderProps> = watchDependencies((props: TracksListBuilderProps) => {
  const session = api.user();

  const trackToDelete = useSelectQuark<Track>();;
  const device = useContext(DeviceContext);

  const boulder = props.boulder();
  const tracks = boulder.tracks.quarks();
  const selectedTrack = props.selectedTrack();

  if (!session) return null;
  return (
    <>
      <div className="w-full border-t border-grey-light">

        {tracks.map((trackQuark) => {
          const track = trackQuark();
          const grade = gradeToLightGrade(track.grade);
          return (
            <div
              key={track.id}
              className="px-5 py-5 md:py-3 flex flex-col border-b border-grey-light cursor-pointer md:hover:bg-grey-superlight"
              onClick={() => props.onTrackClick(trackQuark)}
            >
              <div className='flex flex-row w-full items-center'>
                <GradeCircle
                  grade={grade}
                  className="cursor-pointer"
                  content={(track.index + 1).toString()}
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
              {selectedTrack?.id === track.id && device === 'MOBILE' &&
                <TrackForm 
                  track={trackQuark}
                  className='mt-8'
                  onDeleteTrack={() => trackToDelete.select(trackQuark)}
                />
              }
            </div>  
          );
        })}

        <div
          className="ktext-subtitle text-grey-medium px-5 py-5 md:py-3 cursor-pointer border-b border-grey-light hover:bg-grey-superlight"
          onClick={() => {
            const newQuarkTrack = createTrack(boulder, session!.id);
            props.selectedTrack.select(newQuarkTrack);
          }}
        >
          <span className="ml-2 mr-5 text-xl">+</span>
          {' '}
          <span>Nouveau passage</span>
        </div>

      </div>

      {trackToDelete() &&
        <ModalDelete
            className='-top-[15vh]'
            onClose={() => trackToDelete.select(undefined)}
            onDelete={() => boulder.tracks.removeQuark(trackToDelete.quark()!)}
        >
            Etes-vous sûr de vouloir supprimer la voie ?
        </ModalDelete>
      }
    </>
  );
});
