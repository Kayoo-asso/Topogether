import React, { useEffect, useRef, useState } from 'react';
import { default as NextImage } from 'next/image';
import {
  Polygon, Point, Image, LineString, Track,
  PointEnum, AreaEnum, DrawerToolEnum, Position, LineCoords, Line, ImageDimensions, UUID, gradeToLightGrade, LinearRing,
  LightGrade
} from 'types';
import { SVGArea } from 'components';
import { staticUrl, topogetherUrl } from 'helpers/globals';
import {
  getMousePosInside,
  getPathFromPoints,
} from '../../helpers';

interface TracksImageProps {
  image: Image,
  tracks: Track[],
  dimensions: ImageDimensions,
  tracksClassName?: string,
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
  onImageLoad?: (e: {
    naturalWidth: number;
    naturalHeight: number;
  }) => void,
};


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
  displayTracksDetails = true,
  editable = false,
  ...props
}: TracksImageProps) => {

  // We use props.dimensions often, so a shorter name is nice
  const dimensions = props.dimensions;
  const [naturalDims, setNaturalDims] = useState<ImageDimensions>({ width: 0, height: 0 });
  const rx = naturalDims.width != 0
    ? dimensions.width / naturalDims.width
    : 1;
  const ry = naturalDims.height != 0
    ? dimensions.height / naturalDims.height
    : 1;

  const svgElems: JSX.Element[] = [];
  const svgScaleClass = props.currentTool === 'ERASER'
    ? 'scale-125'
    : '';

  const linesOnImage = sortLines(props.tracks, props.image.id);

  for (let lineIdx = 0; lineIdx < linesOnImage.length; lineIdx++) {
    const line = linesOnImage[lineIdx];
    
    if (line.points.length == 0) {
      continue;
    }

    const isHighlighted =
      props.currentTrackId === undefined ||
      line.trackId === props.currentTrackId;

    const points: Position[] = line.points.map(p => [p[0] * rx, p[1] * ry]);
    const path = getPathFromPoints(points, 'CURVE');
    const firstX = points[0][0] * rx;
    const firstY = points[0][1] * ry;

    const lineBaseCss = isHighlighted
      ? "z-30"
      : displayPhantomTracks ? "z-10 opacity-40" : "hidden";
    const tracksNumberBaseCss = isHighlighted
      ? "z-40"
      : displayPhantomTracks ? "z-20 opacity-40" : "hidden";

    // Draw line
    svgElems.push(
      <path
        className={`${lineBaseCss} ${tracksClassName} ${props.onPolylineClick && 'cursor-pointer'}`}
        strokeWidth={3 * rx}
        d={path}
        onClick={() => props.onPolylineClick && props.onPolylineClick(line)}
      />
    );

    // Draw point circles
    const pointRadius = 3 * rx;
    const pointCircles = points.map(x =>
      <circle
        className="pointer-events-auto"
        cx={x[0] * rx}
        cy={x[1] * ry}
        r={pointRadius}
      />
    );

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
          {line.trackNb}
        </text >
      );
    }

    // Hand and feet departures
    // Only render hand and feet departures for the first line of a track
    // TODO: try out SVG imports instead
    // TODO: onClick handlers. Is passing the index really the best solution here?
    if (line.isStart && displayTracksDetails && isHighlighted) {
      for (const [handX, handY] of line.handDepartures) {
        svgElems.push(
          <image
            className={svgScaleClass}
            href={`assets/icons/colored/hand-full/_hand-full-${line.gradeSuffix}.svg`}
            width={18 * rx}
            x={handX * rx}
            y={handY * ry}
          />
        );
      }
      for (const [footX, footY] of line.feetDepartures) {
        svgElems.push(
          <image
            className={svgScaleClass}
            href={`assets/icons/colored/climbing-shoe-full/_climbing-shoe-full-${line.gradeSuffix}.svg`}
            width={30 * rx}
            x={footX * rx}
            y={footY * ry}
          />
        )
      }
    }

    // Forbidden areas
    if (displayTracksDetails && isHighlighted) {
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
          />
        )
      }
    }
  }

  const getCursorUrl = () => {
    let cursorColor = 'grey';
    const currentTrack = props.tracks.find((track) => track.id === props.currentTrackId);
    if (currentTrack?.grade) { cursorColor = currentTrack.grade[0] || 'grey'; }

    let cursorUrl = '/assets/icons/colored/';
    switch (props.currentTool) {
      case 'LINE_DRAWER':
        cursorUrl += `line-point/_line-point-${cursorColor}.svg`; break;
      case 'ANCHOR_DRAWER':
        cursorUrl += `quickdraw/_quickdraw-${cursorColor}.svg`; break;
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
    <>
      <svg
        style={{ cursor: `url(${getCursorUrl()}), auto` }}
        className="svg-canvas"
        width={dimensions.width}
        height={dimensions.height}
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
        className="-mt-[100%]"
        src={props.image ? (topogetherUrl + props.image.url) : staticUrl.defaultKayoo}
        alt="Rocher"
        width={dimensions.width}
        height={dimensions.height}
        onLoadingComplete={(e) => {
          setNaturalDims({
            width: e.naturalWidth,
            height: e.naturalHeight
          });
          if (props.onImageLoad) props.onImageLoad(e);
        }}
      />
    </>
  );
};

type LineOnImage = Line & {
  isStart: boolean,
  // TODO: remove "None"
  gradeSuffix: LightGrade | 'grey',
  trackNb: number,
};

function sortLines(tracks: Track[], imageId: UUID): LineOnImage[] {
  const lines: LineOnImage[] = [];
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const lineIdx = track.lines.findIndex(x => x.imageId === imageId);
    if (lineIdx < 0) {
      continue;
    }

    lines.push({
      isStart: lineIdx === 0,
      gradeSuffix: track.grade ? gradeToLightGrade(track.grade) : 'grey',
      trackNb: track.orderIndex,
      ...track.lines[lineIdx]
    });
  }
  lines.sort(compareLineStarts);
  return lines;
}

const compareLineStarts = (a: Line, b: Line): number => {
  // TODO: clean up
  if (a.points.length === 0 || b.points.length === 0) {
    return 0;
  }
  const aStartX = a.points[0][0];
  const bStartX = b.points[0][0];
  return aStartX - bStartX;
}