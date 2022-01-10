import React, { useState } from 'react';
import { Flash, Icon, SlideagainstRightDesktop, TracksList } from 'components';
import { Quark } from 'helpers/quarky';
import { Boulder, Track, UUID } from 'types';

interface BoulderSlideagainstDesktopProps {
    boulder: Quark<Boulder>,
    open?: boolean,
    topoCreatorId?: UUID,
    onSelectTrack?: (track: Quark<Track>) => void,
    onClose: () => void,
}

export const BoulderSlideagainstDesktop: React.FC<BoulderSlideagainstDesktopProps> = ({
    open = true,
    ...props
}: BoulderSlideagainstDesktopProps) => {
    const [flashMessage, setFlashMessage] = useState<string>();
    const boulder = props.boulder();

    return (
        <>
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
                        <div 
                            className='ktext-label text-grey-medium cursor-pointer'
                            onClick={() => {
                                const data = [new ClipboardItem({ "text/plain": new Blob([boulder.location.lat+','+boulder.location.lng], { type: "text/plain" }) })];
                                navigator.clipboard.write(data).then(function() {
                                    setFlashMessage("Coordonnées copiées dans le presse papier.");
                                }, function() {
                                    setFlashMessage("Impossible de copier les coordonées.");
                                });
                            }}
                        >
                            {parseFloat(boulder.location.lat.toFixed(12)) + ',' + parseFloat(boulder.location.lng.toFixed(12))}
                        </div>
                        {boulder.isHighball && <div className='ktext-label text-grey-medium'>High Ball</div>}
                        {boulder.mustSee && <div className='ktext-label text-grey-medium mb-15'>Incontournable !</div>}

                        <div>{/* TODO Boulder Preview*/}</div>
                    </div>

                    <TracksList 
                        tracks={boulder.tracks.quarks()}
                        onTrackClick={props.onSelectTrack}
                    />
                </>
            </SlideagainstRightDesktop>

            <Flash 
                open={!!flashMessage}
                onClose={() => setFlashMessage(undefined)}
            >
                {flashMessage}
            </Flash>
        </>
    )
}