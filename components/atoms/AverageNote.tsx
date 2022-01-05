import { WritableQuark, QuarkIter, useQuark } from 'helpers/quarky';
import React from 'react';
import { TrackData, TrackRating } from 'types';
import { Icon } from '.';

interface AverageNoteProps {
  ratings: QuarkIter<WritableQuark<TrackRating>>,
  className?: string,
  wrapperClassName?: string
}

export const AverageNote: React.FC<AverageNoteProps> = (props: AverageNoteProps) => {
  const ratings = useQuark(props.ratings.unwrap());

  let total = 0;
  for (const rating of ratings) {
    total += rating.rating;
  }
  const avgNote = total / ratings.length;

  if (ratings.length >= 1) {
    return (
      <div className={props.wrapperClassName ? props.wrapperClassName : ''}>
        <div className={`flex flex-row items-end ${props.className ? props.className : ''}`}>
          <Icon
            name="star"
            SVGClassName="fill-main w-6 h-6"
          />
          <span className="ktext-subtitle text-main mb-[-4px]">{avgNote}</span>
        </div>
      </div >
    );
  }
  return null;
}
