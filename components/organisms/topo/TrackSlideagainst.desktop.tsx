import React from 'react';
import { GradeCircle, SlideagainstRightDesktop } from 'components';
import { Signal } from 'helpers/quarky';
import { gradeToLightGrade, Orientation, Track } from 'types';
import { ClimbTechniquesName, listFlags } from 'helpers';
import { OrientationName, ReceptionName } from 'types/EnumNames';

interface TrackSlideagainstDesktopProps {
    track: Signal<Track>,
    open?: boolean,
    onClose: () => void,
}

export const TrackSlideagainstDesktop: React.FC<TrackSlideagainstDesktopProps> = ({
    open = true,
    ...props
}: TrackSlideagainstDesktopProps) => {
    const track = props.track();

    return (
        <SlideagainstRightDesktop 
            open={open}
            onClose={props.onClose}
        >
            <div className='flex flex-col px-6 mb-10'>
                <div className='flex flex-row items-center mb-2'>
                    <GradeCircle 
                        grade={gradeToLightGrade(track.grade)}
                    />
                    <div className='ktext-big-title ml-3'>{track.name}</div>
                </div>

                {track.isTraverse && <div className='ktext-label text-grey-medium'>Traversée</div>}
                {track.isSittingStart && <div className='ktext-label text-grey-medium'>Départ assis</div>}
                {track.mustSee && <div className='ktext-label text-grey-medium'>Incontournable !</div>}

                <div className='mt-4 ktext-base-little'>
                  {track.description}
                </div>

                <div className='flex flex-col gap-3 mt-4'>
                    <div><span className="ktext-subtitle">Techniques : </span>{listFlags(track.techniques!, ClimbTechniquesName).join(', ')}</div>
                    
                    <div><span className="ktext-subtitle">Réception : </span>{ReceptionName[track.reception!]}</div>

                    <div><span className="ktext-subtitle">Orientation :</span>{OrientationName[track.orientation!]}</div>
                </div>

            </div>
        </SlideagainstRightDesktop>
    )
}