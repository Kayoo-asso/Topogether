import React, {
    useRef, useState,
} from 'react';
import { Icon } from 'components';
import { TextInput } from './TextInput';

interface SelectProps {
    id: string;
    label: string;
    wrapperClassname?: string;
    names: { [key in string]: string }
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

    const selectedOption = props.names[props.value];
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
                <div className='pl-4 py-2 bg-white rounded-b h-[200px] absolute overflow-y-auto overflow-x-none z-100 w-full right-0 shadow'>
                    <div
                        className="py-4 text-grey-light ktext-base cursor-pointer flex flex-row items-center"
                        key={undefined}
                        onKeyDown={() => {
                            props.onChange(undefined);
                        }}
                        onMouseDown={() => {
                            props.onChange(undefined);
                        }}
                        role="menuitem"
                        tabIndex={0}
                    >
                        {props.label}
                    </div>
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
                </div>)}
        </div>
    );
};