import React from 'react';
import { Icon } from '../Icon';

interface RoundButtonProps {
  iconName: string,
  iconClass?: string,
  white?: boolean,
  onClick: () => void,
}

export const RoundButton: React.FC<RoundButtonProps> = ({
  white = true,
  iconClass = 'stroke-main',
  ...props
}: RoundButtonProps) => (
  <button
    className={
                    `shadow rounded-full p-5${
                      white
                        ? ' bg-white'
                        : ' bg-main'}`
                }
    onClick={props.onClick}
  >
    <Icon
      name={props.iconName}
      className={`h-6 w-6 ${iconClass}`}
    />
  </button>
);