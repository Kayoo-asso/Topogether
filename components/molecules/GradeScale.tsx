import React from 'react';
import { GradeCircle } from 'components';
import { GradeHistogram, LightGrade, lightGrades } from 'types';
import { Signal } from 'helpers/quarky';

type GradeHistogramSelection = {
  [K in LightGrade]: boolean
}

const defaultHistogramSelection: GradeHistogramSelection = {
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
  None: true
}

interface GradeScaleProps {
  histogram: Signal<GradeHistogram>,
  selection?: GradeHistogramSelection,
  circleSize?: 'little' | 'normal',
  className?: string,
  onCircleClick?: (grade: LightGrade) => void,
}

export const GradeScale: React.FC<GradeScaleProps> = ({
  selection = defaultHistogramSelection,
  circleSize = 'normal',
  ...props
}: GradeScaleProps) => {
  // TODO: use the histogram

  return (
    <div className={`flex ${props.className}`}>
      {lightGrades.slice(0,-1).map(grade =>
        <GradeCircle
          key={grade}
          grade={grade}
          size={circleSize}
          selected={selection[grade]}
          className="mr-1"
          onClick={props.onCircleClick}
        />
      )}
      
    </div>
  );
};
