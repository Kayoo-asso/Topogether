import { Checkbox } from 'components';
import { hasFlag, listFlags } from 'helpers';
import React, {
  useRef, useState,
} from 'react';
import { Bitflag, Enums, TopoType, TopoTypes } from 'types';
import { Icon } from '../../atoms/Icon';
import { TextInput } from './TextInput';

type BitflagMultipleSelectProps<T extends Bitflag> = {
  id: string;
  label?: string;
  bitflagNames: [T, string][];
  value: T | undefined,
  onChange: (value: T) => void;
  className?: string;
}

type EnumMultipleSelectProps<T extends TopoTypes> = {
  id: string;
  label?: string;
  names:  {[key in T]: string} 
  values: T[],
  onChange: (value: T) => void;
  className?: string;
}

type MultipleSelectProps<T> = T extends Bitflag ? BitflagMultipleSelectProps<T> : EnumMultipleSelectProps<T>;

export const MultipleSelect = <T extends Bitflag | Enums>(props:MultipleSelectProps<T>) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  if("bitflagNames" in props) {
    const textValue = props.value && listFlags(props.value, props.bitflagNames).join(', ');

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
          props.bitflagNames.map(([flag,name]) => (
            <div
              className="py-4 text-dark ktext-base cursor-pointer flex flex-row items-center"
              key={name}
              onKeyDown={() => { props.onChange(flag); }}
              onMouseDown={() => { props.onChange(flag); }}
              role="menuitem"
              tabIndex={0}
            >
              <Checkbox
                className="mr-2"
                checked={props.value && hasFlag(props.value, flag)}
                onClick={() => { props.onChange(flag); }}
              />
              {name}
            </div>
        )))}
      </div>
    );
  } else {

    const textValue = props.values.map(value => props.names[value]).join(', ');
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
          Object.entries(props.names).map(([value,name]) => (
            <div
              className="py-4 text-dark ktext-base cursor-pointer flex flex-row items-center"
              key={name}
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
              {name}
            </div>
        )))}
      </div>
    );
  }
};
