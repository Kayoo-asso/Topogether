import React from 'react';
import { SlideagainstRightDesktop } from 'components';
import { Signal } from 'helpers/quarky';
import { Track } from 'types';

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
            <>
                blabla
            </>
        </SlideagainstRightDesktop>
    )
}