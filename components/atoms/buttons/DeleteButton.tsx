import React from 'react';
import { Icon } from '../Icon';

interface DeleteButtonProps {
  onClick: () => void,
}

export const DeleteButton: React.FC<DeleteButtonProps> = (props) => (
  <button
    className="shadow rounded-full p-0.5 border-dark border-2 bg-grey-medium bg-opacity-80 cursor-pointer"
    onClick={props.onClick}
  >
    <Icon
      name="clear"
      className="h-3 w-3 stroke-dark stroke-2"
    />
  </button>
);
