import { AverageNote, GradeCircle } from 'components';
import React from 'react';
import { GradeEnum, Track } from 'types';

interface TracksListProps {
    tracks: Track[],
    displayAddButton?: boolean,
    onTrackClick?: (id: number) => void,
}

export const TracksList: React.FC<TracksListProps> = ({
    displayAddButton= false,
    ...props
}: TracksListProps) => {

    const getGradeColor = (grade: GradeEnum | undefined) => {
        if (grade) {
          switch (parseInt(grade[0])) {
            case 3:
              return 'text-diff-3';
            case 4:
                return 'text-diff-4';
            case 5:
                return 'text-diff-5';
            case 6:
                return 'text-diff-6';
            case 7:
                return 'text-diff-7';
            case 8:
                return 'text-diff-8';
            case 9:
                return 'text-diff-9';
            default:
              return 'bg-grey-light';
          }
        } else return 'border-grey-light bg-grey-light text-white';
      };

    return (
        <div className='w-full h-[100px] border-t border-grey-light'>
            {props.tracks.map(track => (
                <div 
                    key={track.id}
                    className='px-5 py-5 grid grid-cols-10 items-center border-b border-grey-light'
                    onClick={() => {
                        props.onTrackClick && props.onTrackClick(track.id);
                    }}
                >
                    {track.grade && 
                        <GradeCircle 
                            grade={track.grade}
                            className=''
                            content={track.orderIndex}
                        />
                    }
                    
                    <div className={`ktext-subtitle mr-1 text-right ${getGradeColor(track.grade)}`}>{track.grade && track.grade}</div>
                    <div className='col-span-6'>
                        <span className='ktext-base-big'>{track.name}</span>
                    </div>
                    {track.note &&
                        <div className='col-span-2'>
                            <AverageNote note={track.note} className='justify-end' />
                        </div>
                    }
                </div>
            ))}
            {displayAddButton &&
                <div className='ktext-subtitle text-grey-medium px-5 py-5 cursor-pointer border-b border-grey-light'>
                    <span className='ml-2 mr-5 text-xl'>+</span> <span>Nouveau passage</span>
                </div>
            }
        </div>
    )
}