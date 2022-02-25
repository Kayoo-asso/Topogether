import React, { ReactNode } from 'react';
import { Icon } from '..';

interface ModalProps {
    withBackground?: boolean,
    children?: ReactNode,
    className?: string,
    onClose: () => void,
}

export const Modal: React.FC<ModalProps> = ({
    withBackground = true,
    ...props
}: ModalProps) => {

    return (
        <div 
            className={'h-screen w-full top-0 left-0 z-1000 absolute' + (withBackground ? ' bg-black bg-opacity-80 ' : '') + (props.className ? props.className : '')}
            onClick={props.onClose}
        >
            <div 
                className='bg-white z-200 rounded-lg shadow min-h-[25%] w-11/12 md:w-5/12 absolute top-[45%] md:top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
                onClick={(e) => e.stopPropagation()} 
            >
                {props.children}
                <div 
                    className='absolute top-3 right-3 cursor-pointer'
                    onClick={props.onClose}
                >
                    <Icon 
                        name='clear'
                        SVGClassName='stroke-dark h-8 w-8'
                    />
                </div>
            </div>
        </div>
    )
}