import React, { useEffect, useState } from 'react';
import { Polygon, Point } from 'types';
import { DraggablePolyline } from '.';
import { pointsToPolylineStr } from '../../../helpers';
import { SVGPoint } from './SVGPoint';

interface SVGAreaProps {
  area: Polygon,
  ratio: {
    rX: number,
    rY: number,
  },
  editable: boolean,
  pointSize: number,
  onChange?: (area: Polygon) => void,
}

export const SVGArea: React.FC<SVGAreaProps> = ({
  ratio = { rX: 1, rY: 1 },
  editable = false,
  pointSize = 3,
  ...props
}: SVGAreaProps) => {
  const [area, setArea] = useState(props.area);

  const updateAreaPoint = (index: number, pos: Point) => {
    const newArea = { ...area };
    newArea.coordinates[index] = {
      ...newArea.coordinates[index],
      x: pos.x + pointSize / 2,
      y: pos.y + pointSize / 2,
    };
    if (index === 0) {
      newArea.coordinates[area.coordinates.length - 1] = {
        ...newArea.coordinates[area.coordinates.length - 1],
        x: pos.x + pointSize / 2,
        y: pos.y + pointSize / 2,
      };
    }
    setArea(newArea);
  };
  const dragAllPoints = (diffX: number, diffY: number) => {
    const newArea = { ...area };
    for (let i = 0; i < newArea.coordinates.length; i++) {
      newArea.coordinates[i] = {
        ...newArea.coordinates[i],
        x: newArea.coordinates[i].x + diffX,
        y: newArea.coordinates[i].y + diffY,
      };
    }
    setArea(newArea);
  };

  useEffect(() => {
    setArea(props.area);
  }, [props.area]);

  const renderPolyline = () => {
    if (props.area && props.area.coordinates) {
      const lineStrokeWidth = 2 * ratio.rX;
      if (editable) {
        return (
          <DraggablePolyline 
            className={"stroke-second fill-second/10 z-20 svg-area"}
            strokeWidth={lineStrokeWidth}
            points={area.coordinates}
            onDrag={(diffX, diffY) => {
              dragAllPoints(diffX, diffY);
            }}
            onDrop={() => {
              if (props.onChange) props.onChange(area);
            }}
          />
        );
      }

      return (
        <polyline
          className="stroke-second fill-second z-20"
          points={pointsToPolylineStr(area.coordinates)}
          strokeWidth={lineStrokeWidth}
        />
      );
    }
    return null;
  };
  const renderPoints = () => {
    if (props.area && props.area.coordinates) {
      const SVGpoints: any[] = [];
      if (editable) {
        area.coordinates.forEach((point, pointIndex) => {
          SVGpoints.push(
            <SVGPoint
              key={pointIndex}
              x={point.x - pointSize / 2}
              y={point.y - pointSize / 2}
              draggable={editable}
              size={pointSize}
              className="fill-second"
              onDrop={(pos) => {
                if (props.onChange) props.onChange(area);
              }}
              onDrag={(pos) => {
                updateAreaPoint(pointIndex, pos);
              }}
            />,
          );
        });
        SVGpoints.pop(); // Del the last point that is the same than the first and allow only to close the polyline
      }
      return (SVGpoints);
    }
    return null;
  };

  return (
    <>
      {renderPolyline()}
      {renderPoints()}
    </>
  );
};