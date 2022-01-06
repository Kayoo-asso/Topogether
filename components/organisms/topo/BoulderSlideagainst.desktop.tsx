import { Icon, SlideagainstRightDesktop } from 'components';
import { Signal } from 'helpers/quarky';
import React from 'react';
import { Boulder, BoulderData, Track, TrackData } from 'types';
import { TracksList } from '.';

interface BoulderSlideagainstDesktopProps {
    boulder: Signal<Boulder>,
    open?: boolean,
    onSelectTrack?: (track: Signal<Track>) => void,
    onClose: () => void,
}

export const BoulderSlideagainstDesktop: React.FC<BoulderSlideagainstDesktopProps> = ({
    open = true,
    ...props
}: BoulderSlideagainstDesktopProps) => {
    const boulder = props.boulder();
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
                        <span className='ktext-big-title ml-3'>{boulder.name}</span>
                    </div>
                    <div className='ktext-label text-grey-medium'>{boulder.location.lat + ',' + boulder.location.lng}</div>
                    {boulder.isHighball && <div className='ktext-label text-grey-medium'>High Ball</div>}
                    {boulder.mustSee && <div className='ktext-label text-grey-medium mb-15'>Incontournable !</div>}

                    <div>{/* TODO Boulder Preview*/}</div>
                </div>

                <TracksList 
                    tracks={boulder.tracks}
                    onTrackClick={props.onSelectTrack}
                />
            </>
        </SlideagainstRightDesktop>
    )
}