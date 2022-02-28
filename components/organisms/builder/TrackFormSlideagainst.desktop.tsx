import React, { useState } from 'react';
import { ModalDelete, SlideagainstRightDesktop } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Track } from 'types';
import { TrackForm } from '../form/TrackForm';

interface TrackFormSlideagainstDesktopProps {
    track: Quark<Track>,
    onClose: () => void,
    onDeleteTrack: () => void,
}

export const TrackFormSlideagainstDesktop: React.FC<TrackFormSlideagainstDesktopProps> = watchDependencies((props: TrackFormSlideagainstDesktopProps) => {
    const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

    return (
        <>
            <SlideagainstRightDesktop 
                open
                onClose={props.onClose}
            >
                <div className='px-5 py-3 h-full'>
                    <TrackForm 
                        track={props.track}
                        onDeleteTrack={() => setDisplayDeleteModal(true)}
                    />
                </div>
            </SlideagainstRightDesktop>

            {displayDeleteModal &&
                <ModalDelete
                    onClose={() => setDisplayDeleteModal(false)}
                    onDelete={() => props.onDeleteTrack()}
                >
                    Etes-vous sûr de vouloir supprimer la voie ?
                </ModalDelete>
            }
        </>
    )
});

TrackFormSlideagainstDesktop.displayName = "TrackFormSlideagainstDesktop";