import React, { useState } from 'react';
import { Button, ModalDelete, SlideagainstRightDesktop } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Track } from 'types';
import { TrackForm } from '../form/TrackForm';

interface TrackFormSlideagainstDesktopProps {
    track: Quark<Track>,
    onClose: () => void,
    onDeleteTrack: (quarkTrack: Quark<Track>) => void,
}

export const TrackFormSlideagainstDesktop: React.FC<TrackFormSlideagainstDesktopProps> = watchDependencies((props: TrackFormSlideagainstDesktopProps) => {
    const track = props.track();
    const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

    return (
        <>
        <SlideagainstRightDesktop 
            open
            onClose={props.onClose}
        >
            <div className='px-5 mb-10 mt-3'>

                <TrackForm 
                    track={props.track}
                />

                <div className='absolute w-full bottom-5 left-0 px-5'>
                    <Button 
                        content='Supprimer'
                        onClick={() => setDisplayDeleteModal(true)}
                        fullWidth
                    />
                </div>

            </div>
        </SlideagainstRightDesktop>

        {displayDeleteModal &&
            <ModalDelete
                onClose={() => setDisplayDeleteModal(false)}
                onDelete={() => props.onDeleteTrack(props.track)}
            >
                Etes-vous sûr de vouloir supprimer la voie ?
            </ModalDelete>
        }
        </>
    )
});