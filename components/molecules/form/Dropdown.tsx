import React from 'react';
import { Icon, Checkbox } from '../../atoms';

export interface DropdownOption {
  value: any;
  label?: string; 
  isSection?: boolean;
  action?: () => void;
  icon?: string;
  checked?: boolean;
}

interface DropdownProps {
  choices: DropdownOption[];
  onSelect?: (option: DropdownOption) => void;
  type?: string;
  className?:string;
}

//TODO : Ajouter la possibilité qu'un choice soit un Button (centré dans la dropdown)

export const Dropdown: React.FC<DropdownProps> = ({
  ...props
}: DropdownProps) => (
  <div className={`shadow px-7 py-5 bg-white rounded-b-lg ${props.className}`}>
    {props.choices.map((choice, i) => (
      choice.isSection ? (
          <div
            className={`text-grey-medium ktext-label uppercase ${i > 0 && 'mt-5'}`}
            key={choice.value}
          >
            {choice.label || choice.value}
          </div>
        ) : (
          <div
            className="py-4 capitalize text-dark ktext-base cursor-pointer flex flex-row items-center"
            key={choice.value}
            onKeyDown={() => { 
              props.onSelect && props.onSelect(choice);
              choice.action && choice.action() 
            }}
            onMouseDown={() => { 
              props.onSelect && props.onSelect(choice);
              choice.action && choice.action() 
            }}
            role="menuitem"
            tabIndex={0}
          >
            {props.type === 'checkbox' && props.onSelect && 
              <Checkbox 
                className="mr-2" 
                checked={choice.checked} 
                onClick={() => {
                  props.onSelect && props.onSelect(choice)
                }} 
              />
            }

            {choice.icon && (
              <Icon
                name={choice.icon}
                SVGClassName="stroke-black h-5 w-5 mr-5"
              />)
            }
              
            {choice.label || choice.value}

          </div>
        )))
    }
  </div>
);
