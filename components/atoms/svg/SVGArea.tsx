import React, { useEffect, useState } from 'react';
import { AreaType, CoordinatesType } from 'types';
import { DraggablePolyline } from '.';
import { pointsToPolylineStr, useRefState } from '../../../helpers';
import { SVGPoint } from './SVGPoint';

interface SVGAreaProps {
    area: AreaType,
    ratio?: {
        rX: number,
        rY: number,
    },
    editable?: boolean,
    pointSize?: number,
    onChange?: (area: AreaType) => void,
}

export const SVGArea: React.FC<SVGAreaProps> = (props: SVGAreaProps) => {
  const [area, setArea] = useState(props.area);

  const updateAreaPoint = (index: number, pos: CoordinatesType) => {
    const newArea = {...area};
    newArea.points[index] = {
      ...newArea.points[index],
      posX: pos.posX + props.pointSize/2,
      posY: pos.posY + props.pointSize/2,
    }
    if (index === 0) {
      newArea.points[area.points.length - 1] = {
        ...newArea.points[area.points.length - 1],
        posX: pos.posX + props.pointSize/2,
        posY: pos.posY + props.pointSize/2,
      }
    }
    setArea(newArea);
  }
  const dragAllPoints = (diffX: number, diffY: number) => {
    const newArea = {...area};
    for (let i=0; i<newArea.points.length; i++) {
      newArea.points[i] = {
        ...newArea.points[i],
        posX: newArea.points[i].posX + diffX,
        posY: newArea.points[i].posY + diffY
      };
    }
    setArea(newArea);
  }

  useEffect(() => {
    setArea(props.area);
  }, [props.area]);

  const renderPolyline = () => {
    if (props.area && props.area.points) {
      const lineStrokeWidth = 2*props.ratio.rX;
      if (props.editable) {
        return (
          <DraggablePolyline 
            className={"stroke-second fill-second z-20"}
            strokeWidth={lineStrokeWidth}
            points={area.points}
            onDrag={(diffX, diffY) => {
              dragAllPoints(diffX, diffY);
            }}
            onDrop={() => {
              if (props.onChange) props.onChange(area);
            }}
          />
        )
      }
      else {
        return (
          <polyline 
            className={"stroke-second fill-second z-20"}
            points={pointsToPolylineStr(area.points)}
            strokeWidth={lineStrokeWidth}
          />
        )
      }
    }
    else return null;
  }
  const renderPoints = () => {
    if (props.area && props.area.points) {
      let SVGpoints: any[] = [];
      if (props.editable) {
        area.points.forEach((point, pointIndex) => {
          SVGpoints.push(
            <SVGPoint 
              key={pointIndex} 
              x={point.posX - props.pointSize/2}
              y={point.posY - props.pointSize/2}
              draggable={props.editable}
              size={props.pointSize}
              className="fill-second"
              onDrop={pos => {
                if (props.onChange) props.onChange(area);
              }}
              onDrag={pos => {
                updateAreaPoint(pointIndex, pos);
              }}
            />
          )
        });
        SVGpoints.pop(); //Del the last point that is the same than the first and allow only to close the polyline
      }
      return (SVGpoints);
    }
    else return null;
  }

  return (
    <>
      {renderPolyline()}
      {renderPoints()}
    </>     
  )
}

SVGArea.defaultProps = {
  ratio: { rX: 1, rY: 1 },
  editable: false,
  pointSize: 3,
}