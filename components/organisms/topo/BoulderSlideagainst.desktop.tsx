import React, { Dispatch, SetStateAction, useState } from 'react';
import { BoulderPreviewDesktop, Button, Flash, Icon, Modal, SlideagainstRightDesktop, TracksList } from 'components';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Track, UUID } from 'types';
import { LoginForm } from '..';
import { useSession } from 'helpers/hooks/useSession';

interface BoulderSlideagainstDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    topoCreatorId?: UUID,
    currentImage?: Image,
    setCurrentImage: Dispatch<SetStateAction<Image | undefined>>,
    onClose: () => void,
}

export const BoulderSlideagainstDesktop: React.FC<BoulderSlideagainstDesktopProps> = watchDependencies((props: BoulderSlideagainstDesktopProps) => {
    const session = useSession();
    
    const [flashMessage, setFlashMessage] = useState<string>();
    const [officialTrackTab, setOfficialTrackTab] = useState(true);
    const boulder = props.boulder();

    const displayedTracks = boulder.tracks
        .quarks()
        .filter((track) => ((track().creatorId) === props.topoCreatorId) === officialTrackTab);

    const [displayModalLoginRedirect, setDisplayModalLoginRedirect] = useState(false);

    return (
        <>
            <SlideagainstRightDesktop 
                open
                className='overflow-scroll'
                displayLikeButton
                item={props.boulder()}
                onClose={props.onClose}
            >
                <>
                    <div className='px-5'>
                        <div className='flex flex-row items-end mb-2'>
                            <Icon 
                                name='rock'
                            />
                            <span className='ktext-big-title ml-3'>{boulder.name}</span>
                        </div>
                        <div 
                            className='ktext-label text-grey-medium cursor-pointer'
                            onClick={() => {
                                const data = [new ClipboardItem({ "text/plain": new Blob([boulder.location[1] + ',' + boulder.location[0]], { type: "text/plain" }) })];
                                navigator.clipboard.write(data).then(function() {
                                    setFlashMessage("Coordonnées copiées dans le presse papier.");
                                }, function() {
                                    setFlashMessage("Impossible de copier les coordonées.");
                                });
                            }}
                        >
                            {parseFloat(boulder.location[1].toFixed(12)) + ',' + parseFloat(boulder.location[0].toFixed(12))}
                        </div>
                        {boulder.isHighball && <div className='ktext-label text-grey-medium'>High Ball</div>}
                        {boulder.mustSee && <div className='ktext-label text-grey-medium mb-15'>Incontournable !</div>}
                    </div>             
                    <div className='mt-3'>
                        <BoulderPreviewDesktop
                            boulder={props.boulder}
                            selectedTrack={props.selectedTrack}
                            currentImage={props.currentImage}
                            setCurrentImage={props.setCurrentImage}
                        />
                    </div>

                    <div className="flex flex-row px-5 mt-10 ktext-label font-bold my-2 justify-between">
                        <span className={`cursor-pointer ${officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(true)}>officielles</span>
                        <span className={`cursor-pointer ${!officialTrackTab ? 'text-main' : 'text-grey-medium'}`} onClick={() => setOfficialTrackTab(false)}>communautés</span>
                    </div>

                    <div className='overflow-auto'>
                        <TracksList 
                            tracks={displayedTracks}
                            selectedTrack={props.selectedTrack}
                            onTrackClick={(trackQuark) => {
                                if (props.selectedTrack()?.id === trackQuark().id) props.selectedTrack.select(undefined);
                                else {
                                    const track = trackQuark();
                                    if (track.lines.length > 0) {
                                        const newImage = boulder.images.find(img => img.id === trackQuark().lines.at(0).imageId);
                                        if (!newImage) throw new Error("Could not find the first image for the selected track!");
                                        props.setCurrentImage(newImage);
                                    }
                                    props.selectedTrack.select(trackQuark);
                                }
                            }}
                        />
                    </div>
                    {!officialTrackTab &&
                        <div className="flex flex-col mt-4 px-5 items-center">
                            <Button 
                                content="Ajouter une voie"
                                fullWidth
                                onClick={() => {
                                    if (session) alert("à venir");
                                    else setDisplayModalLoginRedirect(true);
                                }}
                            />
                        </div>
                    }
                </>
            </SlideagainstRightDesktop>

            <Flash 
                open={!!flashMessage}
                onClose={() => setFlashMessage(undefined)}
            >
                {flashMessage}
            </Flash>

            {displayModalLoginRedirect &&
                <Modal 
                    onClose={() => setDisplayModalLoginRedirect(false)}
                >
                    <div className='p-8 mt-4'>
                        <div className='text-center mb-8'>Pour ajouter une voie "Communauté", vous devez être connecté.</div>
                        <LoginForm onLogin={() => setDisplayModalLoginRedirect(false)} />
                    </div>
                </Modal>
            }
        </>
    )
});

BoulderSlideagainstDesktop.displayName = "BoulderSlideagainstDesktop";