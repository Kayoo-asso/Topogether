import React, { useState } from 'react';
import { Icon } from './Icon';

interface CheckboxProps {
  checked: boolean,
  label?: string,
  onClick: () => void
}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const [isChecked, setIsChecked] = useState(props.checked);
  const icon = isChecked ? 'checked' : 'checkbox';
  const iconColor = isChecked ? 'stroke-main' : 'stroke-dark';

  const handleClick = () => {
    setIsChecked(!isChecked);
    props.onClick();
  };

  return (
    <div className="flex items-center">
      <Icon
        className={`h-5 w-5 mr-2 ${iconColor}`}
        name={icon}
        onClick={handleClick}
      />
      <span className="ktext-base dark">
        {props.label}

      </span>
    </div>
  );
};
