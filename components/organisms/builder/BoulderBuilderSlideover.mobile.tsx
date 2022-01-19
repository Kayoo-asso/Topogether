import React, { useMemo, useState } from 'react';
import {
  GradeScale, RoundButton, SlideoverMobile, TracksImage, Show, TracksList, Icon
} from 'components';
import { Boulder, Difficulty, gradeToLightGrade, Track } from 'types';
import { topogetherUrl } from 'helpers/globals';
import { buildBoulderGradeHistogram } from 'helpers';
import { default as NextImage } from 'next/image';
import { Quark, watchDependencies, SelectQuarkNullable } from 'helpers/quarky';

interface BoulderBuilderSlideoverMobileProps {
  boulder: Quark<Boulder>,
  selectedTrack: SelectQuarkNullable<Track>,
  onPhotoButtonClick?: () => void,
  onSelectTrack: (selected: Quark<Track>) => void,
  onDrawButtonClick?: () => void,
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

export const BoulderBuilderSlideoverMobile: React.FC<BoulderBuilderSlideoverMobileProps> = watchDependencies((props: BoulderBuilderSlideoverMobileProps) => {
  const [full, setFull] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [trackTab, setTrackTab] = useState(true); // BUILDER

  const boulder = props.boulder();
  const selectedTrack = props.selectedTrack();

  const displayedTracks = useMemo(() => boulder.tracks.quarks(), [boulder.tracks]);

  return (
    <SlideoverMobile
      open
      initialFull={false}
      onSizeChange={(f) => setFull(f)}
    >
      {/* BOULDER IMAGE */}
      {full && (
        <div className="w-full bg-dark rounded-t-lg flex items-center justify-center overflow-hidden">
          {imageIndex > 0 && !selectedTrack &&
            <Icon 
              name="arrow-full"
              center
              SVGClassName="w-3 h-3 stroke-main fill-main rotate-180"
              wrapperClassName='absolute left-4 z-100'
              onClick={() => setImageIndex((idx) => idx - 1)}
            />
          }
          <TracksImage
            image={boulder.images.find(img => img.id === selectedTrack?.lines.at(0).imageId) || boulder.images[imageIndex]}
            containerClassName='w-full'
            tracks={boulder.tracks}
            selectedTrack={props.selectedTrack}
            displayPhantomTracks={false}
            displayTracksDetails={!!selectedTrack?.id}
          />
          {imageIndex < boulder.images.length - 1 && !selectedTrack &&
            <Icon 
              name="arrow-full"
              center
              SVGClassName="w-3 h-3 stroke-main fill-main"
              wrapperClassName='absolute right-4 z-100'
              onClick={() => setImageIndex((idx) => idx + 1)}
            />
          }
        </div>
      )}


      {/* BOULDER INFOS */}
      {<Show when={() => !selectedTrack}>
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
            {full && (
              <RoundButton
                iconName="camera"
                buttonSize={45}
                onClick={props.onPhotoButtonClick}
              />
            )}

            {!full && (
              <div className="w-full relative h-[60px]">
                <NextImage
                  src={boulder.images[0] ? boulder.images[0].url : '/assets/img/Kayoo_defaut_image.png'}
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
        </Show>}


      {/* TRACK INFOS */}
      {/* TODO: abstract this into its own component? */}
      <Show when={() => selectedTrack}>
        {track =>
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
                <RoundButton
                  iconName='draw'
                  buttonSize={45}
                  onClick={props.onDrawButtonClick}
                />
            </div>

            <div className='col-start-2 col-span-4 -mt-[16px]'>
              {track.isTraverse && full && <div className="ktext-base-little">Traversée</div>}
              {track.isSittingStart && full && <div className="ktext-base-little">Départ assis</div>}
            </div>
          </div>
        }
      </Show>


      {/* TODO : show once good pattern */}
      {/* TABS */}
      <Show when={() => !selectedTrack}>
        <div className="grid grid-cols-8 px-5 ktext-label font-bold my-2">
              <span className={`col-span-2 ${trackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setTrackTab(true)}>Voies</span>
              <span className={`col-span-6 ${!trackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setTrackTab(false)}>Infos du bloc</span>
        </div>
      </Show>


      {/* TRACKSLIST */}
      {trackTab && !selectedTrack && full && (
        <div className="overflow-auto pb-[30px]">
          <TracksList
            tracks={displayedTracks}
            onTrackClick={props.selectedTrack.select} //TODO
            onBuilderAddClick={() => console.log('create track')} //TODO
          />
        </div>
      )}


      {/* BOULDER FORM */}
      {!trackTab && !selectedTrack && full && (
        <div className='border-t border-grey-light'>
          {/* TODO */}
          BOULDER FORM
        </div>
      )}


      {/* TRACK FORM */}
      {selectedTrack && full && (
        <div className='border-t border-grey-light'>
            {/* TODO */}
            TRACK FORM
        </div>
      )}

    </SlideoverMobile>
  );
});