import React from 'react';
import { Icon } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Boulder, Grade, Track } from 'types';

interface BoulderItemLeftbarProps {
    boulder: Quark<Boulder>,
    orderIndex: number,
    selected: boolean,
    displayed: boolean,
    onArrowClick: () => void,
    onNameClick: () => void,
    onTrackClick: (trackQuark: Quark<Track>) => void,
    displayCreateTrack: boolean,
    onCreateTrack: () => void,
}

export const BoulderItemLeftbar: React.FC<BoulderItemLeftbarProps> = watchDependencies((props: BoulderItemLeftbarProps) => {
    const boulder = props.boulder();
    const tracksIter = boulder.tracks.quarks();
    const trackQuarks = Array.from(tracksIter);

    const getGradeColorClass = (grade: Grade) => {
        const lightGrade = parseInt(grade[0]);
        switch (lightGrade) {
            case 3:
                return 'text-grade-3';
            case 4:
                return 'text-grade-4';
            case 5:
                return 'text-grade-5';
            case 6:
                return 'text-grade-6';
            case 7:
                return 'text-grade-7';
            case 8:
                return 'text-grade-8';
            case 9:
                return 'text-grade-9';
        }
    }

    return (
        <>
            <div className='flex flex-row cursor-pointer text-dark items-center'>
                <Icon
                    name='arrow-simple'
                    wrapperClassName='pr-3'
                    SVGClassName={'w-3 h-3 stroke-dark ' + (props.selected ? 'stroke-2 ' : '') + (props.displayed ? '-rotate-90' : 'rotate-180')}
                    onClick={props.onArrowClick}
                />
                <div onClick={props.onNameClick}>
                    <span className={'mr-2' + (props.selected ? ' font-semibold' : '')}>{props.orderIndex}.</span>
                    <span className={'ktext-base' + (props.selected ? ' font-semibold' : '')}>{boulder.name}</span>
                </div>
            </div>
            
            {props.displayed &&
                // TRACKS
                <div className='flex flex-col ml-4 mb-4'>
                    {trackQuarks.map((trackQuark) => {
                        const track = trackQuark();
                        return (
                            <div 
                                key={track.id} 
                                className='flex flex-row cursor-pointer items-baseline'
                                onClick={() => props.onTrackClick(trackQuark)}
                            >
                                {track.grade &&
                                    <div className={'mr-2 ktext-subtitle ' + getGradeColorClass(track.grade)}>{track.grade}</div>
                                }
                                <div className='text-grey-medium'>{track.name}</div>
                            </div>
                        )
                    })}
                    {props.displayCreateTrack &&
                        <div
                            className='text-grey-medium cursor-pointer mt-2'
                            onClick={props.onCreateTrack}
                        >
                            + Nouveau passage
                        </div>
                    }
                </div>
            }
        </>
    )
});