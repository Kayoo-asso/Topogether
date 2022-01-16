import React from 'react';
import { Icon, Checkbox } from '../../atoms';

export interface DropdownOption {
  value: any;
  label?: string;
  isSection?: boolean;
  action?: () => void;
  icon?: string;
  checked?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  onSelect?: (option: DropdownOption) => void;
  type?: string;
  className?:string;
}

export const Dropdown: React.FC<DropdownProps> = React.memo(({
  className = '',
  ...props
}: DropdownProps) => (
  <div className={`shadow absolute z-100 w-full px-7 py-5 bg-white rounded-b ${className}`}>
    {props.options.map((opt, i) => (
      opt.isSection ? (
        <div
          className={`text-grey-medium ktext-label uppercase ${i > 0 && 'mt-5'}`}
          key={opt.value}
          onKeyDown={() => {
            props.onSelect && props.onSelect(opt);
            opt.action && opt.action();
          }}
          onMouseDown={() => {
            props.onSelect && props.onSelect(opt);
            opt.action && opt.action();
          }}
          role="menuitem"
          tabIndex={0}
        >
          {opt.label || opt.value}
        </div>
      ) : (
        <div
          className="py-4 text-dark ktext-base cursor-pointer flex flex-row items-center"
          key={opt.value}
          onKeyDown={() => {
            props.onSelect && props.onSelect(opt);
            opt.action && opt.action();
          }}
          onMouseDown={() => {
            props.onSelect && props.onSelect(opt);
            opt.action && opt.action();
          }}
          role="menuitem"
          tabIndex={0}
        >
          {props.type === 'checkbox' && props.onSelect && (
            <Checkbox
              className="mr-2"
              checked={opt.checked}
              onClick={() => { props.onSelect && props.onSelect(opt); }}
            />
          )}
          {opt.icon && (
          <Icon
            name={opt.icon}
            SVGClassName="stroke-black h-5 w-5 mr-5"
          />
          )}

          {opt.label || opt.value}

        </div>
      )))}
  </div>
));

Dropdown.displayName = 'Dropdown';
