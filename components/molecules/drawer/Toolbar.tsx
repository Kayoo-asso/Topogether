import React from 'react';
import { Icon } from 'components';
import { ToolselectorMobile } from './Toolselector.mobile';
import { Gradeselector } from './Gradeselector';
import { DrawerToolEnum, Grade, gradeToLightGrade } from 'types';

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

const getStrokeColorClass = (grade: Grade | undefined) => {
    if (!grade) return 'stroke-grey-light';
    else {
      const lightGrade = gradeToLightGrade(grade);
      switch (lightGrade) {
        case 3:
            return 'stroke-grade-3';
        case 4:
            return 'stroke-grade-4';
        case 5:
            return 'stroke-grade-5';
        case 6:
            return 'stroke-grade-6';
        case 7:
            return 'stroke-grade-7';
        case 8:
            return 'stroke-grade-8';
        case 9:
            return 'stroke-grade-9';
      }
    }
  }

export const Toolbar: React.FC<ToolbarProps> = ({
    selectedTool = 'LINE_DRAWER',
    ...props
}: ToolbarProps) => {
    
    return (
        <div className='bg-dark w-full h-[7vh] flex flex-row items-center justify-center z-200'>

            <span className='flex flex-row items-center justify-around w-2/5 md:w-3/12'>
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
                <div className='hidden md:block'>
                    <Icon 
                        name='eraser'
                        center
                        SVGClassName={'w-6 h-6 ' + (selectedTool === 'ERASER' ? 'stroke-main fill-main' : 'stroke-white fill-white')}
                        onClick={() => props.onToolSelect('ERASER')}
                    />
                </div>
                <Icon 
                    name='many-tracks'
                    center
                    SVGClassName={'w-6 h-6 ' + (props.displayOtherTracks ? 'stroke-main' : 'stroke-white')}
                    onClick={props.onOtherTracks}
                />
            </span>

            <span className='1/5 pb-3 mx-3 self-end md:hidden'>
                <ToolselectorMobile 
                    selectedTool={selectedTool !== 'ERASER' ? selectedTool : 'LINE_DRAWER'}
                    onToolSelect={props.onToolSelect}
                />
            </span>

            <span className='w-6/12 flex-row items-center justify-around px-[13%] hidden md:flex'>
                <Icon 
                    name='topo'
                    center
                    SVGClassName={'w-6 h-6 ' + (selectedTool === 'LINE_DRAWER' ? getStrokeColorClass(props.grade) : 'stroke-white')}
                    onClick={() => props.onToolSelect('LINE_DRAWER')}
                />
                <Icon 
                    name='hand'
                    center
                    SVGClassName={'w-6 h-6 ' + (selectedTool === 'HAND_DEPARTURE_DRAWER' ? getStrokeColorClass(props.grade)+' fill-white' : 'stroke-white')}
                    onClick={() => props.onToolSelect('HAND_DEPARTURE_DRAWER')}
                />
                <Icon 
                    name='climbing-shoe'
                    center
                    SVGClassName={'w-7 h-7 ' + (selectedTool === 'FOOT_DEPARTURE_DRAWER' ? getStrokeColorClass(props.grade)+' fill-white' : 'stroke-white')}
                    onClick={() => props.onToolSelect('FOOT_DEPARTURE_DRAWER')}
                />
                <Icon 
                    name='forbidden-area'
                    center
                    SVGClassName={'w-6 h-6 ' + (selectedTool === 'FORBIDDEN_AREA_DRAWER' ? 'stroke-second fill-white' : 'stroke-white')}
                    onClick={() => props.onToolSelect('FORBIDDEN_AREA_DRAWER')}
                />
            </span>
            
            <span className='w-1/5 md:w-3/12 md:flex md:justify-center'>
                <Gradeselector 
                    grade={props.grade}
                    onGradeSelect={props.onGradeSelect}
                />
            </span>

            <span className='w-1/5 md:hidden'>
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