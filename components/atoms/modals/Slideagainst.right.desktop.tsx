import { Signal } from 'helpers/quarky';
import React, { ReactNode, useEffect, useState } from 'react';
import { Boulder, LightTopo, Topo } from 'types';
import { DownloadButton, LikeButton, Show } from '..';

interface SlideagainstRightDesktopProps {
    open?: boolean,
    displayLikeButton?: boolean,
    displayDlButton?: boolean,
    className?: string,
    item?: Signal<Boulder> | Signal<Topo> | Signal<LightTopo>,
    onClose?: () => void,
    children?: ReactNode,
}

const isTopo = (item: Signal<Boulder> | Signal<Topo> | Signal<LightTopo>): item is Signal<Topo> => (item as Signal<Topo>)().creatorId !== undefined;

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
            className={`bg-white w-[300px] border-l border-grey-medium h-full flex flex-col py-5 z-40 ${props.className ? props.className : ''}`}
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

            <div className='flex-1 relative flex flex-col overflow-hidden'>
                {props.children}
            </div>
        </div>
    )
}