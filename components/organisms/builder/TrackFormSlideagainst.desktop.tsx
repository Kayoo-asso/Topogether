import React, { useState } from 'react';
import { Button, Checkbox, ModalDelete, MultipleSelect, SlideagainstRightDesktop, TextArea, TextInput } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Description, Name, Track } from 'types';

interface TrackFormSlideagainstDesktopProps {
    track: Quark<Track>,
    onClose: () => void,
}

export const TrackFormSlideagainstDesktop: React.FC<TrackFormSlideagainstDesktopProps> = watchDependencies((props: TrackFormSlideagainstDesktopProps) => {
    const track = props.track();
    const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

    return (
        <SlideagainstRightDesktop 
            open
            onClose={props.onClose}
        >
            <>
                <div className='px-5 mb-10 mt-3'>

                    <div className='flex flex-col gap-6'>
                        <TextInput 
                            id='track-name'
                            label='Nom de la voie'
                            value={track.name}
                            onChange={(e) => props.track.set({
                                ...track,
                                name: e.target.value as Name
                            })}
                        />
                    
                        <div className='flex flex-col gap-3'>
                            <Checkbox 
                                label='Traversée'
                                checked={track.isTraverse}
                                onClick={(checked) => props.track.set({
                                    ...track,
                                    isTraverse: checked
                                })}
                            />
                            <Checkbox 
                                label='Départ assis'
                                checked={track.isSittingStart}
                                onClick={(checked) => props.track.set({
                                    ...track,
                                    isSittingStart: checked
                                })}
                            />
                            <Checkbox 
                                label='Incontournable'
                                checked={track.mustSee}
                                onClick={(checked) => props.track.set({
                                    ...track,
                                    mustSee: checked
                                })}
                            />
                        </div>
                                
                        <MultipleSelect 
                            id='track-techniques'
                            label='Techniques'
                            //TODO FINISH
                            options={[
                                {
                                    value: 'Lolotte'
                                },
                                {
                                    value: 'Dulfer'
                                }
                            ]}
                            value={[]}
                            onChange={(opts) => console.log(opts)}
                        />

                        <MultipleSelect 
                            id='track-receptions'
                            label='Réception'
                            //TODO FINISH
                            options={[
                                {
                                    value: 'Bonne'
                                },
                                {
                                    value: 'Mauvaise'
                                }
                            ]}
                            value={[]}
                            onChange={(opts) => console.log(opts)}
                        />

                        <TextInput 
                            id='track-height'
                            label='Hauteur'
                            type='number'
                            step='any'
                            value={track.height}
                            onChange={(e) => props.track.set({
                                ...track,
                                height: parseFloat(e.target.value)
                            })}
                        />

                        <TextArea 
                            id='track-description'
                            label='Description'
                            value={track.description}
                            onChange={(e) => props.track.set({
                                ...track,
                                description: e.target.value as Description
                            })}
                        />

                    </div>

                    <div className='absolute w-full bottom-5 left-0 px-5'>
                        <Button 
                            content='Supprimer'
                            onClick={() => setDisplayDeleteModal(true)}
                            fullWidth
                        />
                    </div>

                </div>

                {displayDeleteModal &&
                    <ModalDelete
                        onClose={() => setDisplayDeleteModal(false)}
                        onDelete={() => {}} //TODO
                    >
                        Etes-vous sûr de vouloir supprimer la voie ?
                    </ModalDelete>
                }
            </>
        </SlideagainstRightDesktop>
    )
});