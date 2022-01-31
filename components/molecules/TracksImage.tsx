import React, { useEffect } from 'react';
import NextImage from 'next/image';
import {
  Image, PointEnum, DrawerToolEnum, Position, Track
} from 'types';
import { SVGTrack } from 'components';
import { staticUrl } from 'helpers/globals';
import useDimensions from 'react-cool-dimensions';
import { getMousePosInside } from '../../helpers';
import { QuarkArray, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';

interface TracksImageProps {
  image: Image,
  tracks: QuarkArray<Track>,
  selectedTrack: SelectQuarkNullable<Track>,
  imageClassName?: string,
  containerClassName?: string,
  canvasClassName?: string,
  displayTracks?: boolean,
  displayPhantomTracks?: boolean,
  displayTracksDetails?: boolean,
  editable?: boolean,
  currentTool?: DrawerToolEnum,
  onImageClick?: (pos: Position) => void,
  onPointClick?: (pointType: PointEnum, index: number) => void,
  onImageLoad?: (width: number, height: number) => void,
}

// NOTES:
// - The useDimensions hook from react-cool-dimensions can be used to dynamically size this component, based on its container
// TODOS:
// - Verify that the useDimensions hook works for dynamically resizing TracksImage
export const TracksImage: React.FC<TracksImageProps> = watchDependencies(({
  displayTracks = true,
  displayPhantomTracks = true,
  displayTracksDetails = false,
  editable = false,
  containerClassName = '',
  ...props
}: TracksImageProps) => {
  const { observe, width: containerWidth, height: containerHeight } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      // Triggered whenever the size of the target is changed...
      console.log("Resizing TracksImage");
      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });

  
  let imgWidth;
  let imgHeight;
  // Only one of those will be set
  let divWidth;
  let divHeight;

  let rx: number;

    const imgRatio = props.image.width / props.image.height;
    if (imgRatio > 1) {
      imgWidth = containerWidth;
      imgHeight = containerWidth / imgRatio;
      divHeight = imgHeight;
    }
    else {
      imgWidth = containerHeight * imgRatio;
      imgHeight = containerHeight;
      divWidth = imgWidth;
    }
    rx = props.image.width != 0
    ? imgWidth / props.image.width
    : 1;

    console.log(containerWidth);
  

  const getCursorUrl = () => {
    let cursorColor = 'grey';
    if (props.selectedTrack()?.grade) cursorColor = props.selectedTrack()!.grade![0];

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
      className={`relative w-full ${containerClassName}`}
      style={{
        height: divHeight,
        minHeight: divHeight,
        width: divWidth,
      }}
    >
      <svg
        style={{ cursor: `url(${getCursorUrl()}) ${props.currentTool === 'ERASER' ? '3 7': ''}, auto` }}
        className={"svg-canvas absolute z-50 " + (props.canvasClassName ? props.canvasClassName : '')}
        width={imgWidth}
        height={imgHeight}
        onMouseDown={(e) => {
          if (e.button === 0 && props.onImageClick && editable && e.target.nodeName === 'svg') { // Left-click on the canvas only
            const pos = getMousePosInside(e);
            const rPos = [pos[0] / rx, pos[1] / rx] as Position;
            props.onImageClick(rPos);
          }
        }}
      >
        {props.tracks.quarks().map(trackQuark => {
          const highlighted = props.selectedTrack() === undefined ||
                trackQuark().id === props.selectedTrack()!.id;           
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
                onLineClick={props.tracks.length > 1 ? () => props.selectedTrack.select(trackQuark) : undefined}
                onPointClick={props.onPointClick}
              />
            )
        })}
      </svg>

      <NextImage
        className={`${props.imageClassName ? props.imageClassName : ''}`}
        src={props.image ? props.image.url : staticUrl.defaultKayoo}
        alt="Rocher"
        width={imgWidth}
        height={imgHeight}
      />
    </div>
  );
});

TracksImage.displayName = "TracksImage";