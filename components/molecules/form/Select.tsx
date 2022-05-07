import React, {
    useCallback,
    useEffect,
    useRef, useState,
} from 'react';
import { TextInput } from './TextInput';
import ArrowSimple from 'assets/icons/arrow-simple.svg';

export type SelectOption<T> = [value: T, label: string];
export type SelectValue = number | string | symbol;
export type SelectLabels<V extends SelectValue> = Record<V, string>;

interface SelectProps<T> {
    id: string;
    label: string;
    wrapperClassname?: string;
    options: SelectOption<T>[],
    big?: boolean,
    white?: boolean,
    value?: T;
    error?: string,
    onChange: (value: T) => void;
}

export function Select<T>({
    big = false,
    white = false,
    ...props
}: SelectProps<T>) {
    const ref = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const selected = props.options.find(x => x[0] === props.value);

    useEffect(() => {
        console.log(isOpen);
    }, [isOpen])

    return (
        <div
            id={props.id}
            className={`relative cursor-pointer ${props.wrapperClassname}`}
            onClick={useCallback(() => {
                if (isOpen) setIsOpen(false);
                else setIsOpen(true);
            }, [isOpen])}
        >
            <TextInput
                ref={ref}
                label={props.label}
                id={`${props.id}-input`}
                big={big}
                white={white}
                value={selected ? selected[1] : ''}
                error={props.error}
                readOnly
                pointer
            />
            <ArrowSimple
                className={`w-4 h-4 absolute right-0 ${isOpen ? 'top-[14px]' : 'top-[8px]'} ${isOpen ? 'rotate-90' : '-rotate-90'} ${white ? 'fill-white' : 'fill-dark'}`}
            />
            {isOpen && (
                <div className='pl-4 py-2 bg-white rounded-b max-h-[320px] absolute overflow-y-auto overflow-x-none z-100 w-full right-0 shadow'>
                    {props.options.map(([value, label]) => (
                        <div
                            className="py-4 text-dark ktext-base cursor-pointer flex flex-row items-center"
                            key={label}
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