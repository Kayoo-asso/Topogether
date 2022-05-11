import { getCoordsInViewbox, pointsToPolylineStr } from 'helpers';
import React, { useState } from 'react';
import { Position } from 'types';

interface DraggablePolylineProps {
  id?: string,
  points: Position[],
  className?: string,
  strokeWidth?: number,
  pointer?: boolean,
  vb: React.RefObject<SVGRectElement | null>,
  vbWidth: number,
  vbHeight: number,
  onDragStart?: () => void,
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

  const handleMouseDown: React.PointerEventHandler<SVGPolylineElement> = (e: React.PointerEvent) => {
    if (props.vb.current) {
      const coords = getCoordsInViewbox(props.vb.current, props.vbWidth, props.vbHeight, e.clientX, e.clientY)
      if (coords) {
        setCursorPosition({
          x: coords[0],
          y: coords[1],
          active: true,
        });
        if (props.onDragStart) props.onDragStart();
      }
      // Avoid registering clicks on the underlying SVG 
      // TODO: verify that this works
      e.stopPropagation();
    }
  };
  const handleMouseMove: React.PointerEventHandler<SVGPolylineElement> = (e: React.PointerEvent) => {
    if (props.vb.current && props.onDrag && cursorPosition.active) {
      const coords = getCoordsInViewbox(props.vb.current, props.vbWidth, props.vbHeight, e.clientX, e.clientY);

      if (coords) {
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
  const handleMouseUp: React.PointerEventHandler<SVGPolylineElement> = (e: React.PointerEvent) => {
    if (cursorPosition.active) {
      setCursorPosition({
        ...cursorPosition,
        active: false,
      });
    }
  };


  return (
    <polyline
      id={props.id}
      className={`${cursorPosition.active ? 'z-50' : 'z-20'} ${pointer ? 'cursor-pointer ' : ''}${className}`}
      points={pointsToPolylineStr(props.points)}
      strokeWidth={strokeWidth}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDownCapture={props.onClick}
    />
  );
};