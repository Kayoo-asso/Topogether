import React from 'react';
import { GradeEnum, LightGradeEnum } from 'types';

interface GradeCircleProps {
  grade: GradeEnum | LightGradeEnum,
  size?: 'little' | 'normal',
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
  size = 'normal',
  ...props
}: GradeCircleProps) => {
  const grade = typeof props.grade === 'string' ? parseInt(props.grade[0], 10) : props.grade;
  const getColorStyle = () => {
    if (colored) {
      switch (grade) {
        case 3:
          return selected ? 'bg-diff-3 border-diff-3 text-white' : 'border-diff-3 text-diff-3 ';
        case 4:
          return selected ? 'bg-diff-4 border-diff-4 text-white' : 'border-diff-4 text-diff-4 ';
        case 5:
          return selected ? 'bg-diff-5 border-diff-5 text-white' : 'border-diff-5 text-diff-5 ';
        case 6:
          return selected ? 'bg-diff-6 border-diff-6 text-white' : 'border-diff-6 text-diff-6 ';
        case 7:
          return selected ? 'bg-diff-7 border-diff-7 text-white' : 'border-diff-7 text-diff-7 ';
        case 8:
          return selected ? 'bg-diff-8 border-diff-8 text-white' : 'border-diff-8 text-diff-8 ';
        case 9:
          return selected ? 'bg-diff-9 border-diff-9 text-white' : 'border-diff-9 text-diff-9 ';
        default:
          return 'bg-grey-light';
      }
    } else return 'border-grey-light bg-grey-light text-white';
  };

  return (
    <div
      className={`relative box-border flex items-center text-center justify-center rounded-full 
            ${size === 'normal' ? 'p-3 w-6 h-6 border-2' : 'p-1 w-5 h-5 border'} 
            ${props.className ? props.className : ''} 
            ${getColorStyle()} 
            ${props.onClick ? 'cursor-pointer' : ''} 
            `}
      onClick={props.onClick}
      onKeyUp={props.onClick}
      role="button"
      tabIndex={0}
    >
      <span className={`ktext-subtitle ${size === 'little' ? 'text-xs' : ''} ${props.onClick ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {props.content !== undefined ? props.content : grade}
      </span>
    </div>
  );
};
