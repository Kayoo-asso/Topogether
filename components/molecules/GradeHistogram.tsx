import React from 'react';
import { lightGrades, LightTopo, Topo } from 'types';
import { buildGradeHistogram } from 'helpers/topo/buildGradeHistogram';

interface GradeHistogramProps {
  topo: Topo | LightTopo,
  size?: 'little' | 'normal' | 'big',
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

const isLight = (topo: LightTopo | Topo): topo is LightTopo => (topo as LightTopo).grades !== undefined;

export const GradeHistogram: React.FC<GradeHistogramProps> = ({
  size = 'normal',
  ...props
}: GradeHistogramProps) => {
  const histogram = isLight(props.topo)
                      ? props.topo.grades
                      : buildGradeHistogram(props.topo)();
  const total = histogram[3] 
              + histogram[4] 
              + histogram[5]
              + histogram[6]
              + histogram[7]
              + histogram[8]
              + histogram[9]
              + histogram['None'];
  const { None, ...grades } = histogram;
  const maxNbOfTracks = Math.max(...Object.values(grades));
  const ratio = total / maxNbOfTracks;

  // TODO: I removed the special case for grade categories whose count == 0,
  // since it did not show the category properly.
  // The goal should be to have an empty column, with the grade below it, right?
  return (
    <div className="flex h-full">

      {lightGrades.slice(0, -1).map((grade) => {
        const count = histogram[grade];
        const heightPercent = (count / total * 100) * ratio;
        const height = `${heightPercent}%`;

        return (
          <div className="flex flex-col justify-end h-full mr-1" key={grade}>
            <div className={`text-center ${(size === 'normal') ? 'ktext-base' : 'ktext-base-little'}`}>
              {count}
            </div>
            <div
              style={{ height, minHeight: '22px' }}
              className={`ktext-subtitle ${(size === 'normal') ? 'w-6' : 'w-[22px]'} flex flex-col justify-end items-center rounded-full text-white ${bgStyles[grade]}`}
            >
              <div>{grade}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
