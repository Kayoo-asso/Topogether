import React from 'react';
import { SlideagainstRightDesktop, TracksList } from 'components';
import { Quark } from 'helpers/quarky';
import { Boulder, Track, UUID } from 'types';

interface BoulderBuilderSlideagainstDesktopProps {
    boulder: Quark<Boulder>,
    open?: boolean,
    topoCreatorId?: UUID,
    onSelectTrack?: (track: Quark<Track>) => void,
    onClose: () => void,
}

export const BoulderBuilderSlideagainstDesktop: React.FC<BoulderBuilderSlideagainstDesktopProps> = ({
    open = true,
    ...props
}: BoulderBuilderSlideagainstDesktopProps) => {
    const boulder = props.boulder();

    return (
        <SlideagainstRightDesktop 
            open={open}
            onClose={props.onClose}
        >
            <>
                BOULDER FORM
            </>
        </SlideagainstRightDesktop>
    )
}