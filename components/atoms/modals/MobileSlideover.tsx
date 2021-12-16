import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

interface MobileSlideoverProps {
    initialOpen?: boolean,
    initialFull?: boolean,
    children: any,
}

export const MobileSlideover: React.FC<MobileSlideoverProps> = ({
    initialOpen = true,
    initialFull = true,
    ...props
}: MobileSlideoverProps) => {
    const [open, setOpen] = useState(initialOpen);
    const [full, setFull] = useState(initialFull);

    useEffect(() => {
        setOpen(initialOpen);
    }, [initialOpen]);

    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const handleToucheStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.touches[0].clientY);
    }
    function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
        setTouchEnd(e.touches[0].clientY);
    }
    function handleTouchEnd() {
        if (!full && touchStart - touchEnd > 50) {
            setFull(true);
        }
        if (touchStart - touchEnd < -50) {
            console.log('close');
            setOpen(false);
        }
    }

    return (
        <Transition
            show={open}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-y-500"
            enterTo="translate-y-100"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="bottom-[10vh]"
            leaveTo="bottom-[-70vh]"
        >
            <div className='flex flex-col absolute w-full bottom-[10vh] bg-white rounded-t-lg h-[80%] z-40 shadow'>
                <div 
                    className='flex w-full h-[40px] justify-center'
                    onTouchStart={handleToucheStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className='bg-grey-light rounded-full h-[6px] w-3/12 shadow mt-[8px]'></div>
                </div>
                <div className='p-2 overflow-scroll'>
                    {props.children}
                </div>
            </div>
        </Transition>
    )
}