import React, { useEffect, useRef } from 'react';
import { ImageAfterServer, TrackType } from 'types';
import {
  getGradeFromDiffIds, getMousePosInside, getPathFromPoints, useRefState,
} from '../../helpers';
import { global, images } from '../../const';

interface TracksImageProps {
  image: ImageAfterServer,
  tracks: TrackType[],
  displayTracks: boolean,
  displayPhantomTracks: boolean,
  displayTracksNumber: boolean,
  displayTracksDetails: boolean,
  currentTrackId: number,
  editable: boolean,
  pointType: string,
  boulderImageDimensions: {
    width: number,
    height: number,
  }
  onImageClick: () => void,
  onPointClick: () => void,
  onPolylineClick: () => void,
  updateArea: () => void,
  onImageLoad: () => void,
}

export const TracksImage: React.FC<TracksImageProps> = (props: TracksImageProps) => {
  const imgRef = useRef();
  const pointTypeClass = (props.image && props.pointType) ? props.pointType : '';

  const [canvasWidth, setCanvasWidth] = useRefState(null);
  const [canvasHeight, setCanvasHeight] = useRefState(null);
  const [ratio, setRatio] = useRefState(null);
  const getRatio = () => {
    if (props.boulderImageDimensions || props.tracks[0]?.lines[0]?.boulderImageDimensions) {
      const boulderImageDimensions = props.boulderImageDimensions || props.tracks[0].lines[0].boulderImageDimensions;
      const newX = canvasWidth.current;
      const newY = canvasHeight.current;
      const oldX = boulderImageDimensions.width;
      const oldY = boulderImageDimensions.height;
      const rX = newX / oldX;
      const rY = newY / oldY;
      return { rX, rY };
    }
    return null;
  };

  useEffect(() => {
    if (canvasWidth.current && canvasHeight.current) setRatio(getRatio());
    else setRatio(null);
  }, [canvasWidth.current, canvasHeight.current, props.tracks[0]?.lines?.length]);
  useEffect(() => {
    if (window.screen?.orientation) {
      window.screen.orientation.onchange = (e) => {
        setCanvasWidth(imgRef.current.clientWidth);
        setCanvasHeight(imgRef.current.clientHeight);
      };
    } else { // Safari (does not support screen.orientation)
      window.addEventListener('orientationchange', () => {
        setCanvasWidth(imgRef.current.clientWidth);
        setCanvasHeight(imgRef.current.clientHeight);
      });
    }
  }, []);

  const getResizedPointsOfLine = (line, pointType) => {
    if (ratio.current) {
      const resizedLinePoints = [];
      const resizedHandDeparturePoints = [];
      const resizedFeetDeparturePoints = [];
      const resizedAnchorDeparturePoints = [];
      if (pointType === 'linePoints' && line.linePoints) {
        for (const linePoints of line.linePoints) {
          resizedLinePoints.push({
            posX: ratio.current.rX * linePoints.posX,
            posY: ratio.current.rY * linePoints.posY,
          });
        }
        return resizedLinePoints;
      }
      if (pointType === 'handDeparturePoints' && line.handDeparturePoints) {
        for (const handDeparturePoint of line.handDeparturePoints) {
          resizedHandDeparturePoints.push({
            posX: ratio.current.rX * handDeparturePoint.posX,
            posY: ratio.current.rY * handDeparturePoint.posY,
          });
        }
        return resizedHandDeparturePoints;
      }
      if (pointType === 'feetDeparturePoints' && line.feetDeparturePoints) {
        for (const feetDeparturePoint of line.feetDeparturePoints) {
          resizedFeetDeparturePoints.push({
            posX: ratio.current.rX * feetDeparturePoint.posX,
            posY: ratio.current.rY * feetDeparturePoint.posY,
          });
        }
        return resizedFeetDeparturePoints;
      }
      if (pointType === 'anchorPoints' && line.anchorPoints) {
        for (const anchorPoints of line.anchorPoints) {
          resizedAnchorDeparturePoints.push({
            posX: ratio.current.rX * anchorPoints.posX,
            posY: ratio.current.rY * anchorPoints.posY,
          });
        }
        return resizedAnchorDeparturePoints;
      }
    }
  };
  const getResizedPointsOfArea = (area) => {
    if (area.points && ratio.current) {
      const newArea = JSON.parse(JSON.stringify(area));
      const resizedAreaPoints = [];
      newArea.points.forEach((point) => {
        resizedAreaPoints.push({
          id: point.id,
          posX: ratio.current.rX * point.posX,
          posY: ratio.current.rY * point.posY,
        });
      });
      newArea.points = resizedAreaPoints;
      return JSON.parse(JSON.stringify(newArea));
    }
  };

  const renderPhantomTracks = () => {
    if (props.tracks && ratio.current) {
      const lineStrokeWidth = 3 * ratio.current.rX;
      return props.tracks.map((track, index) => {
        if (props.currentTrackId && track.id !== props.currentTrackId) {
          const line = track.lines?.find((line) => line.boulderImageId === props.image?.imageId);
          if (line?.linePoints?.length > 0) {
            const color = track.difficultyId === null ? 'grey-medium' : `grade-${getGradeFromDiffIds([track.difficultyId])[0].substring(0, 1)}`;
            return (
              <React.Fragment key={index}>
                <path
                  className={`line-polyline phantom ${props.onPolylineClick && 'clickable'} accent-stroke-color color-${color}`}
                  strokeWidth={lineStrokeWidth}
                  d={getPathFromPoints(getResizedPointsOfLine(line, 'linePoints'), 'curve')}
                  onClick={() => {
                    if (props.onPolylineClick) props.onPolylineClick(line);
                  }}
                />
                {props.displayTracksNumber
                                    && (
                                    <>
                                      <circle
                                        cx={getResizedPointsOfLine(line, 'linePoints')[0]?.posX}
                                        cy={getResizedPointsOfLine(line, 'linePoints')[0]?.posY}
                                        r={9}
                                        className={`line-circle phantom ${props.onPolylineClick && 'clickable'} accent-fill-color color-${color}`}
                                        onClick={() => {
                                          if (props.onPolylineClick) props.onPolylineClick(line);
                                        }}
                                      />
                                      <text
                                        x={getResizedPointsOfLine(line, 'linePoints')[0]?.posX}
                                        y={getResizedPointsOfLine(line, 'linePoints')[0]?.posY}
                                        className={`line-index ${props.onPolylineClick && 'clickable'} phantom`}
                                        textAnchor="middle"
                                        stroke="white"
                                        strokeWidth="1px"
                                        fontSize="8px"
                                        dy="3px"
                                        onClick={() => {
                                          if (props.onPolylineClick) props.onPolylineClick(line);
                                        }}
                                      >
                                        {track.index + 1 || index + 1}
                                      </text>
                                    </>
                                    )}
              </React.Fragment>
            );
          }
        }
        return null;
      });
    }
  };
  const renderTracks = () => {
    if (props.tracks && ratio.current) {
      const lineStrokeWidth = 3 * ratio.current.rX;
      return props.tracks.map((track, index) => {
        if (!props.currentTrackId || track.id === props.currentTrackId) {
          const line = track.lines?.find((line) => line.boulderImageId === props.image?.imageId);
          if (line?.linePoints?.length > 0) {
            const color = track.difficultyId === null ? 'grey-medium' : `grade-${getGradeFromDiffIds([track.difficultyId])[0].substring(0, 1)}`;
            return (
              <React.Fragment key={index}>
                <path
                  className={`line-polyline ${props.onPolylineClick && 'clickable'} accent-stroke-color color-${color}`}
                  strokeWidth={lineStrokeWidth}
                  d={getPathFromPoints(getResizedPointsOfLine(line, 'linePoints'), 'curve')}
                  onClick={() => {
                    if (props.onPolylineClick) props.onPolylineClick(line);
                  }}
                />
                {props.displayTracksNumber
                                    && (
                                    <>
                                      <circle
                                        cx={getResizedPointsOfLine(line, 'linePoints')[0]?.posX}
                                        cy={getResizedPointsOfLine(line, 'linePoints')[0]?.posY}
                                        r={9}
                                        className={`line-circle ${props.onPolylineClick && 'clickable'} accent-fill-color color-${color}`}
                                        onClick={() => {
                                          if (props.onPolylineClick) props.onPolylineClick(line);
                                        }}
                                      />
                                      <text
                                        x={getResizedPointsOfLine(line, 'linePoints')[0]?.posX}
                                        y={getResizedPointsOfLine(line, 'linePoints')[0]?.posY}
                                        className={`line-index ${props.onPolylineClick && 'clickable'}`}
                                        textAnchor="middle"
                                        stroke={color === 'grade-8' ? 'black' : 'white'}
                                        strokeWidth="1px"
                                        fontSize="8px"
                                        dy="3px"
                                        onClick={() => {
                                          if (props.onPolylineClick) props.onPolylineClick(line);
                                        }}
                                      >
                                        {track.index + 1 || index + 1}
                                      </text>
                                    </>
                                    )}
              </React.Fragment>
            );
          }
        }
        return null;
      });
    }
  };
  const renderTracksPoints = () => {
    if (props.tracks && ratio.current) {
      const pointSize = 3 * ratio.current.rX;
      return props.tracks.map((track) => {
        const line = track.lines?.find((line) => line.boulderImageId === props.image?.imageId);
        if (line?.linePoints?.length > 0 && track.id === props.currentTrackId) {
          const color = track.difficultyId === null ? 'grey-medium' : `grade-${getGradeFromDiffIds([track.difficultyId])[0].substring(0, 1)}`;
          return getResizedPointsOfLine(line, 'linePoints')?.map((point, index) => (
            <svg
              key={`linepoint-${index}`}
              className={`line-point${props.pointType === 'eraser' ? ' hover-scale' : ''}`}
              x={point.posX - pointSize}
              y={point.posY - pointSize}
              onClick={(e) => {
                if (props.onPointClick) props.onPointClick('linePoints', index);
              }}
            >
              <circle
                className={`line-point accent-fill-color color-${color}`}
                cx={pointSize}
                cy={pointSize}
                r={pointSize}
              />
            </svg>
          ));
        }
        return null;
      });
    }
  };
  const renderHandDeparturePoints = () => {
    if (props.tracks && ratio.current) {
      const iconWidth = 18 * ratio.current.rX;
      return props.tracks.map((track) => {
        if (!props.currentTrackId || track.id === props.currentTrackId) {
          const line = track.lines?.find((line) => line.boulderImageId === props.image?.imageId);
          if (line?.handDeparturePoints?.length > 0) {
            const color = track.difficultyId === null ? 'grey-medium' : getGradeFromDiffIds([track.difficultyId])[0].substring(0, 1);
            return getResizedPointsOfLine(line, 'handDeparturePoints')?.map((point, index) => (
              <svg
                key={`hand-${index}`}
                className={`hand-departure-point${props.pointType === 'eraser' ? ' hover-scale' : ''}`}
                x={point.posX}
                y={point.posY}
                onClick={(e) => {
                  if (props.onPointClick) props.onPointClick('handDeparturePoints', index);
                }}
              >
                <image
                  href={`/assets/icons/colored/hand-full/_hand-full-${color}.svg`}
                  width={iconWidth}
                />
              </svg>
            ));
          }
        }
        return null;
      });
    }
  };
  const renderFeetDeparturePoints = () => {
    if (props.tracks && ratio.current) {
      const iconWidth = 30 * ratio.current.rX;
      return props.tracks.map((track) => {
        if (!props.currentTrackId || track.id === props.currentTrackId) {
          const line = track.lines?.find((line) => line.boulderImageId === props.image?.imageId);
          if (line?.feetDeparturePoints?.length > 0) {
            const color = track.difficultyId === null ? 'grey-medium' : getGradeFromDiffIds([track.difficultyId])[0].substring(0, 1);
            return getResizedPointsOfLine(line, 'feetDeparturePoints')?.map((point, index) => (
              <svg
                key={index}
                className={`foot-departure-point${props.pointType === 'eraser' ? ' hover-scale' : ''}`}
                x={point.posX}
                y={point.posY}
                onClick={(e) => {
                  if (props.onPointClick) props.onPointClick('feetDeparturePoints', index);
                }}
              >
                <image
                  href={`/assets/icons/colored/climbing-shoe-full/_climbing-shoe-full-${color}.svg`}
                  width={iconWidth}
                />
              </svg>
            ));
          }
        }
        return null;
      });
    }
  };
  const renderAnchorPoints = () => {
    if (props.tracks && ratio.current) {
      const iconWidth = 12 * ratio.current.rX;
      return props.tracks.map((track) => {
        if (!props.currentTrackId || track.id === props.currentTrackId) {
          const line = track.lines?.find((line) => line.boulderImageId === props.image?.imageId);
          if (line?.anchorPoints?.length > 0) {
            const color = track.difficultyId === null ? 'grey-medium' : getGradeFromDiffIds([track.difficultyId])[0].substring(0, 1);
            return getResizedPointsOfLine(line, 'anchorPoints')?.map((point, index) => (
              <svg
                key={index}
                className={`anchor-point${props.pointType === 'eraser' ? ' hover-scale' : ''}`}
                x={point.posX}
                y={point.posY}
                onClick={(e) => {
                  if (props.onPointClick) props.onPointClick('anchorPoints', index);
                }}
              >
                <image
                  href={`/assets/icons/colored/quickdraw/_quickdraw-${color}.svg`}
                  width={iconWidth}
                />
              </svg>
            ));
          }
        }
        return null;
      });
    }
  };
  const renderForbiddenAreas = () => {
    if (props.tracks && ratio.current) {
      const pointSize = 6 * ratio.current.rX;
      return props.tracks.map((track) => {
        if (!props.currentTrackId || track.id === props.currentTrackId) {
          const line = track.lines?.find((line) => line.boulderImageId === props.image?.imageId);
          if (line?.forbiddenAreas?.length > 0) {
            return line.forbiddenAreas.map((areaLine, index) => (
              <svg
                key={`forbidden-area-${index}`}
                className={`forbidden-area${props.pointType === 'eraser' ? ' hover-scale' : ''}`}
                onClick={(e) => {
                  if (props.onPointClick) props.onPointClick('forbiddenAreas', index);
                }}
              >
                <SVGArea
                  index
                  editable={props.editable}
                  area={getResizedPointsOfArea(areaLine)}
                  ratio={ratio.current}
                  pointSize={pointSize}
                  onChange={(area) => {
                    props.updateArea('forbiddenAreas', index, area);
                  }}
                />
              </svg>
            ));
          }
        }
        return null;
      });
    }
  };

  const cursorGradeColor = getGradeFromDiffIds([props.tracks?.find((track) => track.id === props.currentTrackId)?.difficultyId])[0]?.substring(0, 1);
  const cursorColor = cursorGradeColor ? `grade-${cursorGradeColor}` : 'grey-medium';
  return (
    <span className={`tracks-image ${props.className ? props.className : ''}`}>
      <svg
        className={`svg-canvas ${pointTypeClass} cursor-color color-${cursorColor}`}
        width={canvasWidth.current}
        height={canvasHeight.current}
        onMouseDown={(e) => {
          if (e.button === 0 && props.onImageClick && !e.target.classList.contains('svg-area')) { // Left-click on the canvas only
            if (props.image && props.editable) {
              if (!e.target.classList.contains('svg-canvas')) {
                e.target = e.target.farthestViewportElement;
              }
              const { posX, posY } = getMousePosInside(e, $(e.target));
              props.onImageClick(posX, posY);
            } else props.onImageClick();
          }
        }}
      >
        {props.displayPhantomTracks && renderPhantomTracks()}
        {props.displayTracks && renderTracks()}
        {props.displayTracks && props.editable && renderTracksPoints()}
        {props.displayTracksDetails && renderHandDeparturePoints()}
        {props.displayTracksDetails && renderFeetDeparturePoints()}
        {props.displayTracksDetails && renderAnchorPoints()}
        {props.displayTracksDetails && renderForbiddenAreas()}
      </svg>
      <span className="image-container">
        <img
          ref={imgRef}
          src={props.image ? (props.image.content || global.topogetherUrl + props.image.imageUrl) : images.defaultKayoo}
          loading="lazy"
          onLoad={(e) => {
            setCanvasWidth(e.target.clientWidth);
            setCanvasHeight(e.target.clientHeight);
            if (props.onLoad) props.onLoad(e);
          }}
          alt="Rocher"
        />
      </span>
    </span>
  );
};

TracksImage.defaultProps = {
  tracks: [],
  displayTracks: true,
  displayPhantomTracks: true,
  displayTracksNumber: true,
  displayTracksDetails: true,
  editable: false,
};
