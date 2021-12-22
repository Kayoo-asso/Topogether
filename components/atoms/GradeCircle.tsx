import React from 'react';
import { LightGrade } from 'types';

// Note: removed `clickable?` from props, since it's equivalent
// to having an onClick handler or not
interface GradeCircleProps {
  grade: LightGrade,
  size?: 'little' | 'normal',
  selected?: boolean,
  content?: string,
  className?: string,
  onClick?: () => void,
}

const notSelectedColorStyles = {
  3: 'border-grade-3 text-grade-3',
  4: 'border-grade-4 text-grade-4',
  5: 'border-grade-5 text-grade-5',
  6: 'border-grade-6 text-grade-6',
  7: 'border-grade-7 text-grade-7',
  8: 'border-grade-8 text-grade-8',
  9: 'border-grade-9 text-grade-9',
  // TODO: verify that text-grey-light is actually readable
  None: 'border-grey-light text-grey-light'
}

const selectedColorStyles = {
  3: 'bg-grade-3 border-grade-3 text-white',
  4: 'bg-grade-4 border-grade-4 text-white',
  5: 'bg-grade-5 border-grade-5 text-white',
  6: 'bg-grade-6 border-grade-6 text-white',
  7: 'bg-grade-7 border-grade-7 text-white',
  8: 'bg-grade-8 border-grade-8 text-white',
  9: 'bg-grade-9 border-grade-9 text-white',
  None: 'bg-grey-light border-grey-light text-white'
}

export const GradeCircle: React.FC<GradeCircleProps> = ({
  selected = true,
  size = 'normal',
  ...props
}: GradeCircleProps) => {

  const colorStyles = selected
    ? selectedColorStyles[props.grade]
    : notSelectedColorStyles[props.grade];

  const sizeStyles = size === 'normal'
    ? 'p-3 w-6 h-6 border-2'
    : 'p-1 w-5 h-5 border';
  
  const content = props.content
    || props.grade === "None" ? "Sans cotation" : props.grade;

  return (
    <div
      className={`relative box-border flex items-center text-center justify-center rounded-full 
        ${colorStyles} 
        ${sizeStyles} 
        ${props.className} 
        ${props.onClick ? 'cursor-pointer' : ''} 
        `}
      onClick={props.onClick}
      onKeyUp={props.onClick}
      role="button"
      tabIndex={0}
    >
      <span className={`ktext-subtitle
        ${size === 'little' ? 'text-xs' : ''}
        ${props.onClick ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        {content}
      </span>
    </div>
  );
};
