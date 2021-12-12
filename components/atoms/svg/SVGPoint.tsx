import React, { useState, useEffect } from 'react';
import { ColorType, CoordinatesType } from 'types';

interface SVGPointProps {
  x: number,
  y: number,
  draggable?: boolean,
  iconName?: string,
  size?: number,
  className?: string,
  onDrag?: (coord: CoordinatesType) => void,
  onDrop?: (coord: CoordinatesType) => void,
}

export const SVGPoint: React.FC<SVGPointProps> = (props: SVGPointProps) => {
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
    if (props.draggable) {
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
    if (props.draggable) {
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
        if (props.onDrag) props.onDrag({ posX, posY });
      }
    }
  };
  const handlePointerUp: React.PointerEventHandler<SVGSVGElement> = (e: React.PointerEvent) => {
    if (props.draggable) {
      setPosition({
        ...position,
        active: false,
      });
      if (props.onDrop) props.onDrop({ posX: position.x, posY: position.y });
    }
  };

  const renderPoint = () => (
    <svg
      x={position.x}
      y={position.y}
      className={`${props.className} ${props.draggable ? ' draggable' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <image
        href={`/assets/icons/_${props.iconName}.svg`}
        width={props.size}
      />
    </svg>
  );

  return (
    <>
      {renderPoint()}
    </>
  );
};

SVGPoint.defaultProps = {
  draggable: false,
  iconName: 'line-point',
  size: 5,
  className: 'fill-main',
};
