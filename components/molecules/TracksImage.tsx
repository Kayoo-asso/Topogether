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
  ratioPoint,
} from '../../helpers';
import { QuarkArray, SelectQuarkNullable } from 'helpers/quarky';

interface TracksImageProps {
  image: Image,
  tracks: QuarkArray<Track>,
  selectedTrack: SelectQuarkNullable<Track>,
  imageClassName?: string,
  containerClassName?: string,
  displayTracks?: boolean,
  displayPhantomTracks?: boolean,
  displayTracksNumber?: boolean,
  displayTracksDetails?: boolean,
  editable?: boolean,
  currentTool?: DrawerToolEnum,
  onImageClick?: (pos: Position) => void,
  onPointClick?: (pointType: PointEnum, index: number) => void,
  onPolylineClick?: (line: Line) => void,
  onAreaChange?: (areaType: AreaEnum, index: number, area: LinearRing) => void,
  onImageLoad?: (width: number, height: number) => void,
}

const getColorNumber = (track: Track) => {
  return track.grade ? gradeToLightGrade(track.grade) : 'grey';
}
const getFillColorClass = (track: Track) => {
  if (!track.grade) return 'fill-grey-light';
  else {
    const lightGrade = gradeToLightGrade(track.grade);
    switch (lightGrade) {
      case 3:
          return 'fill-grade-3';
      case 4:
          return 'fill-grade-4';
      case 5:
          return 'fill-grade-5';
      case 6:
          return 'fill-grade-6';
      case 7:
          return 'fill-grade-7';
      case 8:
          return 'fill-grade-8';
      case 9:
          return 'fill-grade-9';
    }
  }
}
const getStrokeColorClass = (track: Track) => {
  if (!track.grade) return 'stroke-grey-light';
  else {
    const lightGrade = gradeToLightGrade(track.grade);
    switch (lightGrade) {
      case 3:
          return 'stroke-grade-3';
      case 4:
          return 'stroke-grade-4';
      case 5:
          return 'stroke-grade-5';
      case 6:
          return 'stroke-grade-6';
      case 7:
          return 'stroke-grade-7';
      case 8:
          return 'stroke-grade-8';
      case 9:
          return 'stroke-grade-9';
    }
  }
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
  displayTracks = true,
  displayPhantomTracks = true,
  displayTracksNumber = true,
  displayTracksDetails = false,
  editable = false,
  containerClassName = '',
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
    imgHeight = containerWidth / imgRatio;
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

  let currentTrack: Track | undefined = undefined;
  for (const track of props.tracks) {
    if (props.selectedTrack && props.selectedTrack() && track.id === props.selectedTrack()!.id) currentTrack = track;
    let isFirstLine = true; // don't forget to set to false at the end of the loop!

    for (const line of track.lines) {
      if (line.imageId !== props.image.id) {
        continue;
      }

      const isHighlighted = !props.selectedTrack
        || props.selectedTrack() === undefined
        || track.id === props.selectedTrack()!.id;

      const points: Position[] = line.points.map((p) => ratioPoint(p, rx));
      const path = getPathFromPoints(points, 'CURVE');
      const firstX = points[0][0];
      const firstY = points[0][1];

      const lineBaseCss = isHighlighted
        ? 'z-30'
        : displayPhantomTracks ? 'z-10 opacity-60' : 'hidden';
      const tracksNumberBaseCss = isHighlighted
        ? 'z-40'
        : displayPhantomTracks ? 'z-20 opacity-60' : 'hidden';

      // Draw line
      svgElems.push(
        <path
          key={'path'+line.id}
          className={`fill-[none] ${getStrokeColorClass(track)} stroke-2 ${lineBaseCss}${props.onPolylineClick ? ' cursor-pointer' : ''}`}
          d={path}
          onClick={() => {
            // TODO bug with line (always the same one)
            props.onPolylineClick && props.onPolylineClick(line)}}
        />,
      );

      // Draw point circles
      if (editable) {
        const pointRadius = 3;
        const pointCircles = points.map((x, index) => (
          <circle
            key={index+line.id+x[0]+','+x[1]}
            className={"pointer-events-auto " + getFillColorClass(track)}
            cx={x[0]}
            cy={x[1]}
            r={pointRadius}
          />
        ));
        // TODO: optimise this
        svgElems.push(...pointCircles);
      }

      // Track number in the ordering
      if (displayTracksNumber) {
        svgElems.push(
          <circle
            key={'circle'+line.id}
            cx={firstX}
            cy={firstY}
            r={9}
            className={`${getFillColorClass(track)} ${tracksNumberBaseCss}${props.onPolylineClick ? ' cursor-pointer pointer-events-auto' : ''}`}
            onClick={() => props.onPolylineClick && props.onPolylineClick(line)}
          />,
          <text
            key={'text'+line.id}
            x={firstX}
            y={firstY}
            className={`${tracksNumberBaseCss}${props.onPolylineClick ? ' cursor-pointer' : ''}`}
            textAnchor="middle"
            stroke="white"
            strokeWidth="1px"
            fontSize="8px"
            dy="3px"
            onClick={() => props.onPolylineClick && props.onPolylineClick(line)}
          >
            {track.orderIndex + 1}
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
                href={`/assets/icons/colored/hand-full/_hand-full-${getColorNumber(track)}.svg`}
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
                href={`/assets/icons/colored/climbing-shoe-full/_climbing-shoe-full-${getColorNumber(track)}.svg`}
                x={footX * rx}
                y={footY * ry}
              />,
            );
          }
        }
      }

      // Forbidden areas
      if (displayTracksDetails && isHighlighted && line.forbidden) {
        for (let i = 0; i < line.forbidden.length; i++) {
          const area = line.forbidden[i];
          svgElems.push(
            <SVGArea
              className={svgScaleClass}
              area={area}
              editable={editable}
              rx={rx}
              ry={ry}
              pointSize={6}
              // TODO: do we need to handle clicks on area points?
              // You can already drag to resize
              // Maybe to remove them?
              // need to call props.onPointClick('FORBIDDEN_AREA_POINT', areaIdx)
              onChange={(area) => props.onAreaChange && props.onAreaChange('FORBIDDEN_AREA', i, area)}
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
        cursorUrl += `climbing-shoe-full/_climbing-shoe-full-${cursorColor}.svg`; break;
      case 'FORBIDDEN_AREA_DRAWER':
        cursorUrl += '_forbidden-area-second.svg'; break;
    }
    return cursorUrl;
  };

  return (
    <div
      ref={observe}
      className={`relative max-h-content w-full ${containerClassName}`}
      style={{
        height: divHeight,
        width: divWidth,
      }}
    >
      <svg
        style={{ cursor: `url(${getCursorUrl()}), auto` }}
        className="svg-canvas absolute z-50"
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