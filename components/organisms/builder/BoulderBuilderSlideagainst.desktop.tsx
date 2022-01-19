import React, { Dispatch, SetStateAction } from 'react';
import { BoulderPreviewDesktop, Checkbox, SlideagainstRightDesktop, TextInput, TracksList } from 'components';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Name, Track, UUID } from 'types';
import { TracksListBuilder } from '.';

interface BoulderBuilderSlideagainstDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    topoCreatorId?: UUID,
    currentImage: Image | undefined,
    setCurrentImage: Dispatch<SetStateAction<Image | undefined>>,
    onClose: () => void,
}

export const BoulderBuilderSlideagainstDesktop: React.FC<BoulderBuilderSlideagainstDesktopProps> = watchDependencies((props: BoulderBuilderSlideagainstDesktopProps) => {
    const boulder = props.boulder();

    return (
        <SlideagainstRightDesktop 
            open
            className='z-50'
            onClose={props.onClose}
        >
            <>
                <div className='px-5 mb-10 mt-3'>

                    <div className='flex flex-col gap-6'>
                        <TextInput 
                            id='boulder-name'
                            label='Nom du bloc'
                            value={boulder.name}
                            onChange={(e) => props.boulder.set({
                                ...boulder,
                                name: e.target.value as Name
                            })}
                        />

                        <div className='flex flex-row gap-3'>
                            <TextInput 
                                id='boulder-latitude'
                                label='Latitude'
                                type='number'
                                value={boulder.location.lat}
                                onChange={(e) => props.boulder.set({
                                    ...boulder,
                                    location: {
                                        lat: parseFloat(e.target.value),
                                        lng: boulder.location.lng
                                    }
                                })}
                            />
                            <TextInput 
                                id='boulder-longitude'
                                label='Longitude'
                                type='number'
                                value={boulder.location.lng}
                                onChange={(e) => props.boulder.set({
                                    ...boulder,
                                    location: {
                                        lat: boulder.location.lat,
                                        lng: parseFloat(e.target.value)
                                    }
                                })}
                            />
                        </div>
                        
                        <div className='flex flex-col gap-3'>
                            <Checkbox 
                                label='High Ball'
                                checked={boulder.isHighball}
                                onClick={(checked) => props.boulder.set({
                                    ...boulder,
                                    isHighball: checked
                                })}
                            />
                            <Checkbox 
                                label='Incontournable'
                                checked={boulder.mustSee}
                                onClick={(checked) => props.boulder.set({
                                    ...boulder,
                                    mustSee: checked
                                })}
                            />
                            <Checkbox 
                                label='Descente dangereuse'
                                checked={boulder.dangerousDescent}
                                onClick={(checked) => props.boulder.set({
                                    ...boulder,
                                    dangerousDescent: checked
                                })}
                            />
                        </div>
                    </div>

                    <div className='mt-3'>
                        <BoulderPreviewDesktop
                            boulder={props.boulder}
                            selectedTrack={props.selectedTrack}
                            currentImage={props.currentImage}
                            setCurrentImage={props.setCurrentImage}
                        />
                    </div>
                </div>             

                <div className='overflow-auto'>
                    <TracksListBuilder 
                        tracks={boulder.tracks.quarks()}
                        selectedTrack={props.selectedTrack}
                        onAddTrack={() => console.log('create track')} //TODO
                    />
                </div>
            </>
        </SlideagainstRightDesktop>
    )
});