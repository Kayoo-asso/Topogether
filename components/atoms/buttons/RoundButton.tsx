import React from 'react';
import { Icon } from '../Icon';

interface RoundButtonProps {
  iconName: string,
  iconClass?: string,
  white?: boolean,
  onClick: () => void,
}

export const RoundButton: React.FC<RoundButtonProps> = (props) => (
  <button
    className={
                    `shadow rounded-full p-5${
                      props.white
                        ? ' bg-white'
                        : ' bg-main'}`
                }
    onClick={props.onClick}
    type="button"
  >
    <Icon
      name={props.iconName}
      className={`h-6 w-6 ${props.iconClass}`}
    />
  </button>
);

RoundButton.defaultProps = {
  white: true,
  iconClass: 'stroke-main',
};
