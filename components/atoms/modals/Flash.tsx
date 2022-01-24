import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Icon } from '..';

interface FlashProps {
    open: boolean,
    children?: ReactNode,
    onClose?: () => void,
}

export const Flash: React.FC<FlashProps> = (props: FlashProps) => {
    const [display, setDisplay] = useState(false);
    let closeTimeout: NodeJS.Timeout;

    useEffect(() => {
        if (props.open) {
            setTimeout(() => {
                setDisplay(true);
            }, 10);
            closeTimeout = setTimeout(() => {
                setDisplay(false);
            }, 2000);
        }
        return () => clearTimeout(closeTimeout);
    }, [props.open]);

    useEffect(() => {
        if (!display) {
            setTimeout(() => {
                props.onClose && props.onClose();
            }, 150);
        }
    }, [display])

    return (
        <div 
            className={'bg-white transition-[bottom] ease-in-out w-[90%] md:w-auto text-center ' + (display ? 'bottom-[5%] md:bottom-[8%]' : '-bottom-[20%] md:-bottom-[10%]') + ' rounded-lg shadow px-6 py-4 z-1000 absolute left-[50%] translate-x-[-50%] cursor-pointer'}
            onClick={() => setDisplay(false)}
        >
            {props.children}
        </div>
    )
}