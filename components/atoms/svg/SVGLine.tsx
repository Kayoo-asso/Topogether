import React, { useState } from 'react';
import { getCoordsInViewbox, getPathFromPoints } from 'helpers';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Grade, gradeToLightGrade, Line } from 'types';
import { SVGPoint } from '.';

interface SVGLineProps {
  line: Quark<Line>,
  grade: Grade | undefined,
  editable?: boolean,
  vb?: SVGRectElement | null,
  vbWidth?: number,
  vbHeight?: number,
  eraser?: boolean,
  displayTrackOrderIndex?: boolean,
  trackWeight?: number,
  trackOrderIndex: number,
  phantom?: boolean,
  onClick?: () => void,
  onPointClick?: (index: number) => void,
}

export const SVGLine: React.FC<SVGLineProps> = watchDependencies(({
  editable = false,
  eraser = false,
  phantom = false,
  displayTrackOrderIndex = true,
  trackWeight = 2,
  ...props
}: SVGLineProps) => {
  const line = props.line();
  const points = line.points;
  const path = getPathFromPoints(points, 'CURVE');
  const pointSize = props.vbWidth ? 200*props.vbWidth/6000 : 200;
  const firstX = points.length > 0 ? points[0][0] : null;
  const firstY = points.length > 0 ? points[0][1] : null;

  const [originPosition, setOriginPosition] = useState({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });

  const handlePointerDown: React.PointerEventHandler<SVGCircleElement | SVGTextElement> = (e: React.PointerEvent) => {
    if (editable && props.vb && props.vbWidth && props.vbHeight && firstX !== null && firstY !== null) {
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      const coords = getCoordsInViewbox(props.vb, props.vbWidth, props.vbHeight, e.clientX, e.clientY);
      if (coords) {
        setOriginPosition({
          ...originPosition,
          active: true,
          offsetX: coords[0] - firstX,
          offsetY: coords[1] - firstY,
        });
      }
    }
  };
  const handlePointerMove: React.PointerEventHandler<SVGCircleElement | SVGTextElement> = (e: React.PointerEvent) => {
    if (originPosition.active && props.vb && props.vbWidth && props.vbHeight && editable) {
      const coords = getCoordsInViewbox(props.vb, props.vbWidth, props.vbHeight, e.clientX, e.clientY);
      if (coords) {
        const newX = coords[0] - originPosition.offsetX;
        const newY = coords[1] - originPosition.offsetY;
        const newPoints = [...line.points];
        newPoints[0] = [newX, newY];
        props.line.set({
          ...line,
          points: newPoints
        });
      }
    }
  };
  const handlePointerUp: React.PointerEventHandler<SVGCircleElement | SVGTextElement> = (e: React.PointerEvent) => {
    if (originPosition.active) {
      setOriginPosition({
        offsetX: 0,
        offsetY: 0,
        active: false,
      });
    }
  };

  const getColorNumber = () => {
    return props.grade ? gradeToLightGrade(props.grade) : 'grey';
  }
  const getStrokeColorClass = () => {
    if (!props.grade) return 'stroke-grey-light';
    else {
      const lightGrade = gradeToLightGrade(props.grade);
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
  const getFillColorClass = () => {
    if (!props.grade) return 'fill-grey-light';
    else {
      const lightGrade = gradeToLightGrade(props.grade);
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

  return (
    <>
      <path
        className={`fill-[none] ${getStrokeColorClass()} ${phantom ? 'z-10 opacity-50' : 'z-30'}${props.onClick ? ' cursor-pointer' : ''}`}
        d={path}
        onClick={props.onClick}
        style={{
          strokeWidth: trackWeight + 'px'
        }}
      />

      {editable &&
        <>
          {points.map((p, index) => (
            <SVGPoint
              key={index}
              iconHref={`/assets/icons/colored/line-point/_line-point-${getColorNumber()}.svg`}
              x={p[0] - pointSize / 2}
              y={p[1] - pointSize / 2}
              size={pointSize}
              draggable={editable}
              vb={props.vb}
              vbWidth={props.vbWidth}
              vbHeight={props.vbHeight}
              eraser={eraser}
              onDrag={(pos) => {
                if (editable) {
                  const newPoints = [...line.points]
                  newPoints[index] = [pos[0], pos[1]];
                  props.line.set({
                    ...line,
                    points: newPoints,
                  })
                }
              }}
              onClick={(e) => {
                if (eraser) e.stopPropagation();
                props.onPointClick && props.onPointClick(index);
              }}
            />
          ))};
        </>
      }

      {displayTrackOrderIndex && firstX !== null && firstY !== null &&
        <>
          <circle
            cx={firstX}
            cy={firstY}
            r={pointSize}
            className={`${getFillColorClass()} ${phantom ? 'z-20 opacity-50' : 'z-40'}${(!eraser && props.onClick) || phantom ? ' cursor-pointer' : ''}`}
            onClick={(e) => {
              if (eraser) {
                e.stopPropagation();
                props.onPointClick && props.onPointClick(0);
              }
              else if (props.onClick) props.onClick()
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
          />
          <text
            x={firstX}
            y={firstY}
            className={`select-none fill-white ${phantom ? 'z-20 opacity-50' : 'z-40'}${(!eraser && props.onClick) || phantom ? ' cursor-pointer' : ''}`}
            textAnchor="middle"
            stroke="white"
            strokeWidth="8px"
            fontSize={pointSize+'px'}
            dy={(pointSize/3)+'px'}
            onClick={(e) => {
              if (eraser) {
                e.stopPropagation();
                props.onPointClick && props.onPointClick(0);
              }
              else if (props.onClick) props.onClick()
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
          >
            {props.trackOrderIndex + 1}
          </text>
        </>
      }
    </>
  );
});

SVGLine.displayName = "SVGLine";