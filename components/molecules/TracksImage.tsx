import React from 'react';
import NextImage from 'next/image';
import {
  Image, PointEnum, DrawerToolEnum, Position, Track
} from 'types';
import { SVGTrack } from 'components';
import { staticUrl } from 'helpers/globals';
import useDimensions from 'react-cool-dimensions';
import { getMousePosInside } from '../../helpers';
import { Quark, QuarkIter, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';

interface TracksImageProps {
  image: Image,
  tracks: QuarkIter<Quark<Track>>,
  selectedTrack?: SelectQuarkNullable<Track>,
  imageClassName?: string,
  containerClassName?: string,
  programmativeHeight?: number,
  canvasClassName?: string,
  displayTracks?: boolean,
  displayPhantomTracks?: boolean,
  displayTracksDetails?: boolean,
  displayTrackOrderIndexes?: boolean,
  tracksWeight?: number,
  editable?: boolean,
  currentTool?: DrawerToolEnum,
  onImageClick?: (pos: Position) => void,
  onPointClick?: (pointType: PointEnum, index: number) => void,
  onImageLoad?: (width: number, height: number) => void,
}

export const TracksImage: React.FC<TracksImageProps> = watchDependencies(({
  displayTracks = true,
  displayPhantomTracks = true,
  displayTracksDetails = false,
  displayTrackOrderIndexes = true,
  tracksWeight = 2,
  editable = false,
  containerClassName = '',
  ...props
}: TracksImageProps) => {
  const { observe, width: containerWidth, height: containerHeight } = useDimensions({});

  const selectedTrack = props.selectedTrack && props.selectedTrack();
  
  let imgWidth;
  let imgHeight;
  const containerR = containerHeight > 0 ? containerWidth / containerHeight : 0;
  const imageR = props.image.width / props.image.height;
  if (imageR > containerR) {
    imgWidth = containerWidth;
    imgHeight = props.image.height * (containerWidth / props.image.width);
  }
  else {
    imgHeight = containerHeight;
    imgWidth = props.image.width * (containerHeight / props.image.height);
  }
  const rx = props.image.width != 0
  ? imgWidth / props.image.width
  : 1;

  const getCursorUrl = () => {
    let cursorColor = 'grey';
    if (selectedTrack?.grade) cursorColor = selectedTrack.grade![0];

    let cursorUrl = '/assets/icons/colored/';
    switch (props.currentTool) {
      case 'LINE_DRAWER':
        cursorUrl += `line-point/_line-point-${cursorColor}.svg`; break;
      case 'ERASER':
        cursorUrl += '_eraser-main.svg'; break;
      case 'HAND_DEPARTURE_DRAWER':
        cursorUrl += `hand-full/_hand-full-${cursorColor}.svg`; break;
      case 'FOOT_DEPARTURE_DRAWER':
        cursorUrl += `climbing-shoe-full/_climbing-shoe-full-${cursorColor}.svg`; break;
      case 'FORBIDDEN_AREA_DRAWER':
        cursorUrl += '_forbidden-area-second.svg'; break;
    }
    return cursorUrl;
  };

  return (
    <div
      ref={observe}
      className={`relative w-full flex flex-row items-center justify-center ${containerClassName}`}
      style={props.programmativeHeight ? {
        height: props.programmativeHeight + 'px'
      } : {}}
    >
      <svg
        style={{ 
          cursor: editable ? `url(${getCursorUrl()}) ${props.currentTool === 'ERASER' ? '3 7': ''}, auto` : '',
        }}
        className={"svg-canvas absolute z-50 " + (props.canvasClassName ? props.canvasClassName : '')}
        width={imgWidth}
        height={imgHeight}
        onMouseDown={(e) => {
          if (e.button === 0 && props.onImageClick && editable && e.currentTarget.nodeName === 'svg') { // Left-click on the canvas only
            const pos = getMousePosInside(e);
            const rPos = [pos[0] / rx, pos[1] / rx] as Position;
            props.onImageClick(rPos);
          }
        }}
      >
        {props.tracks.map(trackQuark => {
          const highlighted = selectedTrack === undefined ||
                trackQuark().id === selectedTrack.id;           
          if (highlighted || displayPhantomTracks) 
            return (
              <SVGTrack 
                key={trackQuark().id}
                track={trackQuark}
                r={rx}
                currentTool={props.currentTool}
                imageId={props.image.id}
                editable={editable}
                highlighted={highlighted}
                displayTrackDetails={displayTracksDetails}
                displayTrackOrderIndexes={displayTrackOrderIndexes}
                trackWeight={tracksWeight}
                onLineClick={props.selectedTrack ? () => props.selectedTrack!.select(trackQuark) : undefined}
                onPointClick={props.onPointClick}
              />
            )
        })}
      </svg>

      <NextImage
        className={`${props.imageClassName ? props.imageClassName : ''}`}
        src={props.image ? props.image.path : staticUrl.defaultKayoo}
        alt="Rocher"
        width={imgWidth}
        height={imgHeight}
        priority
      />
    </div>
  );
});

TracksImage.displayName = "TracksImage";