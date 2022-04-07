import React, { useEffect, useRef, useState } from 'react';
import equal from 'fast-deep-equal/es6';

export interface DropdownOption {
    value: any;
    label?: string;
    isSection?: boolean;
    action?: () => void;
    icon?: SVG;
    disabled?: boolean;
}

interface DropdownProps {
    options: DropdownOption[];
    onSelect?: (option: DropdownOption) => void;
    type?: string;
    fullSize?: boolean,
    className?: string;
    position?: { x: number, y: number };
}

export const Dropdown: React.FC<DropdownProps> = React.memo(({
    className = '',
    fullSize = false,
    ...props
}: DropdownProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const [position, setPosition] = useState(props.position);

    useEffect(() => {
        if (ref.current && position && ref.current.clientHeight + position.y > document.documentElement.clientHeight) {
            setPosition({ y: position.y - ref.current.clientHeight - 10, x: position.x });
        }
    }, [ref, position]);

    return (
        <div
            ref={ref}
            className={`shadow absolute z-1000 px-7 bg-white rounded${fullSize ? ' w-full' : ''} ${className}`}
            style={{ left: `${position?.x}px`, top: `${position?.y}px` }}
        >
            {props.options.map((opt, i) => (
                opt.isSection ? (
                    <div
                        className={`text-grey-medium ktext-label uppercase ${i > 0 && 'mt-5'}`}
                        key={opt.value}
                        role="menuitem"
                        tabIndex={0}
                    >
                        {opt.label || opt.value}
                    </div>
                ) : (
                    <div
                        className={`h-16 ${opt.disabled ? 'text-grey-medium cursor-default' : 'text-dark cursor-pointer'} ktext-base flex flex-row items-center`}
                        key={opt.value}
                        onKeyDown={() => {
                            if (!opt.disabled) {
                                props.onSelect && props.onSelect(opt);
                                opt.action && opt.action();
                            }
                        }}
                        onMouseDown={() => {
                            if (!opt.disabled) {
                                props.onSelect && props.onSelect(opt);
                                opt.action && opt.action();
                            }
                        }}
                        role="menuitem"
                        tabIndex={0}
                    >
                        {opt.icon && (
                            <opt.icon
                                className={`${opt.disabled ? 'stroke-grey-medium' : 'stroke-black'} h-5 w-5 mr-5`}
                            />
                        )}
                        {opt.label || opt.value}
                    </div>
                )))}
        </div>
    )
},
    equal);
Dropdown.displayName = 'Dropdown';
