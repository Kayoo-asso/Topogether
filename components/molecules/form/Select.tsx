import React, {
  useRef, useState,
} from 'react';
import { Icon } from '../../atoms/Icon';
import { Dropdown } from './Dropdown';
import { TextInput } from './TextInput';

interface SelectOption {
  label?: string;
  value: any;
}

interface SelectProps {
  id: string;
  label: string;
  wrapperClassname?: string;
  names:  {[key in string]: string} 
  big?: boolean,
  white?: boolean,
  value?: any;
  error?: string,
  onChange: (value: any) => void;
}

export const Select: React.FC<SelectProps> = ({
  big = false,
  white = false,
  ...props
}: SelectProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = props.names[props.value]
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
        value={selectedOption || ''}
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
        <div
        className={`shadow absolute z-100 w-full px-7 py-5 bg-white rounded-b`}
      >
        {Object.entries(props.names).map(([value, label]) => (
            <div
              className="py-4 text-dark ktext-base cursor-pointer flex flex-row items-center"
              key={value}
              onKeyDown={() => {
                props.onChange(value);
              }}
              onMouseDown={() => {
                props.onChange(value);
              }}
              role="menuitem"
              tabIndex={0}
            >
              {label}
    
            </div>
          ))}
      </div>
        // <Dropdown
        //   fullSize
        //   options={[{
        //       value: props.label,
        //       isSection: true,
        //       action: () => {
        //         setIsOpen(false);
        //         props.onChange(undefined);
        //       }
        //     }]
        //     .concat(props.options.map((opt) => ({
        //       ...opt,
        //       isSection: false,
        //       action: () => {
        //         setIsOpen(false);
        //         props.onChange(opt.value);
        //       }
        //     })))
        //   }
        // />
      )}
    </div>
  );
};