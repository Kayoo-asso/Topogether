import React from 'react';
import { SlideagainstRightDesktop } from 'components';
import { Quark } from 'helpers/quarky';
import { Track } from 'types';

interface TrackFormSlideagainstDesktopProps {
    track: Quark<Track>,
    open?: boolean,
    onClose: () => void,
}

export const TrackFormSlideagainstDesktop: React.FC<TrackFormSlideagainstDesktopProps> = ({
    open = true,
    ...props
}: TrackFormSlideagainstDesktopProps) => {
    const track = props.track();

    return (
        <SlideagainstRightDesktop 
            open={open}
            onClose={props.onClose}
        >
            <>
                TRACK FORM
            </>
        </SlideagainstRightDesktop>
    )
}