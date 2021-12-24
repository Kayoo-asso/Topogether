import React, { useState } from 'react';
import {
  Dropdown,
  GradeScale, Icon, LikeButton, SlideoverMobile,
} from 'components';
import Image from 'next/image';
import { Boulder, Difficulty, UUID } from 'types';
import { topogetherUrl } from 'helpers/globals';
import { buildBoulderGradeHistogram } from 'helpers';
import { TracksList } from '.';

interface BoulderSlideoverMobileProps {
  open?: boolean,
  boulder: Boulder,
  topoCreatorId?: UUID,
  forBuilder?: boolean,
  onClose?: () => void,
}

export const BoulderSlideoverMobile: React.FC<BoulderSlideoverMobileProps> = ({
  open = false,
  forBuilder = false,
  ...props
}: BoulderSlideoverMobileProps) => {
  const [full, setFull] = useState(false);
  const [imageHeight, setImageHeight] = useState(0);
  const [boulderLiked, setBoulderLiked] = useState(false); // To change TODO
  const [displayOfficialTrack, setDisplayOfficialTrack] = useState(true);
  const [boulderMenuOpen, setBoulderMenuOpen] = useState(false);

  const officialTracks = props.boulder.tracks
    ? props.boulder.tracks.filter((track) => track.creatorId === props.topoCreatorId)
    : [];
  const communityTracks = props.boulder.tracks
    ? props.boulder.tracks.filter((track) => track.creatorId !== props.topoCreatorId) : [];

  return (
    <SlideoverMobile
      open
      initialFull={false}
      onSizeChange={(f) => setFull(f)}
      onClose={props.onClose}
    >
      {full && (
        <div 
          className="w-full relative bg-dark rounded-t-lg min-h-[30%] max-h-[45%]"
          style={{
            height: imageHeight+'px'
          }}
        >
          <Image
            src={props.boulder.images[0] ? topogetherUrl + props.boulder.images[0].url : '/assets/img/Kayoo_defaut_image.png'}
            className="rounded-t-lg"
            alt="Boulder"
            priority
            layout="fill"
            objectFit="contain"
            onLoadingComplete={(e) => {
              setImageHeight(e.naturalHeight);
            }}
          />
        </div>
      )}

      <div className={`grid grid-cols-8 p-5 ${full ? '' : ' mt-3'}`}>
        <div className="col-span-6">
          <div className="ktext-section-title">{props.boulder.name}</div>
            {props.boulder.isHighball && full && <div className="ktext-base">High Ball</div>}
            {props.boulder.descent === Difficulty.Dangerous && full && <div className="ktext-base">Descente dangereuse !</div>}
            {!full && (
                <div className="flex items-center mt-2">
                  <GradeScale
                    grades={buildBoulderGradeHistogram(props.boulder)}
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
            <Icon
              name="menu"
              SVGClassName={`h-4 w-4 fill-dark ${boulderMenuOpen ? 'rotate-90' : ''}`}
              center
              onClick={() => {
                setBoulderMenuOpen(!boulderMenuOpen);
              }}
            />
          )}
          {forBuilder && full && boulderMenuOpen &&
              <Dropdown 
                choices={[
                  { value: 'Infos du bloc', action: () => {} },
                  { value: 'Masquer les voies', action: () => {} },
                  { value: 'Supprimer le bloc', action: () => {} },
                ]}
                className='absolute right-[10px] mt-[35px] min-w-[40%]'
              />
            }

          {!full && (
            <div className="w-full relative h-[60px]">
              <Image
                src={props.boulder.images[0] ? topogetherUrl + props.boulder.images[0].url : '/assets/img/Kayoo_defaut_image.png'}
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

      {!forBuilder && (
        <div className="grid grid-cols-8 px-5 ktext-label font-bold my-2">
          <span className={`col-span-2 ${displayOfficialTrack ? 'text-main' : 'text-grey-medium'}`} onClick={() => setDisplayOfficialTrack(true)}>officielles</span>
          <span className={`col-span-2 ${!displayOfficialTrack ? 'text-main' : 'text-grey-medium'}`} onClick={() => setDisplayOfficialTrack(false)}>communautés</span>
          <span className="col-start-8 flex justify-end">
            <Icon
              name="add"
              SVGClassName="w-5 h-5 stroke-main"
              onClick={() => console.log('create community track')} //TODO
            />
          </span>
        </div>
      )}

      <div className="overflow-auto pb-[30px]">
        <TracksList
          tracks={displayOfficialTrack ? officialTracks : communityTracks}
          onTrackClick={(id) => console.log('got to track ')} //TODO
          onBuilderAddClick={() => console.log('create track')} //TODO
        />
      </div>
    </SlideoverMobile>
  );
};
