import React, { useMemo, useState } from 'react';
import {
  GradeScale, Icon, LikeButton, SlideoverMobile, TracksImage, Show,
} from 'components';
import {
 Boulder, Difficulty, gradeToLightGrade, Track, UUID,
} from 'types';
import { buildBoulderGradeHistogram, staticUrl } from 'helpers';
import { default as NextImage } from 'next/image';
import { Quark, watchDependencies, SelectQuarkNullable } from 'helpers/quarky';
import { TracksList } from '..';

interface BoulderSlideoverMobileProps {
  boulder: Quark<Boulder>,
  open?: boolean,
  selectedTrack: SelectQuarkNullable<Track>,
  topoCreatorId?: UUID,
  onSelectTrack: (selected: Quark<Track>) => void,
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
};

export const BoulderSlideoverMobile: React.FC<BoulderSlideoverMobileProps> = watchDependencies(({
  open = true,
  ...props
}: BoulderSlideoverMobileProps) => {
  const [full, setFull] = useState(false);
  const [boulderLiked, setBoulderLiked] = useState(false); // To change TODO
  const [officialTrackTab, setOfficialTrackTab] = useState(true);

  const boulder = props.boulder();
  const selectedTrack = props.selectedTrack();

  const displayedTracks = useMemo(
() => boulder.tracks
    .quarks()
    .filter((track) => ((track().creatorId) === props.topoCreatorId) === officialTrackTab),
    [boulder.tracks, props.topoCreatorId, officialTrackTab],
);

  return (
    <SlideoverMobile
      open
      initialFull={false}
      onSizeChange={(f) => setFull(f)}
    >
      {/* BOULDER IMAGE */}
      {full && (
        <div className="w-full bg-dark rounded-t-lg flex items-center justify-center overflow-hidden">
          <TracksImage
            image={boulder.images[0]}
            containerClassName="w-full"
            tracks={boulder.tracks}
            currentTrackId={selectedTrack?.id}
            displayTracksDetails={!!selectedTrack?.id}
          />
        </div>
      )}

      {/* BOULDER INFOS */}
      <Show when={() => !selectedTrack}>
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
              <LikeButton
                liked={boulderLiked}
                onClick={() => {
                  setBoulderLiked(!boulderLiked);
                }}
              />
            )}

            {!full && (
              <div className="w-full relative h-[60px]">
                <NextImage
                  src={boulder.images[0] ? boulder.images[0].url : staticUrl.defaultKayoo}
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
      </Show>

      {/* TRACK INFOS */}
      {/* TODO: abstract this into its own component? */}
      <Show when={() => props.selectedTrack()}>
        {(track) => (
          <div className={`grid grid-cols-8 p-5 items-center ${full ? '' : ' mt-3'}`}>
            <div className="col-span-1 pr-3">
              {track.grade
                && (
                <div className={`ktext-subtitle float-right ${gradeColors[gradeToLightGrade(track.grade)]}`}>
                  {track.grade}
                </div>
)}
            </div>

            <div className="col-span-6">
              <div className="ktext-section-title">{track.name}</div>
            </div>

            <div className="col-span-1">
              <Icon name="flag" />
            </div>

            <div className="col-start-2 col-span-4">
              {track.isTraverse && full && <div className="ktext-base-little">Traversée</div>}
              {track.isSittingStart && full && <div className="ktext-base-little">Départ assis</div>}
            </div>

            <div className="col-span-3 flex content-end">
              Etoiles
              {/* TODO */}
            </div>
          </div>
        )}
      </Show>

      {/* TODO : show once good pattern */}
      {/* TABS */}
      <Show when={() => !props.selectedTrack}>
        <div className="grid grid-cols-8 px-5 ktext-label font-bold my-2">
          <span className={`col-span-2 ${officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(true)}>officielles</span>
          <span className={`col-span-2 ${!officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(false)}>communautés</span>
          <span className="col-start-8 flex justify-end">
            <Icon
              name="add"
              SVGClassName="w-5 h-5 stroke-main"
              onClick={() => console.log('create community track')} // TODO
            />
          </span>
        </div>
      </Show>

      {/* TRACKSLIST */}
      <Show when={() => [!selectedTrack, full] as const}>
        <div className="overflow-auto pb-[30px]">
          <TracksList
            tracks={displayedTracks}
            onTrackClick={props.selectedTrack.select}
          />
        </div>
      </Show>

      {/* TRACK DETAILS */}
      <Show when={() => [full, props.selectedTrack()] as const}>
        {([, track]) => (
          <div className="grid grid-cols-9 p-5 items-center">

            <div className="col-span-full mb-6">
              {track.description}
            </div>

            <div className="col-span-3">
              <div className="ktext-subtitle">Techniques</div>

            </div>

            <div className="col-span-3">
              <div className="ktext-subtitle">Réception</div>
            </div>

            <div className="col-span-3">
              <div className="ktext-subtitle">Orientation</div>
            </div>
          </div>
        )}
      </Show>

    </SlideoverMobile>
  );
});
