import React, { ReactNode, useEffect, useState } from 'react';

interface SlideagainstRightDesktopProps {
    open?: boolean,
    onClose?: () => void,
    children?: ReactNode,
}

export const SlideagainstRightDesktop: React.FC<SlideagainstRightDesktopProps> = ({
    open = false,
    ...props
}: SlideagainstRightDesktopProps) => {
    const size = 300;
    const [marginRight, setMarginRight] = useState<number>(size);

    useEffect(() => {
        window.setTimeout(() => setMarginRight(open ? 0 : size), 1);        
      }, [open]);

    return (
        <div 
            className={`bg-white w-[300px] border-l border-grey-medium h-full flex flex-col py-5`}
            style={{ 
                marginRight: `-${marginRight}px`,
                transition: 'margin-right 0.15s ease-in-out'
            }}
        >
            <div className='h-[5%] text-right px-8'>
                <span 
                    className='cursor-pointer text-main ktext-base'
                    onClick={() => {
                        setMarginRight(size)
                        window.setTimeout(() => props.onClose && props.onClose(), 150);  
                        
                    }}
                >Terminé</span>
            </div>

            <div className='flex-1 relative'>
                {props.children}
            </div>
        </div>
    )
}