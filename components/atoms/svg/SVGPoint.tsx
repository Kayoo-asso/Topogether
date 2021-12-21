import React, { useState } from 'react';
import { Position } from 'types';

interface SVGPointProps {
  x: number,
  y: number,
  draggable?: boolean,
  iconName?: string,
  size?: number,
  className?: string,
  onDrag?: (coord: Position) => void,
  onDrop?: (coord: Position) => void,
}

export const SVGPoint: React.FC<SVGPointProps> = ({
  draggable = false,
  iconName = 'line-point',
  size = 5,
  className = 'fill-main',
  ...props
}: SVGPointProps) => {
  // don't put x & y here, to avoid derived state
  // The main risk is that internal state becomes out-of-sync with parent components
  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
  // TODO: is active necessary? Does onPointerMove fire when pointer capure is not set?
  // TODO: verify that the offset works correctly
  const [position, setPosition] = useState({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });


  const handlePointerDown: React.PointerEventHandler<SVGImageElement> = (e: React.PointerEvent) => {
    if (draggable) {
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      setPosition({
        ...position,
        active: true,
        offsetX: e.clientX - props.x,
        offsetY: e.clientY - props.y,
      });
    }
  };

  const handlePointerMove: React.PointerEventHandler<SVGImageElement> = (e: React.PointerEvent) => {
    if (position.active) {
      const newX = e.clientX - position.offsetX;
      const newY = e.clientY - position.offsetY;
      if (props.onDrag) props.onDrag([newX, newY]);
    }
  };

  const handlePointerUp: React.PointerEventHandler<SVGImageElement> = (e: React.PointerEvent) => {
    if (position.active) {
      const newX = e.clientX - position.offsetX;
      const newY = e.clientY - position.offsetY;
      if (props.onDrag) props.onDrag([newX, newY]);
      setPosition({
        offsetX: 0,
        offsetY: 0,
        active: false,
      });
    }
  };


  return (
      <image
        x={props.x}
        y={props.y}
        className={`${className} ${draggable ? ' draggable' : ''}`}
        href={`/assets/icons/_${iconName}.svg`}
        width={size}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      />
  );
};