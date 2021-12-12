import React, { useEffect, useState } from 'react';
import { Area, Coordinates } from 'types';
import { DraggablePolyline } from '.';
import { pointsToPolylineStr } from '../../../helpers';
import { SVGPoint } from './SVGPoint';

interface SVGAreaProps {
  area: Area,
  ratio: {
    rX: number,
    rY: number,
  },
  editable: boolean,
  pointSize: number,
  onChange?: (area: Area) => void,
}

export const SVGArea: React.FC<SVGAreaProps> = ({
  ratio = { rX: 1, rY: 1 },
  editable = false,
  pointSize = 3,
  ...props
}: SVGAreaProps) => {
  const [area, setArea] = useState(props.area);

  const updateAreaPoint = (index: number, pos: Coordinates) => {
    const newArea = { ...area };
    newArea.points[index] = {
      ...newArea.points[index],
      posX: pos.posX + pointSize / 2,
      posY: pos.posY + pointSize / 2,
    };
    if (index === 0) {
      newArea.points[area.points.length - 1] = {
        ...newArea.points[area.points.length - 1],
        posX: pos.posX + pointSize / 2,
        posY: pos.posY + pointSize / 2,
      };
    }
    setArea(newArea);
  };
  const dragAllPoints = (diffX: number, diffY: number) => {
    const newArea = { ...area };
    for (let i = 0; i < newArea.points.length; i++) {
      newArea.points[i] = {
        ...newArea.points[i],
        posX: newArea.points[i].posX + diffX,
        posY: newArea.points[i].posY + diffY,
      };
    }
    setArea(newArea);
  };

  useEffect(() => {
    setArea(props.area);
  }, [props.area]);

  const renderPolyline = () => {
    if (props.area && props.area.points) {
      const lineStrokeWidth = 2 * ratio.rX;
      if (editable) {
        return (
          <DraggablePolyline 
            className={"stroke-second fill-second/10 z-20 svg-area"}
            strokeWidth={lineStrokeWidth}
            points={area.points}
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
          points={pointsToPolylineStr(area.points)}
          strokeWidth={lineStrokeWidth}
        />
      );
    }
    return null;
  };
  const renderPoints = () => {
    if (props.area && props.area.points) {
      const SVGpoints: any[] = [];
      if (editable) {
        area.points.forEach((point, pointIndex) => {
          SVGpoints.push(
            <SVGPoint
              key={pointIndex}
              x={point.posX - pointSize / 2}
              y={point.posY - pointSize / 2}
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
