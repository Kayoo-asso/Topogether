import { Quark, SelectQuarkNullable } from 'helpers/quarky';
import React from 'react';
import { Boulder, Track, UUID } from 'types';
import { BoulderSlideagainstDesktop, BoulderSlideoverMobile } from '.';

interface BoulderSlideProps {
    open?: boolean,
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    topoCreatorId?: UUID,
    forBuilder?: boolean,
    onPhotoButtonClick?: () => void,
    // onSelectTrack: (selected: WritableQuark<Track>) => void,
    onDrawButtonClick?: () => void,
    onClose: () => void,
}

export const BoulderSlide: React.FC<BoulderSlideProps> = (props: BoulderSlideProps) => {
    return (
        <>
            <div className="md:hidden">
                <BoulderSlideoverMobile {...props} />
            </div>
            <div className="hidden md:block">
                <BoulderSlideagainstDesktop {...props} />
            </div>
        </> 
    )
}