/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Icon } from './Icon';

interface CheckboxProps {
  checked?: boolean,
  label?: string,
  className?: string,
  onClick: (isChecked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  ...props
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [animated, setAnimated] = useState(false);

  const handleClick = () => {
    setIsChecked(!isChecked);
    props.onClick(isChecked);
    setAnimated(true);
  };

  return (
    <div className={`flex flex-row space-between ${props.className}`}>
      <div
        className={`absolute h-5 w-5 stroke-dark cursor-pointer rounded border-2 border-dark ${checked && 'opacity-0'} ${animated && (isChecked ? 'animate-check' : 'animate-uncheck')}`}
        onClick={handleClick}
        onKeyDown={handleClick}
        role="checkbox"
        id="1"
        tabIndex={0}
        aria-checked={isChecked}
      />
      <Icon
        SVGClassName={`h-5 w-5 stroke-main cursor-pointer ${!checked && 'opacity-0'}  ${animated && (isChecked ? 'animate-fadein' : 'animate-fadeout')}`}
        name="checked"
        onClick={handleClick}
      />
      <label
        htmlFor="1"
        className="ktext-base main inline-block ml-2"
      >
        {props.label}
      </label>
    </div>
  );
};
