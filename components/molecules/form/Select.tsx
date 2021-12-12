import React, { useEffect, useRef, useState } from 'react';
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
  selected: DropdownOption;
  onSelect?: (value: any) => void;
}

export const Select: React.FC<SelectProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id={props.id}>
      <TextInput
        ref={ref}
        label={props.label}
        id={`${props.id}-input`}
        value={props.selected?.label}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      {isOpen && <Dropdown choices={props.choices} onSelect={props.onSelect} />}
    </div>
  );
};