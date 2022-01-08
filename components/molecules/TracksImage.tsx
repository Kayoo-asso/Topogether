import React from 'react';
import NextImage from 'next/image';
import {
  Image, 
  PointEnum, AreaEnum, DrawerToolEnum, Position, Line, UUID, gradeToLightGrade, LinearRing,
  LightGrade, 
  Track
} from 'types';
import { SVGArea } from 'components';
import { staticUrl } from 'helpers/globals';
import useDimensions from 'react-cool-dimensions';
import {
  getMousePosInside,
  getPathFromPoints,
} from '../../helpers';

interface TracksImageProps {
  image: Image,
  tracks: Iterable<Track>,
  imageClassName?: string,
  tracksClassName?: string,
  containerClassName?: string,
  displayTracks?: boolean,
  displayPhantomTracks?: boolean,
  displayTracksNumber?: boolean,
  displayTracksDetails?: boolean,
  editable?: boolean,
  currentTrackId?: UUID,
  currentTool?: DrawerToolEnum,
  onImageClick?: (pos: Position) => void,
  onPointClick?: (pointType: PointEnum, index: number) => void,
  onPolylineClick?: (line: Line) => void,
  onAreaChange?: (areaType: AreaEnum, index: number, area: LinearRing) => void,
  onImageLoad?: (width: number, height: number) => void,
}

// NOTES:
// - The useDimensions hook from react-cool-dimensions can be used to dynamically size this component, based on its container
// TODOS:
// - Verify that all the SVG elems are positioned correctly by taking into account their width / radius when setting x,y attributes
// - Verify that clicking on the SVG canvas works properly
// - Verify that clicking on interactive SVG elements does not propagate to canvas
// - Verify that onPointClick / onPolyLineClick / onAreaChange work as expected
// - Verify that the useDimensions hook works for dynamically resizing TracksImage
// - Verify that the SVG canvas and the image overlap correctly
export const TracksImage: React.FC<TracksImageProps> = ({
  tracksClassName = 'stroke-main',
  displayTracks = true,
  displayPhantomTracks = true,
  displayTracksNumber = true,
  displayTracksDetails = false,
  editable = false,
  containerClassName = 'w-[300px] h-[300px]',
  ...props
}: TracksImageProps) => {

  const { observe, unobserve, width: containerWidth, height: containerHeight, entry } = useDimensions({
    onResize: ({ observe, unobserve, width, height, entry }) => {
      // Triggered whenever the size of the target is changed...
      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });

  let imgWidth;
  let imgHeight;
  // Only one of those will be set
  let divWidth;
  let divHeight;

  const imgRatio = props.image.width / props.image.height;

  // Original: width > height
  // We fit width and set the height accordingly
  if (imgRatio > 1) {
    imgWidth = containerWidth;
    imgHeight = containerWidth * 1 / imgRatio;
    divHeight = imgHeight;
  }
  // Original: height > width
  // We fight height and set the width accordingly
  else {
    imgWidth = containerHeight * imgRatio;
    imgHeight = containerHeight;
    divWidth = imgWidth;
  }

  const rx = props.image.width != 0
    ? imgWidth / props.image.width
    : 1;
  const ry = props.image.height != 0
    ? imgHeight / props.image.height
    : 1;

  const svgElems: JSX.Element[] = [];
  const svgScaleClass = props.currentTool === 'ERASER'
    ? 'scale-125'
    : '';

  // const [lines, currentTrack] = getLines(props.tracks, props.image.id, props.currentTrackId);
  let currentTrack: Track | undefined = undefined;

  for (const track of props.tracks) {
    if (track.id === props.currentTrackId) {
      currentTrack = track;
    }

    const gradeColorSuffix = gradeColor(track);

    let isFirstLine = true; // don't forget to set to false at the end of the loop!
    for (const line of track.lines) {

      if (line.imageId !== props.image.id) {
        continue;
      }

      const isHighlighted = props.currentTrackId === undefined
        || track.id === props.currentTrackId;

      const points: Position[] = line.points.map((p) => [p[0] * rx, p[1] * ry]);
      const path = getPathFromPoints(points, 'CURVE');
      const firstX = points[0][0] * rx;
      const firstY = points[0][1] * ry;

      const lineBaseCss = isHighlighted
        ? 'z-30'
        : displayPhantomTracks ? 'z-10 opacity-40' : 'hidden';
      const tracksNumberBaseCss = isHighlighted
        ? 'z-40'
        : displayPhantomTracks ? 'z-20 opacity-40' : 'hidden';

      // Draw line
      svgElems.push(
        <path
          className={`${lineBaseCss} ${tracksClassName} ${props.onPolylineClick && 'cursor-pointer'}`}
          strokeWidth={3 * rx}
          d={path}
          onClick={() => props.onPolylineClick && props.onPolylineClick(line)}
        />,
      );

      // Draw point circles
      const pointRadius = 3 * rx;
      const pointCircles = points.map((x) => (
        <circle
          className="pointer-events-auto"
          cx={x[0] * rx}
          cy={x[1] * ry}
          r={pointRadius}
        />
      ));

      // TODO: optimise this
      svgElems.push(...pointCircles);

      // Track number in the ordering
      if (displayTracksNumber) {
        svgElems.push(
          <circle
            cx={firstX}
            cy={firstY}
            r={9}
            className={`${tracksNumberBaseCss} ${props.onPolylineClick && 'cursor-pointer pointer-events-auto'}`}
            onClick={() => props.onPolylineClick && props.onPolylineClick(line)}
          />,
          <text
            x={firstX}
            y={firstY}
            className={`${tracksNumberBaseCss} ${props.onPolylineClick && 'cursor-pointer'}`}
            textAnchor="middle"
            stroke="white"
            strokeWidth="1px"
            fontSize="8px"
            dy="3px"
            onClick={() => props.onPolylineClick && props.onPolylineClick(line)}
          >
            {track.orderIndex}
          </text>,
        );
      }

      // Hand and feet departures
      // Only render hand and feet departures for the first line of a track
      // TODO: try out SVG imports instead
      // TODO: onClick handlers. Is passing the index really the best solution here?
      if (isFirstLine && displayTracksDetails && isHighlighted) {
        if (line.handDepartures) {
          for (const [handX, handY] of line.handDepartures) {
            svgElems.push(
              <image
                className={svgScaleClass}
                href={`assets/icons/colored/hand-full/_hand-full-${gradeColorSuffix}.svg`}
                width={18 * rx}
                x={handX * rx}
                y={handY * ry}
              />,
            );
          }
        }
        if (line.feetDepartures) {
          for (const [footX, footY] of line.feetDepartures) {
            svgElems.push(
              <image
                className={svgScaleClass}
                href={`assets/icons/colored/climbing-shoe-full/_climbing-shoe-full-${gradeColorSuffix}.svg`}
                width={30 * rx}
                x={footX * rx}
                y={footY * ry}
              />,
            );
          }
        }
      }

      // Forbidden areas
      if (displayTracksDetails && isHighlighted && line.forbidden) {
        for (let areaIdx = 0; areaIdx < line.forbidden.length; areaIdx++) {
          const area = line.forbidden[areaIdx];
          svgElems.push(
            <SVGArea
              className={svgScaleClass}
              area={area}
              editable={editable}
              rx={rx}
              ry={ry}
              pointSize={6 * rx}
              // TODO: do we need to handle clicks on area points?
              // You can already drag to resize
              // Maybe to remove them?
              // need to call props.onPointClick('FORBIDDEN_AREA_POINT', areaIdx)
              onChange={(area) => props.onAreaChange && props.onAreaChange('FORBIDDEN_AREA', areaIdx, area)}
            />,
          );
        }
      }

      isFirstLine = false;
    }
  }

  const getCursorUrl = () => {
    let cursorColor = 'grey';
    if (currentTrack?.grade) { cursorColor = currentTrack.grade[0] || 'grey'; }

    let cursorUrl = '/assets/icons/colored/';
    switch (props.currentTool) {
      case 'LINE_DRAWER':
        cursorUrl += `line-point/_line-point-${cursorColor}.svg`; break;
      case 'ERASER':
        cursorUrl += '_eraser-main.svg'; break;
      case 'HAND_DEPARTURE_DRAWER':
        cursorUrl += `hand-full/_hand-full-${cursorColor}.svg`; break;
      case 'FOOT_DEPARTURE_DRAWER':
        cursorUrl += `climbing-shoe-full/climbing-shoe-full-${cursorColor}.svg`; break;
      case 'FORBIDDEN_AREA_DRAWER':
        cursorUrl += '_forbidden-area-second.svg'; break;
    }
    return cursorUrl;
  };

  return (
    <div
      ref={observe}
      className={`relative max-h-content ${containerClassName}`}
      style={{
        maxHeight: divHeight,
        maxWidth: divWidth,
      }}
    >
      <svg
        style={{ cursor: `url(${getCursorUrl()}), auto` }}
        className="svg-canvas absolute"
        width={imgWidth}
        height={imgHeight}
        onMouseDown={(e) => {
          if (e.button === 0 && props.onImageClick && editable) { // Left-click on the canvas only
            const pos = getMousePosInside(e);
            props.onImageClick(pos);
          }
        }}
      >
        {svgElems}
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
};

type LineOnImage = Line & TrackInfo;

type TrackInfo = {
  trackId: UUID,
  isStart: boolean,
  // TODO: remove "None"
  gradeColor: LightGrade | 'grey',
  orderIndex: number,
};

function getLines(tracks: Iterable<Track>, imageId: UUID, currentTrackId?: UUID): [LineOnImage[], Track | undefined] {
  const lines: LineOnImage[] = [];
  let currentTrack: Track | undefined = undefined;

  for (const track of tracks) {
    if (track.id === currentTrackId)
      currentTrack = track;

    let i = 0;
    for (const line of track.lines) {
      if (line.imageId !== imageId) continue;

      lines.push({
        trackId: track.id,
        isStart: i === 0,
        gradeColor: track.grade ? gradeToLightGrade(track.grade) : 'grey',
        orderIndex: track.orderIndex,
        ...line,
      });
      i += 1;
    }

  }
  return [lines, currentTrack];
}

function gradeColor(track: Track) {
  return track.grade ? gradeToLightGrade(track.grade) : 'grey';
}