/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback } from 'react';
import { Icon } from './Icon';

interface CheckboxProps {
  checked?: boolean,
  label?: string,
  className?: string,
  onClick: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  ...props
}: CheckboxProps) => {
  const handleClick = useCallback(() => {
    props.onClick(!checked);
  }, [props]);

  const iconOpacity = checked ? 'opacity-100' : 'opacity-0';
  const rotation = checked ? 'rotate-0' : 'rotate-90';
  const containerOpacity = !checked ? 'opacity-100' : 'opacity-0';

  return (
    <div
      className={`flex flex-row space-between ${props.className}`}
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <div className="relative h-5 w-5">
        <div className={`absolute h-5 w-5 left-0 top-0 stroke-dark rounded-[0.2rem] border-2 border-dark cursor-pointer ${containerOpacity} ${rotation} transition-transform`} />
        <Icon
          SVGClassName="absolute left-0 top-0 h-5 w-5 stroke-main"
          wrapperClassName={`absolute left-0 top-0 ${iconOpacity} transition-opacity`}
          name="checked"
          onClick={handleClick}
        />
      </div>
      <label
        htmlFor="1"
        className="ktext-base main inline-block ml-2 cursor-pointer leading-6"
      >
        {props.label}
      </label>
    </div>
  );
};

Checkbox.displayName = 'Checkbox';
