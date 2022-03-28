import React from 'react';
import { Icon } from '../Icon';

interface RoundButtonProps {
  iconName: string,
  white?: boolean,
  buttonSize?: number,
  className?: string,
  iconClass?: string,
  iconSizeClass?: string,
  onClick?: () => void,
}

export const RoundButton: React.FC<RoundButtonProps> = ({
  white = true,
  buttonSize = 60,
  className = '',
  iconClass = 'stroke-main',
  iconSizeClass = 'h-6 w-6',
  ...props
}: RoundButtonProps) => {
  return (
    <button
      className={`shadow relative rounded-full ${white ? 'bg-white' : 'bg-main'} ${className ? className : 'z-40'}`}
      style={{ height: buttonSize+'px', width: buttonSize+'px' }}
      onClick={props.onClick}
    >
      <Icon
        name={props.iconName}
        center
        SVGClassName={`${iconSizeClass} ${iconClass}`}
      />
    </button>
)};