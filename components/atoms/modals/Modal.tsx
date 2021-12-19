import React, { ReactNode } from 'react';
import { Icon } from '..';

interface ModalProps {
    open: boolean,
    withBackground?: boolean,
    children?: ReactNode[],
    onClose?: () => void,
}

export const Modal: React.FC<ModalProps> = ({
    open = false,
    withBackground = true,
    ...props
}: ModalProps) => {

    return (
        <div 
            className={'h-screen w-full z-100 absolute' + (withBackground ? ' bg-black bg-opacity-80' : '')}
            onClick={props.onClose}
        >
            <div className='bg-white rounded-lg shadow min-h-[30%] w-11/12 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                {props.children}
                <div 
                    className='absolute top-3 right-3'
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