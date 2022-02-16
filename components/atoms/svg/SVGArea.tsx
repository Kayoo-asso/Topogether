import React from 'react';
import { LinearRing, Position } from 'types';
import { DraggablePolyline } from '.';
import { pointsToPolylineStr, ratioPoint } from '../../../helpers';
import { SVGPoint } from './SVGPoint';

interface SVGAreaProps {
  // a LinearRing delineates the contour of a Polygon
  area: LinearRing,
  rx: number,
  ry: number,
  editable?: boolean,
  eraser?: boolean,
  pointSize: number,
  className?: string,
  onChange?: (area: LinearRing) => void,
  onClick?: () => void,
}

export const SVGArea: React.FC<SVGAreaProps> = ({
  rx = 1,
  ry = 1,
  editable = false,
  eraser = false,
  pointSize = 5,
  className = '',
  ...props
}: SVGAreaProps) => {
  const initialPoints = Object.values(props.area)
  const points = initialPoints.map(p => ratioPoint(p, rx)) as Position[];
  points.push(ratioPoint(initialPoints[0], rx));

  const updateAreaPoint = (index: 0 | 1 | 2 | 3, newPos: Position) => {
    if (props.onChange) {
      const newArea = {...props.area};
      newArea[index] = [newPos[0]/rx, newPos[1]/ry];
      props.onChange(newArea);
    }
  };

  const dragAllPoints = (diffX: number, diffY: number) => {
    if (props.onChange) {
      const newArea: LinearRing = [
        [props.area[0][0] + diffX/rx, props.area[0][1] + diffY/rx],
        [props.area[1][0] + diffX/rx, props.area[1][1] + diffY/rx],
        [props.area[2][0] + diffX/rx, props.area[2][1] + diffY/rx],
        [props.area[3][0] + diffX/rx, props.area[3][1] + diffY/rx],
      ];
      props.onChange(newArea);
    }
  };

  const renderPolyline = () => {
    const lineStrokeWidth = 2;
    if (editable) {
      return (
        <DraggablePolyline
          className={`stroke-second fill-second/10 z-20 ${eraser ? 'hover:fill-second/50' : ''} ${className}`}
          strokeWidth={lineStrokeWidth}
          points={points}
          pointer={!eraser}
          onDrag={(diffX, diffY) => {
            dragAllPoints(diffX, diffY);
          }}
          onClick={props.onClick}
        />
      );
    }

    return (
      <polyline
        className={`stroke-second fill-second/10 z-20 ${className}`}
        points={pointsToPolylineStr(points)}
        strokeWidth={lineStrokeWidth}
      />
    );
  };

  const renderPoints = () => {
      return points.map((point, index) => (
        <SVGPoint
          key={index}
          x={point[0] - pointSize / 2}
          y={point[1] - pointSize / 2}
          iconHref='/assets/icons/colored/line-point/_line-point-second.svg'
          draggable={editable}
          size={pointSize}
          className="fill-second"
          onDrag={(pos) => {
            const idx = (index < 4) ? index : 0;
            updateAreaPoint(idx as 0|1|2|3, pos);
          }}
        />
      ))
  }

  return (
    <>
      {renderPolyline()}
      {renderPoints()}
    </>
  );
};
