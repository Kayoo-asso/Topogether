import React from 'react';
import { Icon } from '../Icon';

interface RoundButtonProps {
  iconName: string,
  white?: boolean,
  buttonSize?: number,
  iconClass?: string,
  iconSizeClass?: string,
  onClick?: () => void,
}

export const RoundButton: React.FC<RoundButtonProps> = ({
  white = true,
  buttonSize = 60,
  iconClass = 'stroke-main',
  iconSizeClass = 'h-6 w-6',
  ...props
}: RoundButtonProps) => (
  <button
    className={`shadow relative rounded-full z-40 ${white ? 'bg-white' : 'bg-main'}`}
    style={{ height: buttonSize+'px', width: buttonSize+'px' }}
    onClick={props.onClick}
  >
    <Icon
      name={props.iconName}
      center
      SVGClassName={`${iconSizeClass} ${iconClass}`}
    />
  </button>
);