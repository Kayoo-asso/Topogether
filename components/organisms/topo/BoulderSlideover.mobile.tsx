import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { GradeScale, LikeButton, SlideoverMobile, Show } from 'components';
import { Boulder, Image, Track, UUID } from 'types';
import { buildBoulderGradeHistogram } from 'helpers';
import { Quark, watchDependencies, SelectQuarkNullable } from 'helpers/quarky';
import { TracksList } from '..';
import { CFImage } from 'components/atoms/CFImage';
import ArrowFull from 'assets/icons/arrow-full.svg';
import ManyTracks from 'assets/icons/many-tracks.svg';
import AddIcon from 'assets/icons/add.svg';

interface BoulderSlideoverMobileProps {
  boulder: Quark<Boulder>,
  open?: boolean,
  selectedTrack: SelectQuarkNullable<Track>,
  topoCreatorId?: UUID,
  currentImage?: Image,
  setCurrentImage: Dispatch<SetStateAction<Image | undefined>>,
  onClose: () => void,
}

export const BoulderSlideoverMobile: React.FC<BoulderSlideoverMobileProps> = watchDependencies(({
  open = true,
  ...props
}: BoulderSlideoverMobileProps) => {
  const [full, setFull] = useState(false);
  const [officialTrackTab, setOfficialTrackTab] = useState(true);

  const boulder = props.boulder();
  const selectedTrack = props.selectedTrack();

  const [imageToDisplayIndex, setImageToDisplayIndex] = useState(0);

  const [displayPhantomTracks, setDisplayPhantomTracks] = useState(false);
  const displayedTracks = useMemo(() => boulder.tracks
    .quarks()
    .filter((track) => ((track().creatorId) === props.topoCreatorId) === officialTrackTab),
    [boulder.tracks, props.topoCreatorId, officialTrackTab],
  );

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
          {imageToDisplayIndex > 0 &&
            <button
              className='absolute left-4 z-100'
              onClick={() => {
                props.setCurrentImage(boulder.images[imageToDisplayIndex - 1]);
                setImageToDisplayIndex(idx => idx - 1)
              }}
            >
              <ArrowFull className="w-3 h-3 stroke-main fill-main rotate-180" />
            </button>
          }

          {/* <TracksImage
            image={props.currentImage}
            tracks={boulder.tracks.quarks()}
            selectedTrack={props.selectedTrack}
            displayPhantomTracks={displayPhantomTracks}
            displayTracksDetails={!!selectedTrack?.id}
            containerClassName={props.currentImage.width / props.currentImage.height > 1 ? 'overflow-hidden rounded-t-lg h-full' : 'h-[35vh]'}
          /> */}

          {imageToDisplayIndex < boulder.images.length - 1 &&
            <button
              className="absolute right-4 z-100"
              onClick={() => {
                props.setCurrentImage(boulder.images[imageToDisplayIndex + 1]);
                setImageToDisplayIndex(idx => idx + 1)
              }}
            >
              <ArrowFull className="w-3 h-3 stroke-main fill-main" />
            </button>
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

        <div className="flex flex-row gap-5 justify-end col-span-2">
          {selectedTrack &&
            <button
              onClick={() => setDisplayPhantomTracks(!displayPhantomTracks)}
            >
              <ManyTracks
                className={'w-6 h-6 ' + (displayPhantomTracks ? 'stroke-main' : 'stroke-grey-medium')}
              />
            </button>
          }
          {full && (
            <LikeButton
              liked={boulder.liked}
            />
          )}

          {!full && (
            <div className="w-full relative h-[60px]">
              <CFImage
                image={boulder.images[0]}
                className="rounded-sm object-contain"
                alt="Boulder"
                sizeHint="50vw"
              />
            </div>
          )}
        </div>
      </div>

      {/* TODO : show once good pattern */}
      {/* TABS */}
      {full &&
        <div className="flex flex-row gap-8 w-full px-5 ktext-label font-bold my-2">
          <span className={`${officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(true)}>officielles</span>
          <span className={`${!officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(false)}>communautés</span>
          <span className="flex w-full justify-end">
            <button
              onClick={() => console.log('create community track')} // TODO
            >
              <AddIcon
                className="w-5 h-5 stroke-main"
              />
            </button>
          </span>
        </div>
      }

      {/* TRACKSLIST */}
      <Show when={() => full}>
        <div className="overflow-auto pb-[30px]">
          <TracksList
            tracks={displayedTracks}
            selectedTrack={props.selectedTrack}
            onTrackClick={(trackQuark) => {
              if (props.selectedTrack()?.id === trackQuark().id) props.selectedTrack.select(undefined);
              else {
                const newImageIndex = boulder.images.findIndex(img => img.id === trackQuark().lines?.at(0).imageId);
                if (newImageIndex > -1) {
                  props.setCurrentImage(boulder.images[newImageIndex]);
                  setImageToDisplayIndex(newImageIndex);
                }
                props.selectedTrack.select(trackQuark);
              }
            }}
          />
        </div>
      </Show>

    </SlideoverMobile>
  );
});

BoulderSlideoverMobile.displayName = "BoulderSlideoverMobile";