import React from 'react';
import { SlideagainstRightDesktop } from 'components';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Track } from 'types';
import { TrackForm } from '../form/TrackForm';

interface TrackFormSlideagainstDesktopProps {
    track: Quark<Track>,
    onClose: () => void,
    onDeleteTrack: () => void,
}

export const TrackFormSlideagainstDesktop: React.FC<TrackFormSlideagainstDesktopProps> = watchDependencies((props: TrackFormSlideagainstDesktopProps) => {

    return (
        <>
        <SlideagainstRightDesktop 
            open
            onClose={props.onClose}
        >
            <div className='px-5 mb-10 mt-3'>
                <TrackForm 
                    track={props.track}
                    onDeleteTrack={props.onDeleteTrack}
                />
            </div>
        </SlideagainstRightDesktop>
        </>
    )
});