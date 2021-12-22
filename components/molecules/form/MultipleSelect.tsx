import React, {
  useRef, useState,
} from 'react';
import { Icon } from '../../atoms/Icon';
import { Dropdown, DropdownOption } from './Dropdown';
import { TextInput } from './TextInput';

interface MultipleSelectProps {
  id: string;
  label: string;
  defaultChoices: DropdownOption[];
  onSelect: (value: DropdownOption) => void;
  className?: string;
}

export const MultipleSelect: React.FC<MultipleSelectProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [choices, setChoices] = useState<{ [value:string]: DropdownOption }>(props.defaultChoices.reduce((acc, choice) => ({
    ...acc,
    [choice.value]: choice,
  }), {}));

  const textValue = Object.values(choices)
    .filter((choice) => choice.checked).map((value) => value.label || value.value)
    .join(', ');

  const select = (selected: DropdownOption) => setChoices({
    ...choices,
    [selected.value]: {
      ...selected,
      checked: !selected.checked,
    },
  });

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
        value={textValue}
        pointer
        readOnly
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
        type="checkbox"
        onSelect={(selected) => { select(selected); props.onSelect(selected); }}
        choices={Object.values(choices)}
      />
      )}
    </div>
  );
};
