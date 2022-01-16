import React, { useContext, useState } from 'react';
import {
  Button, DownloadButton, Flash, Icon, LikeButton, Modal, GradeHistogram, ParkingButton, ParkingModal, SlideagainstRightDesktop
} from 'components';
import { default as NextImage } from 'next/image';
import { LightTopo } from 'types';
import { Signal } from 'helpers/quarky';
import { DeviceContext, staticUrl, TopoTypeToColor } from 'helpers';

interface TopoPreviewProps {
  topo: Signal<LightTopo>,
  open?: boolean,
  onClose: () => void,
}

export const TopoPreview: React.FC<TopoPreviewProps> = (props: TopoPreviewProps) => {
    const device = useContext(DeviceContext);
    const [modalParkingOpen, setModalParkingOpen] = useState(false);
    const [flashMessage, setFlashMessage] = useState<string>();
    const topo = props.topo();

    const topoPreviewContent = () => (
        <>
            <div className="flex flex-row gap-5 px-6 pt-4 md:hidden">
                <LikeButton
                    item={props.topo}
                />
                <DownloadButton
                    topo={props.topo}
                />
            </div>

            <div className="flex flex-col md:mt-4">
                <div className="px-4 ktext-section-title justify-center md:justify-start flex flex-row items-center">
                    <Icon 
                        name='waypoint'
                        SVGClassName={'h-6 w-6 ' + TopoTypeToColor(topo.type)} //TODO : change color depending on topo type
                    />
                    <div className='ml-2'>{topo.name}</div>
                </div>

                {(topo.closestCity && topo.closestCity !== topo.name) && 
                    <div className='px-4 ktext-label text-center md:text-left text-grey-medium'>{topo.closestCity}</div>}
                <div 
                    className='px-4 ktext-label text-center md:text-left text-grey-medium cursor-pointer'
                    onClick={() => {
                        const data = [new ClipboardItem({ "text/plain": new Blob([topo.location.lat+','+topo.location.lng], { type: "text/plain" }) })];
                        navigator.clipboard.write(data).then(function() {
                            setFlashMessage("Coordonnées copiées dans le presse papier.");
                        }, function() {
                            setFlashMessage("Impossible de copier les coordonées.");
                        });
                    }}
                >
                    {parseFloat(topo.location.lat.toFixed(12)) + ',' + parseFloat(topo.location.lng.toFixed(12))}
                </div>

                <div className="w-full h-[160px] relative mt-4">
                    <NextImage
                    src={topo.image?.url || staticUrl.defaultKayoo}
                    alt="image principale du topo"
                    priority
                    layout="fill"
                    objectFit="cover"
                    />
                </div>

                <div className="ktext-base-little mt-4 px-4 hide-after-two-lines overflow-hidden">
                    {topo.description}
                </div>

                <div className="flex flex-row md:flex-col pt-4 md:pt-10 px-4">
                    <div className='w-1/3 md:w-full flex flex-col gap-3 md:flex-row md:justify-around'>
                        <div className='flex flex-row pt-6 md:pt-0'>
                            <Icon
                                name="rock"
                                SVGClassName="h-6 w-6 stroke-dark"
                            />
                            <div className="ml-2">
                                {topo.nbBoulders} blocs
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <Icon
                                name="many-tracks"
                                SVGClassName="h-6 w-6 stroke-dark"
                            />
                            <div className="ml-2">
                                {topo.nbTracks} voies
                            </div>
                        </div>
                    </div>

                    <div className="w-2/3 md:w-full flex items-end justify-end md:justify-center md:mt-5 md:h-[120px]">
                        <GradeHistogram
                            topo={props.topo()}
                            size='little'
                        />
                    </div>
                </div>
                
                <div className='flex flex-col w-full md:absolute md:bottom-0'>
                    <div className="w-full p-4 mt-4">
                        <Button
                            content="Entrer"
                            fullWidth
                            href={'/topo/'+topo.id}
                        />
                    </div>
                    <div className="pb-4">
                        <ParkingButton
                        onClick={() => setModalParkingOpen(true)}
                        />
                    </div>
                </div>
            </div>
        </>
    )

  return (
    <>
        {device === 'MOBILE' &&
            <Modal
                withBackground={false}
                onClose={props.onClose}
            >
                {topoPreviewContent()}
            </Modal>
        }
        {device !== 'MOBILE' &&
            <SlideagainstRightDesktop 
                open
                displayLikeButton
                displayDlButton
                item={props.topo}
                onClose={props.onClose}
            >
                {topoPreviewContent()}
            </SlideagainstRightDesktop>
        }

        {modalParkingOpen &&
            <ParkingModal
                parkingLocation={topo.firstParkingLocation}
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