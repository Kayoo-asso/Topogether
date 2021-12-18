import React from 'react';
import { GradeEnum, LightGradeEnum } from 'types';

interface GradeCircleProps {
  grade: GradeEnum | LightGradeEnum,
  colored?: boolean,
  selected?: boolean,
  clickable?: boolean
  content?: number | string,
  className?: string,
  onClick?: () => void,
}

export const GradeCircle: React.FC<GradeCircleProps> = ({
  colored = true,
  selected = true,
  ...props
}: GradeCircleProps) => {
  const grade = typeof props.grade === 'string' ? parseInt(props.grade[0], 10) : props.grade;
  const getColorStyle = () => {
    if (colored) {
      switch (grade) {
        case 3:
          return selected ? 'bg-grade-3 border-grade-3 text-white' : 'border-grade-3 text-grade-3 ';
        case 4:
          return selected ? 'bg-grade-4 border-grade-4 text-white' : 'border-grade-4 text-grade-4 ';
        case 5:
          return selected ? 'bg-grade-5 border-grade-5 text-white' : 'border-grade-5 text-grade-5 ';
        case 6:
          return selected ? 'bg-grade-6 border-grade-6 text-white' : 'border-grade-6 text-grade-6 ';
        case 7:
          return selected ? 'bg-grade-7 border-grade-7 text-white' : 'border-grade-7 text-grade-7 ';
        case 8:
          return selected ? 'bg-grade-8 border-grade-8 text-white' : 'border-grade-8 text-grade-8 ';
        case 9:
          return selected ? 'bg-grade-9 border-grade-9 text-white' : 'border-grade-9 text-grade-9 ';
        default:
          return 'bg-grey-light';
      }
    } else return 'border-grey-light bg-grey-light text-white';
  };

  return (
    <div
      className={`relative p-3 w-6 h-6 border-2 box-border flex items-center text-center justify-center rounded-full ktext-subtitle 
            ${props.className ? props.className : ''} 
            ${getColorStyle()} 
            ${props.onClick ? 'cursor-pointer' : ''} 
            `}
      onClick={props.onClick}
      onKeyUp={props.onClick}
      role="button"
      tabIndex={0}
    >
      <span className={`
            ${props.onClick ? 'cursor-pointer' : 'cursor-default'} 
            `}
      >
        {props.content !== undefined ? props.content : grade}
      </span>
    </div>
  );
};
