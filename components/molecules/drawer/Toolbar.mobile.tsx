import React from 'react';
import { Icon } from 'components';
import { ToolselectorMobile } from './Toolselector.mobile';
import { Gradeselector } from './Gradeselector';
import { DrawerToolEnum, Grade } from 'types';

interface ToolbarMobileProps {
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

export const ToolbarMobile: React.FC<ToolbarMobileProps> = ({
    selectedTool = 'LINE_DRAWER',
    ...props
}: ToolbarMobileProps) => {
    
    return (
        <div className='bg-dark w-full h-[7vh] flex flex-row items-center justify-center'>

            <span className='w-2/5 flex flex-row items-center justify-around'>
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
                <Icon 
                    name='many-tracks'
                    center
                    SVGClassName={'w-6 h-6 ' + (props.displayOtherTracks ? 'stroke-main' : 'stroke-white')}
                    onClick={props.onOtherTracks}
                />
            </span>

            <span className='1/5 pb-3 mx-3 self-end'>
                <ToolselectorMobile 
                    selectedTool={selectedTool !== 'ERASER' ? selectedTool : 'LINE_DRAWER'}
                    onToolSelect={props.onToolSelect}
                />
            </span>
            
            <span className='w-1/5'>
                <Gradeselector 
                    grade={props.grade}
                    onSelectGrade={props.onGradeSelect}
                />
            </span>

            <span className='w-1/5'>
                <Icon 
                    name='checked'
                    center
                    SVGClassName='fill-main h-6 w-6'
                    onClick={props.onValidate}
                />
            </span>

        </div>
    )
}