import React from 'react';
import NextImage from 'next/image';
import {
  Image,
  PointEnum, DrawerToolEnum, Position, UUID, gradeToLightGrade,
  Track
} from 'types';
import { SVGArea, SVGLine, SVGPoint } from 'components';
import { staticUrl } from 'helpers/globals';
import useDimensions from 'react-cool-dimensions';
import {
  getMousePosInside,
} from '../../helpers';
import { Quark, QuarkArray, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';

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
  onImageLoad?: (width: number, height: number) => void,
}

const getColorNumber = (track: Track) => {
  return track.grade ? gradeToLightGrade(track.grade) : 'grey';
}

// NOTES:
// - The useDimensions hook from react-cool-dimensions can be used to dynamically size this component, based on its container
// TODOS:
// - Verify that the useDimensions hook works for dynamically resizing TracksImage
export const TracksImage: React.FC<TracksImageProps> = watchDependencies(({
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
  const renderAccumulator: RenderAccumulator[] = [];

  let imgWidth;
  let imgHeight;
  // Only one of those will be set
  let divWidth;
  let divHeight;
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

  const rx = props.image.width != 0
    ? imgWidth / props.image.width
    : 1;
  const ry = props.image.height != 0
    ? imgHeight / props.image.height
    : 1;

  for (const quarkTrack of props.tracks.quarks()) {
    const track = quarkTrack();
    let isFirstLine = true; // don't forget to set to false at the end of the loop!

    const isHighlighted =
        props.selectedTrack() === undefined ||
        track.id === props.selectedTrack()!.id;

    if (isHighlighted || displayPhantomTracks) {
      for (const quarkLine of track.lines.quarks()) {
        const line = quarkLine();
        if (line.imageId !== props.image.id) {
          continue;
        }
        // TODO: investigate why a regular inline callback doesn't work (can't reproduce with a simple case)
        // TODO: customise logic
        const onLineClick = getOnLineClick(props.selectedTrack, quarkTrack);

        const nodes: JSX.Element[] = [];
        renderAccumulator.push({
          id: line.id,
          nodes,
        });

        // Line
        nodes.push(
          <SVGLine 
            line={quarkLine}
            r={rx}
            editable={editable && isHighlighted}
            eraser={props.currentTool === 'ERASER'}
            grade={track.grade}
            pointSize={8}
            phantom={!isHighlighted}
            trackOrderIndex={track.orderIndex}
            onClick={onLineClick}
            onPointClick={(index) => props.onPointClick && props.onPointClick('LINE_POINT', index)}
          />
        )

        // Hand and feet departures
        if (isFirstLine && displayTracksDetails && isHighlighted) {
          if (line.handDepartures) {
            for (let i = 0; i < line.handDepartures.length; i++) {
              const [handX, handY] = line.handDepartures[i];
              nodes.push(
                <SVGPoint 
                  iconHref={`/assets/icons/colored/hand-full/_hand-full-${getColorNumber(track)}.svg`}
                  x={handX * rx}
                  y={handY * ry}
                  draggable={editable}
                  eraser={props.currentTool === 'ERASER'}
                  onDrag={(pos) => {
                    if (editable) {
                      const newHands = [...line.handDepartures!]
                      newHands[i] = [pos[0]/rx, pos[1]/rx];
                      quarkLine?.set({
                        ...line,
                        handDepartures: newHands,
                      })
                    }
                  }}
                  onClick={() => props.onPointClick && props.onPointClick('HAND_DEPARTURE_POINT', i)}
                />
              );
            }
          }
          if (line.feetDepartures) {
            for (let i = 0; i < line.feetDepartures.length; i++) {
              const [footX, footY] = line.feetDepartures[i];
              nodes.push(
                <SVGPoint 
                  iconHref={`/assets/icons/colored/climbing-shoe-full/_climbing-shoe-full-${getColorNumber(track)}.svg`}
                  x={footX * rx}
                  y={footY * ry}
                  draggable={editable}
                  eraser={props.currentTool === 'ERASER'}
                  onDrag={(pos) => {
                    if (editable) {
                      const newFeet = [...line.feetDepartures!]
                      newFeet[i] = [pos[0]/rx, pos[1]/rx];
                      quarkLine?.set({
                        ...line,
                        feetDepartures: newFeet,
                      })
                    }
                  }}
                  onClick={() => props.onPointClick && props.onPointClick('FOOT_DEPARTURE_POINT', i)}
                />
              );
            }
          }
        }

        // Forbidden areas
        if (displayTracksDetails && isHighlighted && line.forbidden) {
          for (let i = 0; i < line.forbidden.length; i++) {
            const area = line.forbidden[i];
            nodes.push(
              <SVGArea
                area={area}
                editable={editable}
                eraser={props.currentTool === 'ERASER'}
                rx={rx}
                ry={ry}
                pointSize={8}
                onChange={(area) => {
                  if (editable) {
                    const newForbiddens = [...line.forbidden!]
                    newForbiddens[i] = area;
                    quarkLine?.set({
                      ...line,
                      forbidden: newForbiddens,
                    })
                  }
                }}
                onClick={() => props.onPointClick && props.onPointClick('FORBIDDEN_AREA_POINT', i)}
              />,
            );
          }
        }

        isFirstLine = false;
      }
    }
  }

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
      className={`relative max-h-content w-full ${containerClassName}`}
      style={{
        height: divHeight,
        width: divWidth,
      }}
    >
      <svg
        style={{ cursor: `url(${getCursorUrl()}) ${props.currentTool === 'ERASER' ? '3 7': ''}, auto` }}
        className="svg-canvas absolute z-50"
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
        {renderAccumulator.map(x =>
          <React.Fragment key={x.id}>
            {x.nodes}
          </React.Fragment>
        )}
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

function getOnLineClick(selectedTrack: SelectQuarkNullable<Track>, trackQuark: Quark<Track>) {
  return () => selectedTrack.select(trackQuark);
}

interface RenderAccumulator {
  id: UUID,
  nodes: JSX.Element[],
}
