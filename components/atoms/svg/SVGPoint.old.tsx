import React, { useState, useEffect } from 'react';
import { Point } from 'types';

interface SVGPointProps {
  x: number,
  y: number,
  draggable?: boolean,
  iconName?: string,
  size?: number,
  className?: string,
  onDrag?: (coord: Point) => void,
  onDrop?: (coord: Point) => void,
}

export const SVGPoint: React.FC<SVGPointProps> = ({
  draggable = false,
  iconName = 'line-point',
  size = 5,
  className = 'fill-main',
  ...props
}: SVGPointProps) => {
  const [position, setPosition] = useState({
    x: props.x,
    y: props.y,
    active: false,
    offset: {
      x: 0,
      y: 0,
    },
  });

  useEffect(() => {
    setPosition({
      ...position,
      x: props.x,
      y: props.y,
    });
  }, [props.x, props.y]);

  const handlePointerDown: React.PointerEventHandler<SVGSVGElement> = (e: React.PointerEvent) => {
    if (draggable) {
      const el = e.currentTarget;
      const bbox = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bbox.left;
      const y = e.clientY - bbox.top;
      el.setPointerCapture(e.pointerId);
      setPosition({
        ...position,
        active: true,
        offset: {
          x,
          y,
        },
      });
    }
  };
  const handlePointerMove: React.PointerEventHandler<SVGSVGElement> = (e: React.PointerEvent) => {
    if (draggable) {
      const bbox = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bbox.left;
      const y = e.clientY - bbox.top;
      if (position.active) {
        const posX = position.x - (position.offset.x - x);
        const posY = position.y - (position.offset.y - y);
        setPosition({
          ...position,
          x: posX,
          y: posY,
        });
        if (props.onDrag) props.onDrag({ x: posX, y: posY });
      }
    }
  };
  const handlePointerUp: React.PointerEventHandler<SVGSVGElement> = (e: React.PointerEvent) => {
    if (draggable) {
      setPosition({
        ...position,
        active: false,
      });
      if (props.onDrop) props.onDrop({ x: position.x, y: position.y });
    }
  };

  const renderPoint = () => (
    <svg
      x={position.x}
      y={position.y}
      className={`${className} ${draggable ? ' draggable' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <image
        href={`/assets/icons/_${iconName}.svg`}
        width={size}
      />
    </svg>
  );

  return (
    <>
      {renderPoint()}
    </>
  );
};