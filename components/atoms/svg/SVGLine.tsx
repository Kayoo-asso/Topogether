import React, { useState } from 'react';
import { getPathFromPoints } from 'helpers';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Grade, gradeToLightGrade, Line, Position } from 'types';
import { SVGPoint } from '.';

interface SVGLineProps {
    line: Quark<Line>,
    r: number,
    grade: Grade | undefined,
    editable?: boolean,
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
    const points: Position[] = line.points.map(([x, y]) => [x * props.r, y * props.r]);
    const path = getPathFromPoints(points, 'CURVE');
    const pointSize = trackWeight * 4;
    const firstX = points[0][0];
    const firstY = points[0][1];

    const [originPosition, setOriginPosition] = useState({
        active: false,
        offsetX: 0,
        offsetY: 0,
    });

  const handlePointerDown: React.PointerEventHandler<SVGCircleElement | SVGTextElement> = (e: React.PointerEvent) => {
    if (editable) {
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      setOriginPosition({
        ...originPosition,
        active: true,
        offsetX: e.clientX - firstX,
        offsetY: e.clientY - firstY,
      });
    }
  };
  const handlePointerMove: React.PointerEventHandler<SVGCircleElement | SVGTextElement> = (e: React.PointerEvent) => {
    if (originPosition.active) {
        const newX = e.clientX - originPosition.offsetX;
        const newY = e.clientY - originPosition.offsetY;
        const newPoints = [...line.points];
        newPoints[0] = [newX/props.r, newY/props.r];
        props.line.set({
            ...line,
            points: newPoints
        });
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
                        x={p[0] - pointSize/2}
                        y={p[1] - pointSize/2}
                        size={pointSize}
                        draggable={editable}
                        eraser={eraser}
                        onDrag={(pos) => {
                            if (editable) {
                              const newPoints = [...line.points]
                              newPoints[index] = [pos[0]/props.r, pos[1]/props.r];
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

        {displayTrackOrderIndex &&
            <>
                <circle
                    cx={firstX}
                    cy={firstY}
                    r={9}
                    className={`${getFillColorClass()} ${phantom ? 'z-20 opacity-50' : 'z-40'}${(!eraser && props.onClick) || phantom ? ' cursor-pointer' : ''}`}
                    onClick={props.onClick}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                />
                <text
                    x={firstX}
                    y={firstY}
                    className={`${phantom ? 'z-20 opacity-50' : 'z-40'}${(!eraser && props.onClick) || phantom ? ' cursor-pointer' : ' cursor-default'}`}
                    textAnchor="middle"
                    stroke="white"
                    strokeWidth="1px"
                    fontSize="8px"
                    dy="3px"
                    onClick={props.onClick}
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