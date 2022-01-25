import React, { useMemo, useState } from 'react';
import {
  GradeScale, RoundButton, SlideoverMobile, TracksImage, Icon
} from 'components';
import { Boulder, Difficulty, Track } from 'types';
import { buildBoulderGradeHistogram } from 'helpers';
import { default as NextImage } from 'next/image';
import { Quark, watchDependencies, SelectQuarkNullable } from 'helpers/quarky';
import { TracksListBuilder } from '.';
import { BoulderForm } from '..';
import { v4 } from 'uuid';

interface BoulderBuilderSlideoverMobileProps {
  boulder: Quark<Boulder>,
  selectedTrack: SelectQuarkNullable<Track>,
  onPhotoButtonClick?: () => void,
  onDrawButtonClick: () => void,
  onClose: () => void,
}

export const BoulderBuilderSlideoverMobile: React.FC<BoulderBuilderSlideoverMobileProps> = watchDependencies((props: BoulderBuilderSlideoverMobileProps) => {
  const [full, setFull] = useState(false);
  const [trackTab, setTrackTab] = useState(true);

  const boulder = props.boulder();
  const selectedTrack = props.selectedTrack();

  const [imageToDisplayIndex, setImageToDisplayIndex] = useState(0);
  const imageToDisplay = boulder.images.find(img => img.id === selectedTrack?.lines?.at(0)?.imageId) || boulder.images[imageToDisplayIndex];

  const [displayPhantomTracks, setDisplayPhantomTracks] = useState(false);

  return (
    <SlideoverMobile
      open
      initialFull={false}
      onSizeChange={(f) => setFull(f)}
      onClose={props.onClose}
    >
      {/* BOULDER IMAGE */}
      {full && (
        <div className="w-full bg-dark rounded-t-lg flex items-center justify-center">
          {imageToDisplayIndex > 0 && !selectedTrack &&
            <Icon 
              name="arrow-full"
              center
              SVGClassName="w-3 h-3 stroke-main fill-main rotate-180"
              wrapperClassName='absolute left-4 z-100'
              onClick={() => setImageToDisplayIndex((idx) => idx - 1)}
            />
          }
          <TracksImage
            image={imageToDisplay}
            tracks={boulder.tracks}
            selectedTrack={props.selectedTrack}
            displayPhantomTracks={displayPhantomTracks}
            displayTracksDetails={!!selectedTrack?.id}
            containerClassName={'max-h-[300px]' + (imageToDisplay.width/imageToDisplay.height > 1 ? ' overflow-hidden rounded-t-lg' : '')}
          />
          {imageToDisplayIndex < boulder.images.length - 1 && !selectedTrack &&
            <Icon 
              name="arrow-full"
              center
              SVGClassName="w-3 h-3 stroke-main fill-main"
              wrapperClassName='absolute right-4 z-100'
              onClick={() => setImageToDisplayIndex((idx) => idx + 1)}
            />
          }
        </div>
      )}


      {/* BOULDER INFOS */}
      <div className={`grid grid-cols-8 p-5 items-center ${full ? '' : ' mt-3'}`}>
        <div className="col-span-6">
          <div className="ktext-section-title">{boulder.name}</div>
          {boulder.isHighball && full && <div className="ktext-base-little">High Ball</div>}
          {boulder.dangerousDescent && full && <div className="ktext-base-little">Descente dangereuse !</div>}
          {!full && (
            <div className="flex items-center mt-2">
              <GradeScale
                histogram={buildBoulderGradeHistogram(boulder)}
                circleSize="little"
              />
            </div>
          )}
        </div>

        <div className="flex flex-row items-center gap-6 justify-end col-span-2">
          {selectedTrack &&
            <Icon 
              name='many-tracks'
              SVGClassName={'w-6 h-6 ' + (displayPhantomTracks ? 'stroke-main' : 'stroke-grey-medium')}
              onClick={() => setDisplayPhantomTracks(!displayPhantomTracks)}
            />
          }
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


      {/* TODO : show once good pattern */}
      {/* TABS */}
      <div className="flex flex-row px-5 ktext-label font-bold my-2">
          <span className={`w-1/4 ${trackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setTrackTab(true)}>Voies</span>
          <span className={`w-3/4 ${!trackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setTrackTab(false)}>Infos du bloc</span>
      </div>


      {/* TRACKSLIST */}
      {trackTab && full && (
        <div className="overflow-auto pb-[30px]">
          <TracksListBuilder
            boulder={props.boulder}
            selectedTrack={props.selectedTrack}
            onDrawButtonClick={props.onDrawButtonClick}
          />
        </div>
      )}


      {/* BOULDER FORM */}
      {!trackTab && full && (
        <div className='border-t border-grey-light px-6 py-10 overflow-auto'>
          <BoulderForm 
            boulder={props.boulder} 
          />
        </div>
      )}

    </SlideoverMobile>
  );
});