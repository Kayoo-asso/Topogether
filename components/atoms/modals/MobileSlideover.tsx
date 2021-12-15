import React, { useEffect } from 'react';

interface MobileSlideoverProps {
    open?: boolean,
    full?: boolean,
    children: any,
}

export const MobileSlideover: React.FC<MobileSlideoverProps> = ({
    open = true,
    full = true,
    ...props
}: MobileSlideoverProps) => {

    useEffect(() => {

    }, [open]);

    return (
        <div className='flex flex-col absolute w-full bottom-[10vh] bg-white rounded-t-lg h-[80%] z-50 shadow'>
            <div 
                className='flex w-full h-[40px] justify-center'
                
            >
                <div className='bg-grey-light rounded-full h-[6px] w-3/12 shadow mt-[8px]'></div>
            </div>
            <div className='p-2 overflow-scroll'>
                {props.children}
            </div>
        </div>
    )
}