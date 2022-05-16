import React, { useContext } from 'react';
import { GradeCircle } from 'components';
import { Boulder, gradeToLightGrade, Track } from 'types';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { TrackForm } from '../form/TrackForm';
import { createTrack, DeviceContext, staticUrl, useModal } from 'helpers';
import { useSession } from "helpers/services";
import DrawIcon from 'assets/icons/draw.svg';

interface TracksListBuilderProps {
  boulder: Quark<Boulder>,
  selectedTrack: SelectQuarkNullable<Track>,
  onTrackClick: (trackQuark: Quark<Track>) => void,
  onDrawButtonClick?: () => void,
  onCreateTrack?: () => void,
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

export const TracksListBuilder: React.FC<TracksListBuilderProps> = watchDependencies((props: TracksListBuilderProps) => {
  const session = useSession();
  const [ModalDelete, showModalDelete] = useModal<Quark<Track>>();

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
                  onClick={() => props.onTrackClick(trackQuark)}
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
                  <button onClick={(e) => {
                    e.stopPropagation();
                    props.selectedTrack.select(trackQuark);
                    props.onDrawButtonClick!();
                  }}>
                    <DrawIcon
                      className='w-6 h-6 stroke-main'
                    />
                  </button>
                }
              </div>
              {selectedTrack?.id === track.id && device === 'mobile' &&
                <TrackForm
                  track={trackQuark}
                  className='mt-8'
                  onDeleteTrack={() => showModalDelete(trackQuark)}
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
            if (props.onCreateTrack) props.onCreateTrack();
          }}
        >
          <span className="ml-2 mr-5 text-xl">+</span>
          {' '}
          <span>Nouveau passage</span>
        </div>

      </div>

      <ModalDelete
        buttonText="Confirmer"
        imgUrl={staticUrl.deleteWarning}
        onConfirm={(track) => boulder.tracks.removeQuark(track)} 
        // className='-top-[15vh]'  TODO : check if necessary
      >
        Etes-vous sûr de vouloir supprimer la voie ?
      </ModalDelete>
    </>
  );
});

TracksListBuilder.displayName = "TracksListBuilder";