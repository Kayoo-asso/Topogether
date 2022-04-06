import React, { useState } from 'react';
import {
    Button, DownloadButton, Flash, LikeButton, Modal, GradeHistogram, ParkingButton, ParkingModal, SlideagainstRightDesktop
} from 'components';
import { LightTopo } from 'types';
import { encodeUUID, TopoTypeToColor } from 'helpers';
import { CFImage } from 'components/atoms/CFImage';
import Rock from 'assets/icons/rock.svg'
import ManyTracks from 'assets/icons/many-tracks.svg';
import Waypoint from 'assets/icons/waypoint.svg';

interface TopoPreviewProps {
    topo: LightTopo,
    open?: boolean,
    onClose: () => void,
}

export const TopoPreview: React.FC<TopoPreviewProps> = (props: TopoPreviewProps) => {
    const [modalParkingOpen, setModalParkingOpen] = useState(false);
    const [flashMessage, setFlashMessage] = useState<string>();
    const topo = props.topo;

    const topoPreviewContent = () => (
        <>
            <div className="flex flex-row gap-5 px-6 pt-4 md:hidden">
                <LikeButton
                    liked={props.topo.liked}
                />
                <DownloadButton
                    topo={props.topo}
                />
            </div>

            <div className="flex flex-col md:mt-4">
                <div className="px-4 ktext-section-title justify-center md:justify-start flex flex-row items-center">
                    <Waypoint
                        className={'h-6 w-6 ' + TopoTypeToColor(topo.type)} //TODO : change color depending on topo type
                    />
                    <div className='ml-2'>{topo.name}</div>
                </div>

                {(topo.closestCity && topo.closestCity !== topo.name) &&
                    <div className='px-4 ktext-label text-center md:text-left text-grey-medium'>{topo.closestCity}</div>}
                <div
                    className='px-4 ktext-label text-center md:text-left text-grey-medium cursor-pointer'
                    onClick={() => {
                        const data = [new ClipboardItem({ "text/plain": new Blob([topo.location[1] + ',' + topo.location[0]], { type: "text/plain" }) })];
                        navigator.clipboard.write(data).then(function () {
                            setFlashMessage("Coordonnées copiées dans le presse papier.");
                        }, function () {
                            setFlashMessage("Impossible de copier les coordonées.");
                        });
                    }}
                >
                    {parseFloat(topo.location[1].toFixed(12)) + ',' + parseFloat(topo.location[0].toFixed(12))}
                </div>

                <div className="mt-4 h-[160px] w-full overflow-hidden">
                    <CFImage
                        image={topo.image}
                        className="w-full object-contain"
                        alt="image principale du topo"
                        sizeHint='50vw'
                    />
                </div>

                <div className="ktext-base-little mt-4 px-4 hide-after-three-lines overflow-hidden">
                    {topo.description}
                </div>

                <div className="flex flex-row md:flex-col pt-4 md:pt-10 px-4">
                    <div className='w-1/3 md:w-full flex flex-col gap-3 md:flex-row md:justify-around'>
                        <div className='flex flex-row pt-6 md:pt-0'>
                            <Rock
                                className="h-6 w-6 stroke-dark"
                            />
                            <div className="ml-2">
                                {topo.nbBoulders} blocs
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <ManyTracks
                                className="h-6 w-6 stroke-dark"
                            />
                            <div className="ml-2">
                                {topo.nbTracks} voies
                            </div>
                        </div>
                    </div>

                    <div className="w-2/3 md:w-full flex items-end justify-end md:justify-center md:mt-5 md:h-[120px]">
                        <GradeHistogram
                            topo={topo}
                            size='little'
                        />
                    </div>
                </div>

                <div className='flex flex-col w-full md:absolute md:bottom-0'>
                    <div className="w-full p-4 mt-4">
                        <Button
                            content="Entrer"
                            fullWidth
                            href={'/topo/' + encodeUUID(topo.id)}
                        />
                    </div>
                    {topo.parkingLocation &&
                        <div className="pb-4">
                            <ParkingButton
                                onClick={() => setModalParkingOpen(true)}
                            />
                        </div>
                    }
                </div>
            </div>
        </>
    )

    return (
        <>
            <div className='md:hidden'>
                <Modal
                    withBackground={false}
                    onClose={props.onClose}
                >
                    {topoPreviewContent()}
                </Modal>
            </div>
            <div className="hidden md:block">
                <SlideagainstRightDesktop
                    open
                    displayLikeButton
                    displayDlButton
                    item={props.topo}
                    onClose={props.onClose}
                >
                    {topoPreviewContent()}
                </SlideagainstRightDesktop>
            </div>

            {modalParkingOpen && topo.parkingLocation &&
                <ParkingModal
                    parkingLocation={topo.parkingLocation}
                    onClose={() => setModalParkingOpen(false)}
                />
            }
            <Flash
                open={!!flashMessage}
                onClose={() => setFlashMessage(undefined)}
            >
                {flashMessage}
            </Flash>
        </>
    );
};

TopoPreview.displayName = "TopoPreview";