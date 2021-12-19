import React from 'react';
import { getGradesNbFromTopos } from 'helpers';
import { Grade, Topo } from 'types';

interface GradeHistogramProps {
  topo: Topo,
}

export const GradeHistogram: React.FC<GradeHistogramProps> = (props: GradeHistogramProps) => {
  const gradeArray: Grade[] = [3, 4, 5, 6, 7, 8, 9];
  const gradesNb = getGradesNbFromTopos(props.topo);
  const gradeMaxNb = Object.values(gradesNb).reduce((maxNb, gradeNb) => (maxNb < gradeNb ? gradeNb : maxNb));

  const getColorClasses = (grade: Grade) => {
    switch (grade) {
      case 3:
        return 'bg-grade-3';
      case 4:
        return 'bg-grade-4';
      case 5:
        return 'bg-grade-5';
      case 6:
        return 'bg-grade-6';
      case 7:
        return 'bg-grade-7';
      case 8:
        return 'bg-grade-8';
      case 9:
        return 'bg-grade-9';
      default:
        return 'bg-main';
    }
  };

  return (
    <div className="flex h-full">
      {gradeArray.map((grade) => {
        if (gradesNb[grade] !== 0) {
          const height = `${(gradesNb[grade] / gradeMaxNb) * 100}%`;
          return (
            <div className="flex flex-col justify-end h-full mr-1" key={grade}>
              <div className="ktext-base text-center">{gradesNb[grade]}</div>
              <div
                style={{ height }}
                className={`ktext-subtitle w-6 flex flex-col justify-end items-center rounded-full text-white ${getColorClasses(grade)}`}
              >
                <div>{grade}</div>
              </div>
            </div>
          );
        }
        return (
          <div className="flex flex-col justify-end h-full mr-1" key={grade}>
            <div className="ktext-base text-center">{gradesNb[grade]}</div>
            <div className="ktext-subtitle w-6 flex flex-col justify-end items-center rounded-full text-white bg-grey-light">
              <div>{grade}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
