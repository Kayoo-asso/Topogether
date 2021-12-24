import { Icon, SlideagainstRightDesktop } from 'components';
import React from 'react';
import { Boulder, Track } from 'types';
import { TracksList } from '.';

interface BoulderSlideagainstDesktopProps {
    boulder: Boulder,
    open?: boolean,
    onSelectTrack?: (track: Track) => void,
    onClose: () => void,
}

export const BoulderSlideagainstDesktop: React.FC<BoulderSlideagainstDesktopProps> = ({
    open = true,
    ...props
}: BoulderSlideagainstDesktopProps) => {
    return (
        <SlideagainstRightDesktop 
            open={open}
            onClose={props.onClose}
        >
            <>
                <div className='px-8 mb-10'>
                    <div className='flex flex-row items-end mb-2'>
                        <Icon 
                            name='rock'
                        />
                        <span className='ktext-big-title ml-3'>{props.boulder.name}</span>
                    </div>
                    <div className='ktext-label text-grey-medium'>{props.boulder.location.lat + ',' + props.boulder.location.lng}</div>
                    {props.boulder.isHighball && <div className='ktext-label text-grey-medium'>High Ball</div>}
                    {props.boulder.mustSee && <div className='ktext-label text-grey-medium mb-15'>Incontournable !</div>}

                    <div>{/* TODO Boulder Preview*/}</div>
                </div>

                <TracksList 
                    tracks={props.boulder.tracks}
                    onTrackClick={props.onSelectTrack}
                />
            </>
        </SlideagainstRightDesktop>
    )
}