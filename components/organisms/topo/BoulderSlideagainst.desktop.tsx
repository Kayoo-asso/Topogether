import React, { useMemo, useState } from 'react';
import { BoulderPreviewDesktop, Flash, Icon, LikeButton, SlideagainstRightDesktop, TracksList } from 'components';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Track, UUID } from 'types';

interface BoulderSlideagainstDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    topoCreatorId?: UUID,
    onSelectTrack?: (track: Quark<Track>) => void,
    onClose: () => void,
}

export const BoulderSlideagainstDesktop: React.FC<BoulderSlideagainstDesktopProps> = watchDependencies((props: BoulderSlideagainstDesktopProps) => {
    const [flashMessage, setFlashMessage] = useState<string>();
    const [officialTrackTab, setOfficialTrackTab] = useState(true);
    const boulder = props.boulder();

    const displayedTracks = useMemo(() => boulder.tracks
        .quarks()
        .filter((track) => ((track().creatorId) === props.topoCreatorId) === officialTrackTab),
        [boulder.tracks, props.topoCreatorId, officialTrackTab],
    );

    return (
        <>
            <SlideagainstRightDesktop 
                open
                displayLikeButton
                item={props.boulder}
                onClose={props.onClose}
            >
                <>
                    <div className='px-5 mb-10'>
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
                        
                        <div className='mt-3'>
                            <BoulderPreviewDesktop
                                boulder={props.boulder}
                                selectedTrack={props.selectedTrack}
                            />
                        </div>
                    </div>             

                    <div className="flex flex-row px-5 ktext-label font-bold my-2 justify-between">
                        <span className={`cursor-pointer ${officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(true)}>officielles</span>
                        <span className={`cursor-pointer ${!officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(false)}>communautés</span>
                    </div>

                    <div className='overflow-auto'>
                        <TracksList 
                            tracks={displayedTracks}
                            selectedTrack={props.selectedTrack}
                        />
                    </div>
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
});