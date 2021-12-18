import React, { useState } from 'react';
import { GradeCircle } from 'components';
import { GradeEnum, gradeToLightGrade, LightGradeEnum } from 'types';

interface GradeScaleProps {
    grades: GradeEnum[] | LightGradeEnum[],
    unselectedGrades?: GradeEnum[] | LightGradeEnum[],
    className?: 'string',
    clickable?: boolean,
    onCircleClick?: (grade: string | number) => void,
}

export const GradeScale: React.FC<GradeScaleProps> = ({
    clickable = false,
    ...props
}: GradeScaleProps) => {
    const allGrades: LightGradeEnum[] = [3, 4, 5, 6, 7, 8, 9];
    const grades = props.grades.map(grade => gradeToLightGrade(grade)).map(Number);
    const [unselectedGrades, setUnselectedGrades] = useState(props.unselectedGrades?.map(Number));

    return (
        <div className={`flex ${props.className ? props.className : ''}`}>
            {allGrades.map((grade, index) => {
                if (grades.includes(grade)) {
                    return (
                        <GradeCircle 
                            key={index} 
                            grade={grade} 
                            selected={!unselectedGrades?.includes(grade)}
                            className='mr-1'
                            clickable={clickable}
                            onClick={() => {
                                if (clickable) {
                                    let newUnselectedGrades: LightGradeEnum[] = JSON.parse(JSON.stringify(unselectedGrades));
                                    if (newUnselectedGrades?.includes(grade)) newUnselectedGrades = newUnselectedGrades.filter(g => g !== grade)
                                    else newUnselectedGrades.push(grade);
                                    setUnselectedGrades(newUnselectedGrades);
                                }
                                props.onCircleClick && props.onCircleClick(grade)
                            }}
                        />
                    )
                }
                else {
                    return (
                        <GradeCircle 
                            key={index}
                            grade={grade}
                            colored={false}
                            className='mr-1'
                            onClick={() => props.onCircleClick && props.onCircleClick(grade)}
                        />
                    )
                }
            })}
        </div>
    )
};
