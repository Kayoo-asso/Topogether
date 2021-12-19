import React, { useState } from 'react';
import { GradeCircle } from 'components';
import { Grade, gradeToLightGrade, LightGrade } from 'types';

interface GradeScaleProps {
  grades: Grade[] | LightGrade[],
  unselectedGrades?: Grade[] | LightGrade[],
  circleSize?: 'little' | 'normal',
  className?: 'string',
  clickable?: boolean,
  onCircleClick?: (grade: string | number) => void,
}

export const GradeScale: React.FC<GradeScaleProps> = ({
  clickable = false,
  circleSize = 'normal',
  ...props
}: GradeScaleProps) => {
  const allGrades: LightGrade[] = [3, 4, 5, 6, 7, 8, 9];
  const grades = props.grades?.map((grade) => gradeToLightGrade(grade)).map(Number) || [];
  const [unselectedGrades, setUnselectedGrades] = useState(props.unselectedGrades?.map(Number) || []);

  return (
    <div className={`flex ${props.className ? props.className : ''}`}>
      {allGrades.map((grade, index) => {
        if (grades.includes(grade)) {
          return (
            <GradeCircle
              key={index}
              grade={grade}
              size={circleSize}
              selected={!unselectedGrades?.includes(grade)}
              className="mr-1"
              clickable={clickable}
              onClick={() => {
                if (clickable) {
                  let newUnselectedGrades: LightGrade[] = JSON.parse(JSON.stringify(unselectedGrades)) as LightGrade[];
                  if (newUnselectedGrades?.includes(grade)) newUnselectedGrades = newUnselectedGrades.filter((g) => g !== grade);
                  else newUnselectedGrades.push(grade);
                  setUnselectedGrades(newUnselectedGrades);
                }
                props.onCircleClick && props.onCircleClick(grade);
              }}
            />
          );
        }

        return (
          <GradeCircle
            key={index}
            grade={grade}
            size={circleSize}
            colored={false}
            className="mr-1"
            onClick={() => props.onCircleClick && props.onCircleClick(grade)}
          />
        );
      })}
    </div>
  );
};
