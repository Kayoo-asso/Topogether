import React, { useState } from 'react';
import { Icon } from '..';

interface ParkingButtonProps {
    onClick?: () => void,
}

export const ParkingButton: React.FC<ParkingButtonProps> = ({
    ...props
}: ParkingButtonProps) => {

    return (
        <div 
            className='ktext-base text-main flex flex-row items-center justify-center cursor-pointer'
            onClick={props.onClick}
        >
            Itinéraire vers le parking
            <Icon 
                name='parking'
                wrapperClassName='ml-3'
                SVGClassName='fill-main h-5 w-5'
            />
            </div>
    )
}