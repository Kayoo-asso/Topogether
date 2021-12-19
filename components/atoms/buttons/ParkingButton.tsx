import React, { useState } from 'react';
import { Icon } from '..';

interface ParkingButtonProps {
    onClick?: (choice: string) => void,
}

export const ParkingButton: React.FC<ParkingButtonProps> = ({
    ...props
}: ParkingButtonProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div 
                className='ktext-base text-main flex flex-row items-center justify-center cursor-pointer'
                onClick={() => setOpen(true)}
            >
                Itinéraire vers le parking
                <Icon 
                    name='parking'
                    wrapperClassName='ml-3'
                    SVGClassName='fill-main h-5 w-5'
                />
            </div>

            {open &&
                <div className='h-full w-full bg-black bg-opacity-80 absolute'>
                    <div className='w-11/12 shadow absolute left-[50%] translate-x-[-50%] bottom-[20px]'>
                        <div className='ktext-subtitle h-[150px] px-8 bg-white text-main text-center'>
                            <div className='py-3 border-b border-grey-light'>Google Maps</div>
                            <div className='py-3 border-b border-grey-light'>Google Maps</div>
                            <div className='py-3'>Google Maps</div>
                        </div>
                        <div 
                            className='ktext-subtitle h-[50px] py-3 px-8 bg-white text-main'
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </div>
                    </div>
                </div>
            }
        </>
    )
}