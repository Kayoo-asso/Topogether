import React, { CSSProperties, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import {
  Image, PointEnum, DrawerToolEnum, Position, Track
} from 'types';
import { Quark, QuarkIter, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { CFImage } from 'components/atoms/CFImage';
import { SourceSize } from 'helpers/variants';
import { SVGTrack } from 'components/atoms';
import { getCoordsInViewbox, Portal } from 'helpers';

type TracksImageProps = React.PropsWithChildren<{
  image?: Image,
  tracks: QuarkIter<Quark<Track>>,
  selectedTrack?: SelectQuarkNullable<Track>,
  // 'fill' could be possible, but it distorts the aspect ratio
  objectFit?: 'contain' | 'cover',
  sizeHint: SourceSize,
  displayTracks?: boolean,
  displayPhantomTracks?: boolean,
  displayTracksDetails?: boolean,
  displayTrackOrderIndexes?: boolean,
  tracksWeight?: number,
  editable?: boolean,
  modalable?: boolean,
  currentTool?: DrawerToolEnum,
  onImageClick?: (pos: Position) => void,
  onPointClick?: (pointType: PointEnum, index: number) => void,
  onImageLoad?: (width: number, height: number) => void,
}>

// see: https://www.sarasoueidan.com/blog/svg-object-fit/
const preserveAspectRatio = {
  contain: 'meet',
  cover: 'slice',
  // fill: 'none'
}

export const viewBoxHeight = 4096;
export const defaultTracksWeight = viewBoxHeight * 0.007;

export const TracksImage: React.FC<TracksImageProps> = watchDependencies(({
  displayTracks = true,
  displayPhantomTracks = true,
  displayTracksDetails = false,
  displayTrackOrderIndexes = true,
  tracksWeight = defaultTracksWeight,
  objectFit = 'contain',
  editable = false,
  ...props
}: TracksImageProps) => {
  const selectedTrack = props.selectedTrack && props.selectedTrack();
  // ratio = width / height
  // so the most accurate way to scale the SVG viewBox is to set a height
  // and take width = ratio * height (multiplication is better than division)
  const ratio = props.image?.ratio ?? 1;
  const viewBoxRef = useRef<SVGRectElement>(null);
  const [vb, setVb] = useState<SVGRectElement | null>();
  useEffect(() => {
    console.log('effect');
    console.log(viewBoxRef.current)
    setVb(viewBoxRef.current);
  }, [viewBoxRef.current]);
  
  const viewBoxWidth = ratio * viewBoxHeight;

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

  const cursorStyle: CSSProperties = {
    cursor: editable ? `url(${getCursorUrl()}) ${props.currentTool === 'ERASER' ? '3 7' : ''}, auto` : '',
  }

  const [portalOpen, setPortalOpen] = useState(false);
  const wrapPortal = (elts: ReactElement<any, any>) => {
    if (props.modalable && props.image) {
      return (
        <>
          {elts}
          <Portal open={portalOpen}>
            <div className="absolute top-0 left-0 flex z-full w-screen h-screen bg-black bg-opacity-80" onClick={() => setPortalOpen(false)}>
              {elts}
            </div>
          </Portal>
        </>
    )}
    else return elts;
  }
  
  // Explanation of how this works:
  // - width=100%, height=100% on everything, to let the consumer decide how to size the image
  // - a wrapper with `position: relative` to anchor the SVG canvas, that uses `position: absolute`, in its top left corner
  //   (this allows the SVG canvas to overlap with the image)
  // - use object-fit to size the image
  // - produce a viewBox with the same aspect ratio as the original image
  // - the SVG canvas is forced to fully fit the viewBox within its block, following the method given by `preserveAspectRatio`
  // - see the following article on how to match values of `object-fit` <-> `preserveAspectRatio`:
  //   https://www.sarasoueidan.com/blog/svg-object-fit/
  //
  // Result:
  // An image and a SVG viewBox that always perfectly match, while respecting the dimensions of the parent container
  // & the provided object-fit. The viewBox has constant width and height for the same image, so everything drawn
  // on the image can be expressed in the coordinate space of the viewBox & resizes automatically
  return (
    wrapPortal(
      <div className={"relative h-full" + ((props.modalable && props.image || props.onImageClick) ? " cursor-pointer" : "")}>
        <CFImage
          objectFit={objectFit}
          sizeHint={portalOpen ? '100vw' : props.sizeHint}
          image={props.image}
          alt={"Rocher avec tracé de voies"}
          className="flex"
        />
        <svg
          className='absolute top-0 left-0 h-full w-full z-50'
          style={cursorStyle}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio={`xMidYMid ${preserveAspectRatio[objectFit]}`}
          onClick={useCallback((e) => {
            const eltUnder = e.target as EventTarget & SVGSVGElement;         
            if (eltUnder.nodeName === "svg" && props.modalable) setPortalOpen(true);
            else {
              console.log(viewBoxRef.current);
              // Handle clicks that are 1) left-click, 2) in the viewBox and 3) on the SVG canvas directly
              if (e.buttons !== 0 || !props.onImageClick || !viewBoxRef.current) return;
              console.log('2');
              const coords = getCoordsInViewbox(viewBoxRef.current, viewBoxWidth, viewBoxHeight, e.clientX, e.clientY);
              if (coords) props.onImageClick(coords);
            }
          }, [props.onImageClick, props.modalable])}
        >
          {/* Invisible rectangle of the size of the viewBox, to get its on-screen dimensions easily
              (they could also be computed, but I'm lazy)
              Another dev: I'm lazy too. Leave the rectangle.
          */}
          <rect 
            ref={viewBoxRef} 
            x={0} 
            y={0} 
            width={viewBoxWidth} 
            height={viewBoxHeight} 
            visibility='hidden' 
          />

          {props.image && props.tracks.map(trackQuark => {
            const highlighted = selectedTrack === undefined ||
              trackQuark().id === selectedTrack.id;
            if (highlighted || displayPhantomTracks)
              return (
                <SVGTrack
                  key={trackQuark().id}
                  track={trackQuark}
                  currentTool={props.currentTool}
                  imageId={props.image!.id}
                  editable={editable}
                  vb={vb}
                  vbWidth={viewBoxWidth}
                  vbHeight={viewBoxHeight}
                  highlighted={highlighted}
                  displayTrackDetails={displayTracksDetails}
                  displayTrackOrderIndexes={displayTrackOrderIndexes}
                  trackWeight={tracksWeight}
                  onLineClick={props.selectedTrack ? () => props.selectedTrack!.select(trackQuark) : undefined}
                  onPointClick={props.onPointClick}
                />
              )
          }).toArray()}
          {props.image && props.children}

        </svg>
      </div>
    )
  );
});

TracksImage.displayName = "TracksImage";