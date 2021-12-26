import React from 'react';
import { Icon } from 'components';
import { ToolselectorMobile } from './Toolselector.mobile';
import { Gradeselector } from './Gradeselector';
import { DrawerToolEnum, Grade } from 'types';
import { isDesktop, isMobile } from 'react-device-detect';

interface ToolbarProps {
    selectedTool: DrawerToolEnum,
    displayOtherTracks: boolean,
    grade?: Grade,
    onToolSelect: (tool: DrawerToolEnum) => void,
    onGradeSelect: (grade: Grade) => void,
    onClear: () => void,
    onRewind: () => void,
    onOtherTracks: () => void,
    onValidate: () => void,
}

export const Toolbar: React.FC<ToolbarProps> = ({
    selectedTool = 'LINE_DRAWER',
    ...props
}: ToolbarProps) => {
    
    return (
        <div className='bg-dark w-full h-[7vh] flex flex-row items-center justify-center'>

            <span className={'flex flex-row items-center justify-around ' + (isMobile ? 'w-2/5' : 'w-3/12')}>
                <Icon 
                    name='clear'
                    center
                    SVGClassName='stroke-white w-8 h-8'
                    onClick={props.onClear}
                />
                <Icon 
                    name='rewind'
                    center
                    SVGClassName='stroke-white w-6 h-6'
                    onClick={props.onRewind}
                />
                {isDesktop &&
                    <Icon 
                        name='eraser'
                        center
                        SVGClassName={'w-6 h-6 ' + (selectedTool === 'ERASER' ? 'stroke-main fill-main' : 'stroke-white fill-white')}
                        onClick={() => props.onToolSelect('ERASER')}
                    />
                }
                <Icon 
                    name='many-tracks'
                    center
                    SVGClassName={'w-6 h-6 ' + (props.displayOtherTracks ? 'stroke-main' : 'stroke-white')}
                    onClick={props.onOtherTracks}
                />
            </span>

            {isMobile &&
                <span className='1/5 pb-3 mx-3 self-end'>
                    <ToolselectorMobile 
                        selectedTool={selectedTool !== 'ERASER' ? selectedTool : 'LINE_DRAWER'}
                        onToolSelect={props.onToolSelect}
                    />
                </span>
            }
            {isDesktop &&
                <span className='w-6/12 flex flex-row items-center justify-around px-[13%]'>
                    <Icon 
                        name='topo'
                        center
                        SVGClassName={'w-6 h-6 ' + (selectedTool === 'LINE_DRAWER' ? 'stroke-main' : 'stroke-white')}
                        onClick={() => props.onToolSelect('LINE_DRAWER')}
                    />
                    <Icon 
                        name='hand'
                        center
                        SVGClassName={'w-6 h-6 ' + (selectedTool === 'HAND_DEPARTURE_DRAWER' ? 'stroke-main' : 'stroke-white')}
                        onClick={() => props.onToolSelect('HAND_DEPARTURE_DRAWER')}
                    />
                    <Icon 
                        name='climbing-shoe'
                        center
                        SVGClassName={'w-7 h-7 ' + (selectedTool === 'FOOT_DEPARTURE_DRAWER' ? 'stroke-main' : 'stroke-white')}
                        onClick={() => props.onToolSelect('FOOT_DEPARTURE_DRAWER')}
                    />
                    <Icon 
                        name='forbidden-area'
                        center
                        SVGClassName={'w-6 h-6 ' + (selectedTool === 'FORBIDDEN_AREA_DRAWER' ? 'stroke-main' : 'stroke-white')}
                        onClick={() => props.onToolSelect('FORBIDDEN_AREA_DRAWER')}
                    />
                </span>
            }
            
            <span className={isMobile ? 'w-1/5' : 'w-3/12'}>
                <Gradeselector 
                    grade={props.grade}
                    onSelectGrade={props.onGradeSelect}
                />
            </span>

            {isMobile &&
                <span className='w-1/5'>
                    <Icon
                        name='checked'
                        center
                        SVGClassName='fill-main h-6 w-6'
                        onClick={props.onValidate}
                    />
                </span>
            }

        </div>
    )
}