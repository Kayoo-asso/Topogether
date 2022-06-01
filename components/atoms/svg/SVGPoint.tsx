import { getCoordsInViewbox } from 'helpers';
import React, { useState } from 'react';
import { Position } from 'types';

interface SVGPointProps {
  x: number,
  y: number,
  draggable?: boolean,
  vb: React.RefObject<SVGRectElement | null>,
  eraser?: boolean,
  iconHref?: string,
  size: number,
  className?: string,
  onDrag?: (coord: Position) => void,
  onClick?: (e: React.MouseEvent<SVGImageElement, MouseEvent>) => void,
}

export const SVGPoint: React.FC<SVGPointProps> = ({
  draggable = false,
  eraser = false,
  iconHref = '/assets/icons/colored/line-point/_line-point-grey.svg',
  className = 'fill-main',
  ...props
}: SVGPointProps) => {
  // don't put x & y here, to avoid derived state
  // The main risk is that internal state becomes out-of-sync with parent components
  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
  const [position, setPosition] = useState({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });
  
  const handlePointerDown: React.PointerEventHandler<SVGImageElement> = (e: React.PointerEvent) => {
    if (draggable && props.vb.current) {
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      const coords = getCoordsInViewbox(props.vb.current, e.clientX, e.clientY);
      if (coords) {
        setPosition({
          ...position,
          active: true,
          offsetX: coords[0] - props.x,
          offsetY: coords[1] - props.y,
        });
      }
    }
  };
  const handlePointerMove: React.PointerEventHandler<SVGImageElement> = (e: React.PointerEvent) => {
    if (position.active && props.vb.current && props.onDrag) {
      const coords = getCoordsInViewbox(props.vb.current, e.clientX, e.clientY);
      if (coords) {
        const newX = coords[0] - position.offsetX;
        const newY = coords[1] - position.offsetY;
        props.onDrag([newX, newY]);
      }
    }
  };
  const handlePointerUp: React.PointerEventHandler<SVGImageElement> = (e: React.PointerEvent) => {
    if (position.active && props.vb.current && props.onDrag) {
      const coords = getCoordsInViewbox(props.vb.current, e.clientX, e.clientY);
      if (coords) {
        const newX = coords[0] - position.offsetX;
        const newY = coords[1] - position.offsetY;
        props.onDrag([newX, newY]);
      }
      setPosition({
        offsetX: 0,
        offsetY: 0,
        active: false,
      });
    }
  };

  return (
      <image
        x={iconHref.includes('line-point') ? props.x : props.x - props.size/2}
        y={iconHref.includes('line-point') ? props.y : props.y - props.size/2}
        className={`touch-none ${className} ${(draggable && !eraser) ? 'cursor-pointer' : ''}${eraser ? ' hover:scale-150 origin-center' : ''}`}
        style={{
          transformBox: 'fill-box'
        }}
        href={iconHref}
        width={props.size}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onClick={(e) => {
          e.stopPropagation();
          props.onClick && props.onClick(e);
        }}
      />
  );
};