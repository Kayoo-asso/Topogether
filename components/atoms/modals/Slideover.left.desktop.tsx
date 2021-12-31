import React, { useEffect, useState } from 'react';

interface SlideoverLeftDesktopProps {
    open?: boolean,
    onClose: () => void,
    title?: string,
    className?: string,
    children?: Node[],
}

export const SlideoverLeftDesktop: React.FC<SlideoverLeftDesktopProps> = ({
    open = false,
    ...props
}: SlideoverLeftDesktopProps) => {
    const size = 600;
    const [translateX, setTranslateX] = useState<number>(100);

    useEffect(() => {
        window.setTimeout(() => setTranslateX(open ? 0 : 100), 1);        
      }, [open]);

    return (
        <div 
            className={`bg-white absolute transition ease-in-out left-[300px] z-50 w-[600px] border-r border-grey-medium h-contentPlusShell flex flex-col px-8 py-5 ${props.className ? props.className : ''}`}
            style={{ 
                transform: `translateX(-${translateX}%)`
            }}
        >
            <div className='h-[5%] flex justify-between items-center'>
                <span className='ktext-big-title'>{props.title}</span>
                <span 
                    className='cursor-pointer text-main ktext-base'
                    onClick={() => {
                        setTranslateX(100)
                        window.setTimeout(() => props.onClose(), 150);  
                        
                    }}
                >Terminé</span>
            </div>

            <div className='flex-1'>
                {props.children}
            </div>
        </div>
    )
}