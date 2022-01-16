import React, {
  useRef, useState,
} from 'react';
import { Icon } from '../../atoms/Icon';
import { Dropdown, DropdownOption } from './Dropdown';
import { TextInput } from './TextInput';

interface MultipleSelectProps {
  id: string;
  label?: string;
  options: DropdownOption[];
  value: DropdownOption[],
  onChange: (value: DropdownOption[]) => void;
  className?: string;
}

export const MultipleSelect: React.FC<MultipleSelectProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const textValue = props.value.map((value) => value.label || value.value).join(', ');

  return (
    <div
      id={props.id}
      className={`relative cursor-pointer ${props.className}`}
    >
      <TextInput
        ref={ref}
        label={props.label}
        id={`${props.id}-input`}
        value={textValue}
        pointer
        readOnly
        onClick={() => setIsOpen(!isOpen)}
      />
      <Icon
        name="arrow-simple"
        wrapperClassName={`absolute right-0 ${isOpen ? 'top-[14px]' : 'top-[8px]'}`}
        SVGClassName={`${isOpen ? 'rotate-90' : '-rotate-90'} fill-dark w-4 h-4 left-22`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) ref.current?.focus();
        }}
      />

      {isOpen && (
        <Dropdown
          type="checkbox"
          onSelect={(option) => {
            const newValue = [...props.value];
            if (props.value.includes(option)) newValue.slice(props.value.indexOf(option), 1);
            else newValue.push(option);
            props.onChange(newValue); 
          }}
          options={props.options}
        />
      )}
    </div>
  );
};
