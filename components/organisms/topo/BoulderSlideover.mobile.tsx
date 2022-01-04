import React, { useState } from 'react';
import {
  GradeScale, Icon, LikeButton, RoundButton, SlideoverMobile, TracksImage,
} from 'components';
import { Boulder, BoulderData, BoulderQuark, Difficulty, Entities, gradeToLightGrade, Track, TrackData, TrackQuark, UUID } from 'types';
import { topogetherUrl } from 'helpers/globals';
import { buildBoulderGradeHistogram } from 'helpers';
import { TracksList } from '.';
import { default as NextImage } from 'next/image';
import { derive, quark, Quark, QuarkIterator, quarkArray, Quarkify, read, useCreateDerivation, useInlineDerivation, useQuark, useQuarks, useQuarkValue } from 'helpers/quarky';
import { topo, topoCreatorId, tracks } from 'helpers/fakeData/fakeTopoV2';

interface BoulderSlideoverMobileProps {
  open?: boolean,
  boulder: Quark<Boulder>,
  selectedTrack: Quark<Track | undefined>,
  topoCreatorId?: UUID,
  forBuilder?: boolean,
  onPhotoButtonClick: () => void,
  onSelectTrack: (id: UUID) => void,
  onDrawButtonClick: () => void,
  onClose: () => void,
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

export const BoulderSlideoverMobile: React.FC<BoulderSlideoverMobileProps> = ({
  open = true,
  forBuilder = false,
  ...props
}: BoulderSlideoverMobileProps) => {
  const [full, setFull] = useState(false);
  const [boulderLiked, setBoulderLiked] = useState(false); // To change TODO
  const [officialTrackTab, setOfficialTrackTab] = useState(true); // TOPO
  const [trackTab, setTrackTab] = useState(true); // BUILDER

  const [boulder, setBoulder] = useQuark(props.boulder);
  if (!boulder) return null;
  const [selectedTrack, setSelectedTrack] = useQuark(props.selectedTrack);


  const displayedTracks = boulder.tracks
    .unwrap()
    .filter(track => ((track.creatorId) === topoCreatorId) === officialTrackTab);
  
  return (
    <SlideoverMobile
      open
      initialFull={false}
      onSizeChange={(f) => setFull(f)}
      onClose={() => {
        setBoulder(undefined);
        setSelectedTrack(undefined);
      }}
    >
      {/* BOULDER IMAGE */}
      {full && (
        <div className="w-full bg-dark rounded-t-lg flex items-center justify-center overflow-hidden">
          <TracksImage
            image={boulder.images[0]}
            containerClassName='w-full'
            tracks={boulder.tracks}
            currentTrackId={props.trackId}
            displayTracksDetails={!!props.trackId}
          />
        </div>
      )}


      {/* BOULDER INFOS */}
      {!selectedTrack && (
        <div className={`grid grid-cols-8 p-5 items-center ${full ? '' : ' mt-3'}`}>
          <div className="col-span-6">
            <div className="ktext-section-title">{boulder.name}</div>
            {boulder.isHighball && full && <div className="ktext-base-little">High Ball</div>}
            {boulder.descent === Difficulty.Dangerous && full && <div className="ktext-base-little">Descente dangereuse !</div>}
            {!full && (
              <div className="flex items-center mt-2">
                <GradeScale
                  histogram={buildBoulderGradeHistogram(boulder)}
                  circleSize="little"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end col-span-2">
            {!forBuilder && full && (
              <LikeButton
                liked={boulderLiked}
                onClick={() => {
                  setBoulderLiked(!boulderLiked);
                }}
              />
            )}
            {forBuilder && full && (
              <RoundButton
                iconName="camera"
                buttonSize={45}
                onClick={props.onPhotoButtonClick}
              />
            )}

            {!full && (
              <div className="w-full relative h-[60px]">
                <NextImage
                  src={boulder.images[0] ? topogetherUrl + boulder.images[0].url : '/assets/img/Kayoo_defaut_image.png'}
                  className="rounded-sm"
                  alt="Boulder"
                  priority
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
          </div>
        </div>
      )}


      {/* TRACK INFOS */}
      {read(props.track) && (
        <div className={`grid grid-cols-8 p-5 items-center ${full ? '' : ' mt-3'}`}>
          <div className='col-span-1 pr-3'>
            {track.grade &&
              <div className={`ktext-subtitle float-right ${gradeColors[gradeToLightGrade(track.grade)]}`}>
                {track.grade}
              </div>
            }
          </div>

          <div className='col-span-6'>
            <div className="ktext-section-title">{track.name}</div>
          </div>

          <div className='col-span-1'>
            {forBuilder && (
              <RoundButton
                iconName='draw'
                buttonSize={45}
                onClick={props.onDrawButtonClick}
              />
            )}
            {!forBuilder && (
              <Icon
                name='flag'
              />
            )}
          </div>

          <div className={'col-start-2 col-span-4' + (forBuilder ? ' -mt-[16px]' : '')}>
            {track.isTraverse && full && <div className="ktext-base-little">Traversée</div>}
            {track.isSittingStart && full && <div className="ktext-base-little">Départ assis</div>}
          </div>

          {!forBuilder &&
            <div className='col-span-3 flex content-end'>
              Etoiles
            </div>
          }
        </div>
      )}


      {/* TRACK DETAILS */}
      {read(props.track) && forBuilder && full && (
        <>
          <div className='grid grid-cols-9 p-5 items-center'>
            <div className='col-span-full mb-6'>
              {track.description}
            </div>

            <div className='col-span-3'>
              <div className='ktext-subtitle'>Techniques</div>

            </div>

            <div className='col-span-3'>
              <div className='ktext-subtitle'>Réception</div>

            </div>

            <div className='col-span-3'>
              <div className='ktext-subtitle'>Orientation</div>

            </div>
          </div>
        </>
      )}


      {/* TABS */}
      {!read(props.track) && (
        <div className="grid grid-cols-8 px-5 ktext-label font-bold my-2">
          {!forBuilder && (
            <>
              <span className={`col-span-2 ${officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(true)}>officielles</span>
              <span className={`col-span-2 ${!officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(false)}>communautés</span>
              <span className="col-start-8 flex justify-end">
                <Icon
                  name="add"
                  SVGClassName="w-5 h-5 stroke-main"
                  onClick={() => console.log('create community track')} //TODO
                />
              </span>
            </>
          )}

          {forBuilder && (
            <>
              <span className={`col-span-2 ${trackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setTrackTab(true)}>Voies</span>
              <span className={`col-span-6 ${!trackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setTrackTab(false)}>Infos du bloc</span>
            </>
          )}
        </div>
      )}


      {/* TRACKSLIST */}
      {(!forBuilder || trackTab) && !selectedTrack && full && (
        <div className="overflow-auto pb-[30px]">
          <TracksList
            tracks={displayedTracks}
            onTrackClick={props.onSelectTrack} //TODO
            onBuilderAddClick={() => console.log('create track')} //TODO
          />
        </div>
      )}


      {/* BOULDER FORM */}
      {forBuilder && !trackTab && !selectedTrack && full && (
        <div className='border-t border-grey-light'>
          {/* TODO */}
        </div>
      )}


      {/* TRACK FORM */}
      {forBuilder && selectedTrack && full && (
        <div></div>
      )}

    </SlideoverMobile>
  );
};
