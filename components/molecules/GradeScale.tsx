import React, { useState } from 'react';
import { GradeCircle } from 'components';

interface GradeScaleProps {
    grades: (string | number)[],
    unselectedGrades?: (string | number)[],
    clickable?: boolean,
    onCircleClick?: (grade: string | number) => void,
}

export const GradeScale: React.FC<GradeScaleProps> = ({
    clickable = false,
    ...props
}: GradeScaleProps) => {
    const allGrades = [3, 4, 5, 6, 7, 8, 9];
    const grades = props.grades.map(Number);
    const [unselectedGrades, setUnselectedGrades] = useState(props.unselectedGrades?.map(Number));

    return (
        <div className="flex">
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
                                    let newUnselectedGrades: number[] = JSON.parse(JSON.stringify(unselectedGrades));
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
