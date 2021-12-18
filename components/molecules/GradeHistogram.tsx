import React from 'react';
import { getGradesNbFromTopos } from 'helpers';
import { Grade, Topo } from 'types';


interface GradeHistogramProps {
    topo: Topo,
}

export const GradeHistogram: React.FC<GradeHistogramProps> = (props: GradeHistogramProps) => {
    const gradeArray: Grade[] = [3, 4, 5, 6, 7, 8, 9];
    const difficultiesNb = getGradesNbFromTopos(props.topo);
    const difficultyMaxNb = Object.values(difficultiesNb).reduce((maxNb, difficultyNb) => 
      maxNb < difficultyNb ? difficultyNb: maxNb
    );
    
    const getColorClasses = (grade: Grade) => {
        switch (grade) {
            case 3:
                return 'bg-diff-3';
            case 4:
                return 'bg-diff-4';
            case 5:
                return 'bg-diff-5';
            case 6:
                return 'bg-diff-6';
            case 7:
                return 'bg-diff-7';
            case 8:
                return 'bg-diff-8';
            case 9:
                return 'bg-diff-9';
        }
    }

    return (
        <div className="flex h-full">
            {gradeArray.map(grade => {
                if (difficultiesNb[grade] !== 0) {
                    const height = `${difficultiesNb[grade]/difficultyMaxNb*100}%`;
                    return (
                        <div className="flex flex-col justify-end h-full mr-1" key={grade}>
                          <div className="ktext-base text-center">{difficultiesNb[grade]}</div>
                          <div 
                            style={{ height }} 
                            className={`ktext-subtitle w-6 flex flex-col justify-end items-center rounded-full text-white ${getColorClasses(grade)}`}
                        >
                            <div>{grade}</div>
                          </div>
                        </div>
                      )
                }
                else {
                    return (
                      <div className="flex flex-col justify-end h-full mr-1" key={grade}>
                        <div className="ktext-base text-center">{difficultiesNb[grade]}</div>
                        <div className="ktext-subtitle w-6 flex flex-col justify-end items-center rounded-full text-white bg-grey-light">
                            <div>{grade}</div>
                        </div>
                      </div>
                    )
                }
            })}
        </div>
    )
};
