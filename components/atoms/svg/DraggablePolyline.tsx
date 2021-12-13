import { pointsToPolylineStr } from 'helpers';
import React, { useState } from 'react';
import { Coordinates } from 'types';

interface DraggablePolylineProps {
  points: Coordinates[],
  className?: string,
  strokeWidth?: number,
  onDrag?: (diffX: number, diffY: number) => void
  onDrop?: () => void,
}

export const DraggablePolyline: React.FC<DraggablePolylineProps> = ({
  className = 'stroke-main',
  strokeWidth = 2,
  ...props
}: DraggablePolylineProps) => {
  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0,
    active: false,
  });

  const handlePointerDown: React.PointerEventHandler<SVGPolylineElement> = (e: React.PointerEvent) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY,
      active: true,
    });
  };

  const handlePointerMove: React.PointerEventHandler<SVGPolylineElement> = (e: React.PointerEvent) => {
    if (cursorPosition.active) {
      const diffX = e.clientX - cursorPosition.x;
      const diffY = e.clientY - cursorPosition.y;
      if (props.onDrag) props.onDrag(diffX, diffY);
      setCursorPosition({
        ...cursorPosition,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };
  const handlePointerUp: React.PointerEventHandler<SVGPolylineElement> = (e: React.PointerEvent) => {
    if (cursorPosition.active) {
      setCursorPosition({
        ...cursorPosition,
        active: false,
      });
      if (props.onDrop) props.onDrop();
    }
  };

  return (
    <polyline
      className={`cursor-pointer ${className}`}
      points={pointsToPolylineStr(props.points)}
      strokeWidth={strokeWidth}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    />
  );
};