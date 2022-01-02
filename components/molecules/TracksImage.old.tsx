import React, { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
// import {
// <<<<<<< HEAD
//   Polygon, Point, ImageAfterServer, ImageDimension, LineString, Track,
// =======
//   Area, Coordinates, ImageAfterServer, ImageDimension, Line, Track,
//   PointEnum, AreaEnum, DrawerToolEnum,
// >>>>>>> dev
// } from 'types';
// import { SVGArea } from 'components';
// import { staticUrl, topogetherUrl } from 'const/staticUrl';
// import {
//   getMousePosInside,
//   getPathFromPoints,
// } from '../../helpers';

// interface TracksImageProps {
//   image: ImageAfterServer,
//   tracks: Track[],
//   tracksClassName?: string,
//   displayTracks?: boolean,
//   displayPhantomTracks?: boolean,
//   displayTracksNumber?: boolean,
//   displayTracksDetails?: boolean,
//   editable?: boolean,
//   currentTrackId?: number,
//   currentTool?: DrawerToolEnum,
//   boulderImageDimensions: ImageDimension,
//   onImageClick?: (pos: Point | null) => void,
//   onPointClick?: (pointType: PointEnum, index: number) => void,
//   onPolylineClick?: (line: LineString) => void,
//   onAreaChange?: (areaType: AreaEnum, index: number, area: Polygon) => void,
//   onImageLoad?: (e: {
//     naturalWidth: number;
//     naturalHeight: number;
//   }) => void,
// }

// export const TracksImage: React.FC<TracksImageProps> = ({
//   tracksClassName = 'stroke-main',
//   displayTracks = true,
//   displayPhantomTracks = true,
//   displayTracksNumber = true,
//   displayTracksDetails = true,
//   editable = false,
//   ...props
// }: TracksImageProps) => {
  // const imgContainerRef = useRef<HTMLSpanElement>(null);

  // const [canvasWidth, setCanvasWidth] = useState(0);
  // const [canvasHeight, setCanvasHeight] = useState(0);
  // const [ratio, setRatio] = useState({ rX: 1, rY: 1 });
  // const getRatio = () => {
  //   if (props.boulderImageDimensions || (props.tracks[0]?.lines && props.tracks[0]?.lines[0]?.boulderImageDimensions)) {
  //     const boulderImageDimensions = props.boulderImageDimensions || (props.tracks[0]?.lines && props.tracks[0].lines[0].boulderImageDimensions);
  //     const newX = canvasWidth;
  //     const newY = canvasHeight;
  //     const oldX = boulderImageDimensions.width;
  //     const oldY = boulderImageDimensions.height;
  //     const rX = newX / oldX;
  //     const rY = newY / oldY;
  //     return { rX, rY };
  //   }
  //   return { rX: 1, rY: 1 };
  // };

  // useEffect(() => {
  //   if (canvasWidth && canvasHeight) setRatio(getRatio());
  //   else setRatio({ rX: 1, rY: 1 });
  // }, [canvasWidth, canvasHeight, props.tracks[0]?.lines?.length]);
  // useEffect(() => {
  //   if (window.screen?.orientation) {
  //     window.screen.orientation.onchange = (e) => {
  //       if (imgContainerRef.current) {
  //         setCanvasWidth(imgContainerRef.current.clientWidth);
  //         setCanvasHeight(imgContainerRef.current.clientHeight);
  //       }
  //     };
  //   } else { // Safari (does not support screen.orientation)
  //     window.addEventListener('orientationchange', () => {
  //       if (imgContainerRef.current) {
  //         setCanvasWidth(imgContainerRef.current.clientWidth);
  //         setCanvasHeight(imgContainerRef.current.clientHeight);
  //       }
  //     });
  //   }
  // }, []);

  // const getResizedPointsOfLine: (line: LineString, pointType: PointEnum) => Point[] = (line:LineString, pointType: PointEnum) => {
  //   if (ratio) {
  //     const resizedLinePoints: Point[] = [];
  //     const resizedHandDeparturePoints: Point[] = [];
  //     const resizedFeetDeparturePoints: Point[] = [];
  //     const resizedAnchorDeparturePoints: Point[] = [];
  //     if (pointType === 'LINE_POINT' && line.linePoints) {
  //       for (const linePoints of line.linePoints) {
  //         resizedLinePoints.push({
  //           x: ratio.rX * linePoints.x,
  //           y: ratio.rY * linePoints.y,
  //         });
  //       }
  //       return resizedLinePoints;
  //     }
  //     if (pointType === 'HAND_DEPARTURE_POINT' && line.handDeparturePoints) {
  //       for (const handDeparturePoint of line.handDeparturePoints) {
  //         resizedHandDeparturePoints.push({
  //           x: ratio.rX * handDeparturePoint.x,
  //           y: ratio.rY * handDeparturePoint.y,
  //         });
  //       }
  //       return resizedHandDeparturePoints;
  //     }
  //     if (pointType === 'FOOT_DEPARTURE_POINT' && line.feetDeparturePoints) {
  //       for (const feetDeparturePoint of line.feetDeparturePoints) {
  //         resizedFeetDeparturePoints.push({
  //           x: ratio.rX * feetDeparturePoint.x,
  //           y: ratio.rY * feetDeparturePoint.y,
  //         });
  //       }
  //       return resizedFeetDeparturePoints;
  //     }
  //     if (pointType === 'ANCHOR_POINT' && line.anchorPoints) {
  //       for (const anchorPoints of line.anchorPoints) {
  //         resizedAnchorDeparturePoints.push({
  //           x: ratio.rX * anchorPoints.x,
  //           y: ratio.rY * anchorPoints.y,
  //         });
  //       }
  //       return resizedAnchorDeparturePoints;
  //     }
  //     return [];
  //   }
  //   return [];
  // };
  // const getResizedPointsOfArea: (area: Polygon) => Polygon = (area: Polygon) => {
  //   if (area.coordinates && ratio) {
  //     const newArea: Polygon = JSON.parse(JSON.stringify(area));
  //     const resizedAreaPoints: Point[] = [];
  //     newArea.coordinates.forEach((point) => {
  //       resizedAreaPoints.push({
  //         x: ratio.rX * point.x,
  //         y: ratio.rY * point.y,
  //       });
  //     });
  //     newArea.coordinates = resizedAreaPoints;
  //     return JSON.parse(JSON.stringify(newArea));
  //   }
  //   return { coordinates: [] };
  // };

  // const renderPhantomTracks = () => {
  //   if (props.tracks && ratio) {
  //     const lineStrokeWidth = 3 * ratio.rX;
  //     return props.tracks.map((track) => {
  //       if (props.currentTrackId && track.id !== props.currentTrackId) {
  //         const line = track.lines?.find((l) => l.boulderImageId === props.image?.id);
  //         if (line && (line.linePoints?.length ?? 0) > 0) {
  //           return (
  //             <React.Fragment key={line.id}>
  //               <path
  //                 className={`z-10 opacity-40 ${tracksClassName} ${props.onPolylineClick && ' cursor-pointer'}`}
  //                 strokeWidth={lineStrokeWidth}
  //                 d={getPathFromPoints(getResizedPointsOfLine(line, 'LINE_POINT'), 'CURVE')}
  //                 onClick={() => {
  //                   if (props.onPolylineClick) props.onPolylineClick(line);
  //                 }}
  //               />
  //               {displayTracksNumber && (
  //                 <>
  //                   <circle
  //                     cx={getResizedPointsOfLine(line, 'LINE_POINT')[0]?.x}
  //                     cy={getResizedPointsOfLine(line, 'LINE_POINT')[0]?.y}
  //                     r={9}
  //                     className={`z-20 opacity-40 ${props.onPolylineClick && 'cursor-pointer pointer-events-auto'}`}
  //                     onClick={() => {
  //                       if (props.onPolylineClick) props.onPolylineClick(line);
  //                     }}
  //                   />
  //                   <text
  //                     x={getResizedPointsOfLine(line, 'LINE_POINT')[0]?.x}
  //                     y={getResizedPointsOfLine(line, 'LINE_POINT')[0]?.y}
  //                     className={`z-20 opacity-40 ${props.onPolylineClick && 'cursor-pointer'}`}
  //                     textAnchor="middle"
  //                     stroke="white"
  //                     strokeWidth="1px"
  //                     fontSize="8px"
  //                     dy="3px"
  //                     onClick={() => {
  //                       if (props.onPolylineClick) props.onPolylineClick(line);
  //                     }}
  //                   >
  //                     {track.orderIndex + 1}
  //                   </text>
  //                 </>
  //               )}
  //             </React.Fragment>
  //           );
  //         }
  //       }
  //       return null;
  //     });
  //   }
  //   return null;
  // };
  // const renderTracks = () => {
  //   if (props.tracks && ratio) {
  //     const lineStrokeWidth = 3 * ratio.rX;
  //     return props.tracks.map((track) => {
  //       if (!props.currentTrackId || track.id === props.currentTrackId) {
  //         const line = track.lines?.find((l) => l.boulderImageId === props.image?.id);
  //         if (line && (line.linePoints?.length ?? 0) > 0) {
  //           return (
  //             <React.Fragment key={line.id}>
  //               <path
  //                 className={`z-30 ${tracksClassName} ${props.onPolylineClick && 'cursor-pointer'}`}
  //                 strokeWidth={lineStrokeWidth}
  //                 d={getPathFromPoints(getResizedPointsOfLine(line, 'LINE_POINT'), 'CURVE')}
  //                 onClick={() => {
  //                   if (props.onPolylineClick) props.onPolylineClick(line);
  //                 }}
  //               />
  //               {displayTracksNumber && (
  //                 <>
  //                   <circle
  //                     cx={getResizedPointsOfLine(line, 'LINE_POINT')[0]?.x}
  //                     cy={getResizedPointsOfLine(line, 'LINE_POINT')[0]?.y}
  //                     r={9}
  //                     className={`z-40 ${props.onPolylineClick && 'cursor-pointer pointer-events-auto'}`}
  //                     onClick={() => {
  //                       if (props.onPolylineClick) props.onPolylineClick(line);
  //                     }}
  //                   />
  //                   <text
  //                     x={getResizedPointsOfLine(line, 'LINE_POINT')[0]?.x}
  //                     y={getResizedPointsOfLine(line, 'LINE_POINT')[0]?.y}
  //                     className={`z-40 ${props.onPolylineClick && 'cursor-pointer'}`}
  //                     textAnchor="middle"
  //                     stroke="white"
  //                     strokeWidth="1px"
  //                     fontSize="8px"
  //                     dy="3px"
  //                     onClick={() => {
  //                       if (props.onPolylineClick) props.onPolylineClick(line);
  //                     }}
  //                   >
  //                     {track.orderIndex + 1}
  //                   </text>
  //                 </>
  //               )}
  //             </React.Fragment>
  //           );
  //         }
  //       }
  //       return null;
  //     });
  //   }
  //   return null;
  // };
  // const renderTracksPoints = () => {
  //   if (props.tracks && ratio) {
  //     const pointSize = 3 * ratio.rX;
  //     return props.tracks.map((track) => {
  //       const line = track.lines?.find((l) => l.boulderImageId === props.image?.id);
  //       if (line && (line.linePoints?.length ?? 0) > 0 && track.id === props.currentTrackId) {
  //         return getResizedPointsOfLine(line, 'LINE_POINT')?.map((point, index) => (
  //           <svg
  //             key={`linepoint-${index}`}
  //             className={`${props.currentTool === 'ERASER' ? 'scale-125' : ''}`}
  //             x={point.x - pointSize}
  //             y={point.y - pointSize}
  //             onClick={(e) => {
  //               if (props.onPointClick) props.onPointClick('LINE_POINT', index);
  //             }}
  //           >
  //             <circle
  //               className="pointer-events-auto"
  //               cx={pointSize}
  //               cy={pointSize}
  //               r={pointSize}
  //             />
  //           </svg>
  //         ));
  //       }
  //       return null;
  //     });
  //   }
  // };
  // const renderHandDeparturePoints = () => {
  //   if (props.tracks && ratio) {
  //     const iconWidth = 18 * ratio.rX;
  //     return props.tracks.map((track) => {
  //       if (!props.currentTrackId || track.id === props.currentTrackId) {
  //         const line = track.lines?.find((l) => l.boulderImageId === props.image?.id);
  //         if (line && (line.handDeparturePoints?.length ?? 0) > 0) {
  //           return getResizedPointsOfLine(line, 'HAND_DEPARTURE_POINT')?.map((point, index) => (
  //             <svg
  //               key={`hand-${index}`}
  //               className={`${props.currentTool === 'ERASER' ? 'scale-125' : ''}`}
  //               x={point.x}
  //               y={point.y}
  //               onClick={(e) => {
  //                 if (props.onPointClick) props.onPointClick('HAND_DEPARTURE_POINT', index);
  //               }}
  //             >
  //               <image
  //                 href={`/assets/icons/colored/hand-full/_hand-full-${track.grade ? track.grade[0] : 'grey'}.svg`}
  //                 width={iconWidth}
  //               />
  //             </svg>
  //           ));
  //         }
  //       }
  //       return null;
  //     });
  //   }
  // };
  // const renderFeetDeparturePoints = () => {
  //   if (props.tracks && ratio) {
  //     const iconWidth = 30 * ratio.rX;
  //     return props.tracks.map((track) => {
  //       if (!props.currentTrackId || track.id === props.currentTrackId) {
  //         const line = track.lines?.find((l) => l.boulderImageId === props.image?.id);
  //         if (line && (line.feetDeparturePoints?.length ?? 0) > 0) {
  //           return getResizedPointsOfLine(line, 'FOOT_DEPARTURE_POINT')?.map((point, index) => (
  //             <svg
  //               key={index}
  //               className={`${props.currentTool === 'ERASER' ? 'scale-125' : ''}`}
  //               x={point.x}
  //               y={point.y}
  //               onClick={(e) => {
  //                 if (props.onPointClick) props.onPointClick('FOOT_DEPARTURE_POINT', index);
  //               }}
  //             >
  //               <image
  //                 href={`/assets/icons/colored/climbing-shoe-full/_climbing-shoe-full-${track.grade ? track.grade[0] : 'grey'}.svg`}
  //                 width={iconWidth}
  //               />
  //             </svg>
  //           ));
  //         }
  //       }
  //       return null;
  //     });
  //   }
  // };
  // const renderAnchorPoints = () => {
  //   if (props.tracks && ratio) {
  //     const iconWidth = 12 * ratio.rX;
  //     return props.tracks.map((track) => {
  //       if (!props.currentTrackId || track.id === props.currentTrackId) {
  //         const line = track.lines?.find((l) => l.boulderImageId === props.image?.id);
  //         if (line && (line.anchorPoints?.length ?? 0) > 0) {
  //           return getResizedPointsOfLine(line, 'ANCHOR_POINT')?.map((point, index) => (
  //             <svg
  //               key={index}
  //               className={`${props.currentTool === 'ERASER' ? 'scale-125' : ''}`}
  //               x={point.x}
  //               y={point.y}
  //               onClick={(e) => {
  //                 if (props.onPointClick) props.onPointClick('ANCHOR_POINT', index);
  //               }}
  //             >
  //               <image
  //                 href={`/assets/icons/colored/quickdraw/_quickdraw-${track.grade ? track.grade[0] : 'grey'}.svg`}
  //                 width={iconWidth}
  //               />
  //             </svg>
  //           ));
  //         }
  //       }
  //       return null;
  //     });
  //   }
  // };
  // const renderForbiddenAreas = () => {
  //   if (props.tracks && ratio) {
  //     const pointSize = 6 * ratio.rX;
  //     return props.tracks.map((track) => {
  //       if (!props.currentTrackId || track.id === props.currentTrackId) {
  //         const line = track.lines?.find((l) => l.boulderImageId === props.image?.id);
  //         if (line?.forbiddenAreas && (line.forbiddenAreas.length ?? 0) > 0) {
  //           return line.forbiddenAreas.map((areaLine, index) => (
  //             <svg
  //               key={`forbidden-area-${index}`}
  //               className={`${props.currentTool === 'ERASER' ? 'scale-125' : ''}`}
  //               onClick={(e) => {
  //                 if (props.onPointClick) props.onPointClick('FORBIDDEN_AREA_POINT', index);
  //               }}
  //             >
  //               <SVGArea
  //                 key={index}
  //                 editable={editable}
  //                 area={getResizedPointsOfArea(areaLine)}
  //                 ratio={ratio}
  //                 pointSize={pointSize}
  //                 onChange={(area) => {
  //                   if (props.onAreaChange) props.onAreaChange('FORBIDDEN_AREA', index, area);
  //                 }}
  //               />
  //             </svg>
  //           ));
  //         }
  //       }
  //       return null;
  //     });
  //   }
  // };

  // const getCursorUrl = () => {
  //   let cursorColor = 'grey';
  //   const currentTrack = props.tracks.find((track) => track.id === props.currentTrackId);
  //   if (currentTrack?.grade) { cursorColor = currentTrack.grade[0] || 'grey'; }

  //   let cursorUrl = '/assets/icons/colored/';
  //   switch (props.currentTool) {
  //     case 'LINE_DRAWER':
  //       cursorUrl += `line-point/_line-point-${cursorColor}.svg`; break;
  //     case 'ANCHOR_DRAWER':
  //       cursorUrl += `quickdraw/_quickdraw-${cursorColor}.svg`; break;
  //     case 'ERASER':
  //       cursorUrl += '_eraser-main.svg'; break;
  //     case 'HAND_DEPARTURE_DRAWER':
  //       cursorUrl += `hand-full/_hand-full-${cursorColor}.svg`; break;
  //     case 'FOOT_DEPARTURE_DRAWER':
  //       cursorUrl += `climbing-shoe-full/climbing-shoe-full-${cursorColor}.svg`; break;
  //     case 'FORBIDDEN_AREA_DRAWER':
  //       cursorUrl += '_forbidden-area-second.svg'; break;
  //   }
  //   return cursorUrl;
  // };

  // return (
  //   <span>
  //     <svg
  //       style={{ cursor: `url(${getCursorUrl()}), auto` }}
  //       className="svg-canvas"
  //       width={canvasWidth}
  //       height={canvasHeight}
  //       onMouseDown={(e) => {
  //         if (e.button === 0 && props.onImageClick && !e.currentTarget.classList.contains('svg-area')) { // Left-click on the canvas only
  //           if (props.image && editable) {
  //             // TO FIX ??? TODO
  //             // if (!e.currentTarget.classList.contains('svg-canvas')) {
  //             //   e.currentTarget = e.currentTarget.farthestViewportElement;
  //             // }
  //             const { posX, posY } = getMousePosInside(e);
  //             props.onImageClick({ x: posX, y: posY });
  //           } else props.onImageClick(null);
  //         }
  //       }}
  //     >
  //       {displayPhantomTracks && renderPhantomTracks()}
  //       {displayTracks && renderTracks()}
  //       {displayTracks && editable && renderTracksPoints()}
  //       {displayTracksDetails && renderHandDeparturePoints()}
  //       {displayTracksDetails && renderFeetDeparturePoints()}
  //       {displayTracksDetails && renderAnchorPoints()}
  //       {displayTracksDetails && renderForbiddenAreas()}
  //     </svg>

  //     <span
  //       ref={imgContainerRef}
  //       className="flex items-center"
  //     >
  //       <Image
  //         src={props.image ? (topogetherUrl + props.image.url) : staticUrl.defaultKayoo}
  //         alt="Rocher"
  //         layout="fill"
  //         objectFit="contain"
  //         onLoadingComplete={(e) => {
  //           setCanvasWidth(e.naturalWidth);
  //           setCanvasHeight(e.naturalHeight);
  //           if (props.onImageLoad) props.onImageLoad(e);
  //         }}
  //       />
  //     </span>
  //   </span>
  // );
// };