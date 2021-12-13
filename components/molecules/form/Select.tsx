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
}

export const Select: React.FC<SelectProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedChoice = props.choices.find((choice) => choice.value === props.selected);
  const [value, setValue] = useState(selectedChoice?.label);

  return (
    <div id={props.id} onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)} className="relative">
      <TextInput
        ref={ref}
        label={props.label}
        id={`${props.id}-input`}
        value={value}
        className="py-5 w-60"
      />
      <Icon name="arrow-simple" className="absolute -rotate-90 fill-dark w-5 h-5 top-2 left-22" />
      {isOpen && (
      <Dropdown choices={props.choices.map((choice) => ({
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
