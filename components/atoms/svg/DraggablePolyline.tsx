import { getCoordsInViewbox, pointsToPolylineStr } from 'helpers';
import React, { useState } from 'react';
import { Position } from 'types';

interface DraggablePolylineProps {
  points: Position[],
  className?: string,
  strokeWidth?: number,
  pointer?: boolean,
  vb?: SVGRectElement | null,
  vbWidth?: number,
  vbHeight?: number,
  onDrag?: (diffX: number, diffY: number) => void
  onClick?: () => void,
}

export const DraggablePolyline: React.FC<DraggablePolylineProps> = ({
  className = 'stroke-main',
  strokeWidth = 2,
  pointer = true,
  ...props
}: DraggablePolylineProps) => {
  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0,
    active: false,
  });

  const handlePointerDown: React.PointerEventHandler<SVGPolylineElement> = (e: React.PointerEvent) => {
    if (props.vb && props.vbWidth && props.vbHeight) {
      const coords = getCoordsInViewbox(props.vb, props.vbWidth, props.vbHeight, e.clientX, e.clientY)
      if (coords) {
        setCursorPosition({
          x: coords[0],
          y: coords[1],
          active: true,
        });
      }
      // Avoid registering clicks on the underlying SVG 
      // TODO: verify that this works
      e.stopPropagation();
    }
  };

  const handlePointerMove: React.PointerEventHandler<SVGPolylineElement> = (e: React.PointerEvent) => {
    if (props.vb && props.vbWidth && props.vbHeight && props.onDrag && cursorPosition.active) {
      const coords = getCoordsInViewbox(props.vb, props.vbWidth, props.vbHeight, e.clientX, e.clientY);
      if (cursorPosition.active && coords) {
        const diffX = coords[0] - cursorPosition.x;
        const diffY = coords[1] - cursorPosition.y;
        props.onDrag(diffX, diffY);
        setCursorPosition({
          ...cursorPosition,
          x: coords[0],
          y: coords[1],
        });
      }
    }
  };
  const handlePointerUp: React.PointerEventHandler<SVGPolylineElement> = (e: React.PointerEvent) => {
    if (cursorPosition.active) {
      setCursorPosition({
        ...cursorPosition,
        active: false,
      });
    }
  };


  return (
    <polyline
      className={`${pointer ? 'cursor-pointer ' : ''}${className}`}
      points={pointsToPolylineStr(props.points)}
      strokeWidth={strokeWidth}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onClick={props.onClick}
    />
  );
};