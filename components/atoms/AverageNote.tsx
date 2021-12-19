import React from 'react';
import { Icon } from '.';

interface AverageNoteProps {
  note: number,
  className?: string,
}

export const AverageNote: React.FC<AverageNoteProps> = (props: AverageNoteProps) => (
  <div className={`flex flex-row items-end ${props.className ? props.className : ''}`}>
    <Icon
      name="star"
      SVGClassName="fill-main w-6 h-6"
    />
    <span className="ktext-subtitle text-main mb-[-4px]">{props.note}</span>
  </div>
);
