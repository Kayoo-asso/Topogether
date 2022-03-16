import React from 'react';
import { GradeCircle } from 'components';
import { GradeHistogram, LightGrade, lightGrades } from 'types';
import { Signal } from 'helpers/quarky';

type GradeHistogramSelection = {
  [K in LightGrade]: boolean
}

const defaultHistogramSelection: GradeHistogramSelection = {
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
  8: false,
  9: false,
  None: false
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
  const histogram = props.histogram();

  return (
    <div className={`flex ${props.className}`}>
      {lightGrades.slice(0,-1).map(grade =>
        <GradeCircle
          key={grade}
          grade={grade}
          size={circleSize}
          selected={!!histogram[grade]}
          className="mr-1"
          onClick={props.onCircleClick}
        />
      )}
      
    </div>
  );
};
