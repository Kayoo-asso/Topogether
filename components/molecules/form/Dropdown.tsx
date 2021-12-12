import { Checkbox } from 'components/atoms/Checkbox';
import { Icon } from 'components/atoms/Icon';
import React from 'react';

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

export const Dropdown: React.FC<DropdownProps> = (props) => (
  <div className="shadow mt-2 py-2 w-60 bg-white rounded-lg">
    {props.choices.map((choice) => (
      choice.isSection
        ? (
          <div
            className="px-4 py-2 text-grey-medium uppercase"
            key={choice.value}
          >
            {choice.label}
          </div>
        )
        : (
          <div
            className="px-4 py-2 capitalize text-dark cursor-pointer flex flex-row"
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

Dropdown.defaultProps = {
  onSelect: () => {},
};
