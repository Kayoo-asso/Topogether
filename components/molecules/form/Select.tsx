import React, {
  useRef, useState,
} from 'react';
import { Icon } from '../../atoms/Icon';
import { Dropdown } from './Dropdown';
import { TextInput } from './TextInput';

interface DropdownOption {
  label: string;
  value: any;
}

interface SelectProps {
  id: string;
  label: string;
  choices: DropdownOption[];
  selected: any;
  onSelect: (value: any) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedChoice = props.choices.find((choice) => choice.value === props.selected);
  const [value, setValue] = useState(selectedChoice?.label);

  return (
    <div
      id={props.id}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      className={`relative cursor-pointer ${props.className}`}
    >
      <TextInput
        ref={ref}
        label={props.label}
        id={`${props.id}-input`}
        value={value}
        pointer
      />
      <Icon
        name="arrow-simple"
        wrapperClassName={`absolute right-0 ${isOpen ? 'top-[14px]' : 'top-[8px]'}`}
        SVGClassName={`${isOpen ? 'rotate-90' : '-rotate-90'} fill-dark w-4 h-4 left-22`}
        onClick={() => {
          ref.current?.focus();
        }}
      />
      {isOpen && (
      <Dropdown
        choices={props.choices.map((choice) => ({
          ...choice,
          action: () => {
            setValue(choice.label);
            setIsOpen(false);
            props.onSelect(choice.value);
          },
        }))}
      />
      )}
    </div>
  );
};
