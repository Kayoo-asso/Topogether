import React, {
  useRef, useState,
} from 'react';
import { Icon } from '../../atoms/Icon';
import { Dropdown } from './Dropdown';
import { TextInput } from './TextInput';

interface DropdownOption {
  label?: string;
  value: any;
}

interface SelectProps {
  id: string;
  label: string;
  choices: DropdownOption[];
  big?: boolean,
  white?: boolean,
  value?: string;
  error?: string,
  onSelect: (value: any) => void;
  wrapperClassname?: string;
}

export const Select: React.FC<SelectProps> = ({
  big = false,
  white = false,
  ...props
}: SelectProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id={props.id}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      className={`relative cursor-pointer ${props.wrapperClassname}`}
    >
      <TextInput
        ref={ref}
        label={props.label}
        id={`${props.id}-input`}
        big={big}
        white={white}
        value={props.value || ''}
        error={props.error}
        readOnly
        pointer
      />
      <Icon
        name="arrow-simple"
        wrapperClassName={`absolute right-0 ${isOpen ? 'top-[14px]' : 'top-[8px]'}`}
        SVGClassName={`${isOpen ? 'rotate-90' : '-rotate-90'} ${white ? 'fill-white' : 'fill-dark'} w-4 h-4 left-22`}
        onClick={() => {
          ref.current?.focus();
        }}
      />
      {isOpen && (
      <Dropdown
        fullSize
        options={[{
            value: props.label,
            isSection: true,
            action: () => {
              setIsOpen(false);
              props.onSelect(undefined);
            }
          }]
          .concat(props.choices.map((choice) => ({
            ...choice,
            isSection: false,
            action: () => {
              setIsOpen(false);
              props.onSelect(choice.value);
            }
          })))
        }
      />
      )}
    </div>
  );
};
