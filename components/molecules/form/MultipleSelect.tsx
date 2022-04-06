import { Checkbox } from 'components';
import React, {
  useRef, useState,
} from 'react';
import { TextInput } from './TextInput';
import ArrowSimple from 'assets/icons/arrow-simple.svg';

type MultipleSelectProps<T> = {
  id: string;
  label?: string;
  options: { label: string, value: T }[];
  values: T[];
  onChange: (value: T) => void;
  className?: string;
}

export const MultipleSelect = <T extends number | string>(props: MultipleSelectProps<T>) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const textValue = props.options?.filter(option => props.values.includes(option.value)).map(option => option.label).join(', ');

  return (
    <div
      id={props.id}
      className={`relative cursor-pointer ${props.className}`}
    >
      <TextInput
        ref={ref}
        label={props.label}
        id={`${props.id}-input`}
        value={textValue || ''}
        pointer
        readOnly
        onClick={() => setIsOpen(!isOpen)}
      />
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) ref.current?.focus();
        }}
      >
        <ArrowSimple
          className={`w-4 h-4 fill-dark absolute right-0 ${isOpen ? 'top-[14px] rotate-90' : 'top-[8px] -rotate-90'}`}
        />
      </button>

      {isOpen && <div className='pl-4 py-2 bg-white rounded-b h-[200px] absolute overflow-y-auto overflow-x-none z-100 w-full right-0 shadow'>
        {props.options.map(({ value, label }) => (
          <div
            className="py-4 text-dark ktext-base cursor-pointer flex flex-row items-center"
            key={value}
            onKeyDown={() => { props.onChange(value); }}
            onMouseDown={() => { props.onChange(value); }}
            role="menuitem"
            tabIndex={0}
          >
            <Checkbox
              className="mr-2"
              checked={props.values.includes(value)}
              onClick={() => { props.onChange(value); }}
            />
            {label}
          </div>
        ))}
      </div>}
    </div>
  );
}
