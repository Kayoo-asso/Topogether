import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';

interface CheckboxProps {
  checked?: boolean,
  label?: string,
  onClick: () => void
}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const [isChecked, setIsChecked] = useState(props.checked);

  const handleClick = () => {
    setIsChecked(!isChecked);
    props.onClick();
  };

  return (
    <div className="flex items-center">
      <Icon
        className={`absolute h-5 w-5 mr-2 stroke-main opacity-0 cursor-pointer ${isChecked ? 'animate-fadein' : 'animate-fadeout'}`}
        name="checked"
        onClick={handleClick}
      />
      <Icon
        className={`absolute m-2 h-10 w-10 mr-2 stroke-dark cursor-pointer ${isChecked ? 'animate-check' : 'animate-uncheck'}`}
        name="checkbox"
        onClick={handleClick}
      />
      <div className="ktext-base main">
        {props.label}
      </div>
    </div>
  );
};
