import React from 'react';
import { Icon } from '../../atoms/Icon';
import { Checkbox } from '../../atoms/Checkbox';

interface DropdownOption {
  label: string;
  value: any;
  isSection?: boolean;
  action?: () => void;
  icon?: string;
  checked?: boolean;
}

interface DropdownProps {
  choices: DropdownOption[];
  onSelect?: (value: any) => void;
  type?: string;
  className?:string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  ...props
}: DropdownProps) => (
  <div className={`shadow px-7 py-5 bg-white rounded-b-lg ${props.className}`}>
    {props.choices.map((choice, i) => (
      choice.isSection
        ? (
          <div
            className={`text-grey-medium ktext-label uppercase ${i > 0 && 'mt-5'}`}
            key={choice.value}
          >
            {choice.label}
          </div>
        )
        : (
          <div
            className="py-2 capitalize text-dark ktext-base cursor-pointer flex flex-row items-center"
            key={choice.value}
            onKeyDown={() => choice.action && choice.action()}
            onMouseDown={() => choice.action && choice.action()}
            role="menuitem"
            tabIndex={0}
          >
            {props.type === 'checkbox' && props.onSelect && <Checkbox className="mr-2" checked={choice.checked} onClick={() => props.onSelect && props.onSelect(choice.value)} />}
            {choice.icon
              && (
              <Icon
                name={choice.icon}
                SVGClassName="stroke-black h-5 w-5 mr-2"
              />
              )}
            {choice.label}
          </div>
        )))}
  </div>
);
