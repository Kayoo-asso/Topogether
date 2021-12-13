import React from 'react';
import { ReactSVG } from 'react-svg';

interface IconProps {
  name: string,
  wrapperClassName?: string,
  SVGClassName?: string,
  center?: boolean,
  onClick?: () => void,
}

export const Icon: React.FC<IconProps> = ({
  SVGClassName = 'stroke-main h-8 w-8',
  center = false,
  ...props
}: IconProps) => (
  <ReactSVG
    src={`/assets/icons/_${props.name}.svg`}
    wrapper="span"
    className={`h-full ${center ? 'flex flex-col justify-center items-center' : ''} ${props.wrapperClassName}`}
    beforeInjection={(svg) => {
      svg.setAttribute('class', `${SVGClassName}`);
    }}
    loading={() => <span className="ktext-subtext">Loading...</span>}
    onClick={props.onClick}
  />
);
