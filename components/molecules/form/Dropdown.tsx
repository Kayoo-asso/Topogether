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
}

export const Dropdown: React.FC<DropdownProps> = ({
  ...props
}: DropdownProps) => (
  <div className="shadow px-7 py-5 w-60 bg-white rounded-lg">
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
            className="py-2 capitalize text-dark ktext-bgase cursor-pointer flex flex-row items-center"
            key={choice.value}
            onKeyUp={choice.action}
            onClick={choice.action}
            role="menuitem"
            tabIndex={0}
          >
            {props.type === 'checkbox' && props.onSelect && <Checkbox checked={choice.checked} onClick={() => props.onSelect && props.onSelect(choice.value)} />}
            {choice.icon && <Icon name={choice.icon} className="stroke-black h-5 w-5 mr-2" />}
            {choice.label}
          </div>
        )))}
  </div>
);
