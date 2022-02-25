import React, { CSSProperties } from 'react';
import { Icon, Checkbox } from '../../atoms';

export interface DropdownOption {
  value: any;
  label?: string;
  isSection?: boolean;
  action?: () => void;
  icon?: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  onSelect?: (option: DropdownOption) => void;
  type?: string;
  fullSize?: boolean,
  className?:string;
  style?: CSSProperties | undefined;
}

export const Dropdown: React.FC<DropdownProps> = React.memo(({
  className = '',
  fullSize = false,
  ...props
}: DropdownProps) => (
  <div
    className={`shadow absolute z-100 ${fullSize ? 'w-full' : ''} px-7 bg-white rounded ${className}`}
    style={props.style}
  >
    {props.options.map((opt, i) => (
      opt.isSection ? (
        <div
          className={`text-grey-medium ktext-label uppercase ${i > 0 && 'mt-5'}`}
          key={opt.value}
          role="menuitem"
          tabIndex={0}
        >
          {opt.label || opt.value}
        </div>
      ) : (
        <div
          className={`h-16 ${opt.disabled ? 'text-grey-medium': 'text-dark cursor-pointer'} ktext-base flex flex-row items-center`}
          key={opt.value}
          onKeyDown={() => {
            props.onSelect && props.onSelect(opt);
            opt.action && !opt.disabled && opt.action();
          }}
          onMouseDown={() => {
            props.onSelect && props.onSelect(opt);
            opt.action && !opt.disabled && opt.action();
          }}
          role="menuitem"
          tabIndex={0}
        >
          {opt.icon && (
            <Icon
              name={opt.icon}
              SVGClassName={`${opt.disabled ? 'stroke-grey-medium': 'stroke-black'} h-5 w-5 mr-5`}
            />
            )}
          {opt.label || opt.value}
        </div>
      )))}
  </div>
));

Dropdown.displayName = 'Dropdown';
