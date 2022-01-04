import React, { useMemo } from 'react';
import { lightGrades, Topo, TopoData } from 'types';
import { buildGradeHistogram } from 'helpers/topo/buildGradeHistogram';
import { useQuark } from 'helpers/quarky';

interface GradeHistogramProps {
  topo: Topo,
}

const bgStyles = {
  3: 'bg-grade-3',
  4: 'bg-grade-4',
  5: 'bg-grade-5',
  6: 'bg-grade-6',
  7: 'bg-grade-7',
  8: 'bg-grade-8',
  9: 'bg-grade-9',
  None: 'bg-grey-light',
};

export const GradeHistogram: React.FC<GradeHistogramProps> = (props: GradeHistogramProps) => {
  const histogramQ = useMemo(() => buildGradeHistogram(props.topo), [props.topo]);
  const histogram = useQuark(histogramQ);

  // TODO: I removed the special case for grade categories whose count == 0,
  // since it did not show the category properly.
  // The goal should be to have an empty column, with the grade below it, right?
  return (
    <div className="flex h-full">

      {lightGrades.slice(0, -1).map((grade) => {
        const count = histogram[grade];
        const heightPercent = count / histogram.Total * 100;
        const height = `${heightPercent}%`;

        return (
          <div className="flex flex-col justify-end h-full mr-1" key={grade}>
            <div className="ktext-base text-center">
              {count}
            </div>
            <div
              style={{ height }}
              className={`ktext-subtitle w-6 flex flex-col justify-end items-center rounded-full text-white ${bgStyles[grade]}`}
            >
              <div>{grade}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
