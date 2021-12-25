import React, { useState } from 'react';
import { Icon } from 'components';
import { DrawerToolEnum } from 'types';

interface ToolselectorMobileProps {
    selectedTool: Exclude<DrawerToolEnum, 'ERASER'>,
    onToolSelect: (tool: DrawerToolEnum) => void,
}

export const ToolselectorMobile: React.FC<ToolselectorMobileProps> = (props: ToolselectorMobileProps) => {
    const [open, setOpen] = useState(false);

    return (
        <button 
            className={'shadow flex flex-col items-center bg-dark rounded-full cursor-pointer z-40 w-[80px] ' + (open ? 'h-[320px]' : 'h-[80px]')}
            onClick={() => setOpen(!open)}
        >
            {open && 
                <>
                    <Icon 
                        name='forbidden-area'
                        center
                        SVGClassName={props.selectedTool === 'FORBIDDEN_AREA_DRAWER' ?'h-8 w-8 stroke-main' : 'h-6 w-6 stroke-white'}
                        wrapperClassName={props.selectedTool === 'FORBIDDEN_AREA_DRAWER' ? 'order-5' : 'order-1'}
                        onClick={() => props.onToolSelect('FORBIDDEN_AREA_DRAWER')}
                    />
                    <Icon 
                        name='climbing-shoe'
                        center
                        SVGClassName={props.selectedTool === 'FOOT_DEPARTURE_DRAWER' ? 'h-8 w-8 stroke-main' : 'h-7 w-7 stroke-white'}
                        wrapperClassName={props.selectedTool === 'FOOT_DEPARTURE_DRAWER' ? 'order-5' : 'order-2'}
                        onClick={() => props.onToolSelect('FOOT_DEPARTURE_DRAWER')}
                    />
                    <Icon 
                        name='hand'
                        center
                        SVGClassName={props.selectedTool === 'HAND_DEPARTURE_DRAWER' ? 'h-8 w-8 stroke-main' : 'h-6 w-6 stroke-white'}
                        wrapperClassName={props.selectedTool === 'HAND_DEPARTURE_DRAWER' ? 'order-5' : 'order-3'}
                        onClick={() => props.onToolSelect('HAND_DEPARTURE_DRAWER')}
                    />
                    <Icon
                        name='topo'
                        center
                        SVGClassName={props.selectedTool === 'LINE_DRAWER' ? 'h-8 w-8 stroke-main' : 'h-6 w-6 stroke-white'}
                        wrapperClassName={props.selectedTool === 'LINE_DRAWER' ? 'order-5' : 'order-4'}
                        onClick={() => props.onToolSelect('LINE_DRAWER')}
                    />
                </>
            }
            {!open &&
                <Icon
                    name={
                        props.selectedTool === 'LINE_DRAWER' ? 'topo' :
                        props.selectedTool === 'HAND_DEPARTURE_DRAWER' ? 'hand' :
                        props.selectedTool === 'FOOT_DEPARTURE_DRAWER' ? 'climbing-shoe' :
                        'forbidden-area'
                    }
                    center
                    SVGClassName='stroke-main h-8 w-8'
                />
            }
        </button>
    )
}