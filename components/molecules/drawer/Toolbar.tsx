import React from 'react';
import { ToolSelectorMobile } from './ToolSelectorMobile';
import { GradeSelector } from './GradeSelector';
import { DrawerToolEnum, Grade, gradeToLightGrade } from 'types';
import Clear from 'assets/icons/clear.svg';
import Rewind from 'assets/icons/rewind.svg';
import Eraser from 'assets/icons/eraser.svg';
import ManyTracks from 'assets/icons/many-tracks.svg';
import Topo from 'assets/icons/topo.svg';
import Hand from 'assets/icons/hand.svg';
import ClimbingShoe from 'assets/icons/climbing-shoe.svg';
import ForbiddenArea from 'assets/icons/forbidden-area.svg';
import Checked from 'assets/icons/checked.svg';


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
                <Clear 
                    className='stroke-white w-8 h-8 cursor-pointer'
                    onClick={props.onClear}
                />
                <Rewind
                    className='stroke-white w-6 h-6 cursor-pointer'
                    onClick={props.onRewind}
                />
                <div className='hidden md:block'>
                    <Eraser 
                        className={'w-6 h-6 cursor-pointer ' + (selectedTool === 'ERASER' ? 'stroke-main fill-main' : 'stroke-white fill-white')}
                        onClick={() => props.onToolSelect('ERASER')}
                    />
                </div>
                <ManyTracks
                    className={'w-6 h-6 cursor-pointer ' + (props.displayOtherTracks ? 'stroke-main' : 'stroke-white')}
                    onClick={props.onOtherTracks}
                />
            </span>

            <span className='flex 1/5 pb-3 mx-3 self-end md:hidden'>
                <ToolSelectorMobile 
                    selectedTool={selectedTool !== 'ERASER' ? selectedTool : 'LINE_DRAWER'}
                    onToolSelect={props.onToolSelect}
                />
            </span>

            <span className='w-6/12 flex-row items-center justify-around px-[13%] hidden md:flex'>
                <Topo 
                    className={'w-6 h-6 cursor-pointer ' + (selectedTool === 'LINE_DRAWER' ? getStrokeColorClass(props.grade) : 'stroke-white')}
                    onClick={() => props.onToolSelect('LINE_DRAWER')}
                />
                <Hand 
                    className={'w-6 h-6 cursor-pointer ' + (selectedTool === 'HAND_DEPARTURE_DRAWER' ? getStrokeColorClass(props.grade)+' fill-white' : 'stroke-white')}
                    onClick={() => props.onToolSelect('HAND_DEPARTURE_DRAWER')}
                />
                <ClimbingShoe 
                    className={'w-7 h-7 cursor-pointer ' + (selectedTool === 'FOOT_DEPARTURE_DRAWER' ? getStrokeColorClass(props.grade)+' fill-white' : 'stroke-white')}
                    onClick={() => props.onToolSelect('FOOT_DEPARTURE_DRAWER')}
                />
                <ForbiddenArea 
                    className={'w-6 h-6 cursor-pointer ' + (selectedTool === 'FORBIDDEN_AREA_DRAWER' ? 'stroke-second fill-white' : 'stroke-white')}
                    onClick={() => props.onToolSelect('FORBIDDEN_AREA_DRAWER')}
                />
            </span>
            
            <span className='w-1/5 z-100 md:w-3/12 md:flex md:justify-center'>
                <GradeSelector 
                    grade={props.grade}
                    onGradeSelect={props.onGradeSelect}
                />
            </span>

            <span className='w-1/5 flex justify-center md:hidden'>
                <Checked
                    className='fill-main h-6 w-6 cursor-pointer'
                    onClick={props.onValidate}
                />
            </span>

        </div>
    )
}