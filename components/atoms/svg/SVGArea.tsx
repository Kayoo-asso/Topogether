import React, { useEffect, useState } from 'react';
import { Polygon, Point, LinearRing, Position } from 'types';
import { DraggablePolyline } from '.';
import { pointsToPolylineStr } from '../../../helpers';
import { SVGPoint } from './SVGPoint';

interface SVGAreaProps {
  // a LinearRing delineates the contour of a Polygon
  area: LinearRing,
  rx: number,
  ry: number,
  editable: boolean,
  pointSize: number,
  className?: string,
  onChange?: (area: LinearRing) => void,
}

export const SVGArea: React.FC<SVGAreaProps> = ({
  rx = 1,
  ry = 1,
  editable = false,
  pointSize = 3,
  className = '',
  ...props
}: SVGAreaProps) => {

  const updateAreaPoint = (index: number, newPos: Position) => {
    if (props.onChange) {
      const newArea = [...props.area];
      newArea[index] = newPos;
      if (index === 0) {
        newArea[newArea.length - 1] = newPos;
      }
      // TypeScript cannot recognize that the length did not change
      // and we still have at least 4 elements
      props.onChange(newArea as LinearRing);
    }
  };

  const dragAllPoints = (diffX: number, diffY: number) => {
    if (props.onChange) {
      const newArea = props.area.map(p => [p[0] + diffX, p[1] + diffY]);
      // TypeScript cannot recognize that the length did not change
      // and we still have at least 4 elements
      props.onChange(newArea as LinearRing);
    }
  };

  const renderPolyline = () => {
    const lineStrokeWidth = 2 * rx;
    if (editable) {
      return (
        <DraggablePolyline
          className={`stroke-second fill-second/10 z-20 ${className}`}
          strokeWidth={lineStrokeWidth}
          points={props.area}
          onDrag={(diffX, diffY) => {
            dragAllPoints(diffX, diffY);
          }}
          onDrop={() => props.onChange && props.onChange(props.area)}
        />
      );
    }

    return (
      <polyline
        className={`stroke-second fill-second z-20 ${className}`}
        points={pointsToPolylineStr(props.area)}
        strokeWidth={lineStrokeWidth}
      />
    );
  };

  const renderPoints = () => {
    const points = props.area.map((point, pointIndex) =>
      <SVGPoint
        key={pointIndex}
        x={point[0] - pointSize / 2}
        y={point[1] - pointSize / 2}
        draggable={editable}
        size={pointSize}
        className="fill-second"
        // The area should already be updated by onDrag
        // onDrop={(pos) => {
        //   if (props.onChange) props.onChange(area);
        // }}
        onDrag={(pos) => {
          updateAreaPoint(pointIndex, pos);
        }}
      />,
    );
    points.pop(); // Del the last point that is the same than the first and allow only to close the polyline
    return points;
  }

  return (
    <>
      {renderPolyline()}
      {renderPoints()}
    </>
  );
};
