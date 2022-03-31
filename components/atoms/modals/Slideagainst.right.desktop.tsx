import { Signal } from 'helpers/quarky';
import React, { ReactNode, useEffect, useState } from 'react';
import { Boulder, LightTopo, Topo } from 'types';
import { DownloadButton, LikeButton, Show } from '..';

interface SlideagainstRightDesktopProps {
    open?: boolean,
    displayLikeButton?: boolean,
    displayDlButton?: boolean,
    className?: string,
    item?: Boulder | Topo | LightTopo,
    onClose?: () => void,
    children?: ReactNode,
}

const isTopo = (item: Boulder | Topo | LightTopo): item is Topo => (item as Topo).creator?.id !== undefined;

export const SlideagainstRightDesktop: React.FC<SlideagainstRightDesktopProps> = ({
    open = false,
    ...props
}: SlideagainstRightDesktopProps) => {
    const size = 300;
    const [marginRight, setMarginRight] = useState<number>(size);

    // TODO: this sometimes causes React warnings, because it can call setMarginRight after the component was unmounted
    useEffect(() => {
        window.setTimeout(() => setMarginRight(open ? 0 : size), 1);    
      }, [open]);

    return (
        <div 
            className={`flex flex-col w-[300px] h-full py-5 border-l bg-white border-grey-medium z-40 ${props.className ? props.className : ''}`}
            style={{ 
                marginRight: `-${marginRight}px`,
                transition: 'margin-right 0.15s ease-in-out'
            }}
        >
            <div className='flex flex-row justify-between h-[5%] px-5'>
                <div className="flex flex-row w-[70px] justify-between">
                    <Show when={() => props.item}>
                        {item =>
                            <>
                                {props.displayLikeButton &&
                                    <LikeButton
                                        item={item}
                                    />
                                }
                                {props.displayDlButton && isTopo(item) &&
                                    <DownloadButton
                                        topo={item}
                                    />
                                }
                            </>
                        }
                    </Show>
                </div>
                <span 
                    className='cursor-pointer text-main ktext-base'
                    onClick={() => {
                        setMarginRight(size)
                        window.setTimeout(() => props.onClose && props.onClose(), 150);  
                        
                    }}
                >Terminé</span>
            </div>

            <div className='flex-1 overflow-auto relative'>
                {props.children}
            </div>
        </div>
    )
}