import React, { useContext, useState } from 'react';
import { Flash, ParkingButton, ParkingModal, SlideagainstRightDesktop, SlideoverMobile } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Parking } from 'types';
import { DeviceContext } from 'helpers';
import { CFImage } from 'components/atoms/CFImage';
import ParkingIcon from 'assets/icons/parking.svg'

interface ParkingSlideProps {
    open: boolean,
    parking: Quark<Parking>,
    onClose?: () => void,
}

export const ParkingSlide: React.FC<ParkingSlideProps> = watchDependencies(({
    open = true,
    ...props
}: ParkingSlideProps) => {
    const device = useContext(DeviceContext);

    const [flashMessage, setFlashMessage] = useState<string>();
    const [modalParkingOpen, setModalParkingOpen] = useState(false);
    const parking = props.parking();

    const parkingContent = () => (
        <>
            <div className='flex flex-col h-[90%] md:h-[85%] pt-10 md:pt-0 gap-6'>
                <div className='flex flex-col items-center md:items-start px-6'>
                    <div className='ktext-big-title flex flex-row gap-3 items-center'>
                        <ParkingIcon
                            className='h-6 w-6 fill-second'
                        />
                        {parking.name || "Parking"}
                    </div>
                    <div
                        className='ktext-label text-grey-medium cursor-pointer'
                        onClick={() => {
                            const data = [new ClipboardItem({ "text/plain": new Blob([parking.location[1] + ',' + parking.location[0]], { type: "text/plain" }) })];
                            navigator.clipboard.write(data).then(function () {
                                setFlashMessage("Coordonnées copiées dans le presse papier.");
                            }, function () {
                                setFlashMessage("Impossible de copier les coordonées.");
                            });
                        }}
                    >{parseFloat(parking.location[1].toFixed(12)) + ',' + parseFloat(parking.location[0].toFixed(12))}</div>
                </div>

                <div className='w-full relative max-h-[200px] h-[60%] md:h-[25%] overflow-hidden'>
                    <CFImage
                        image={parking.image}
                        alt="Parking"
                        sizeHint='50vw'
                        objectFit='cover'
                        className="flex"
                        modalable
                    />
                </div>

                <div className='px-6 overflow-auto'>
                    <div><span className='font-semibold'>Nombre de places : </span>{parking.spaces}</div>
                    <div className='mt-2 ktext-base-little'>{parking.description}</div>
                </div>
            </div>
            <div className='absolute text-center px-6 bottom-[9%] md:bottom-2 w-full'>
                <ParkingButton
                    onClick={() => setModalParkingOpen(true)}
                />
            </div>
        </>
    );

    return (
        <>
            {device === 'mobile' &&
                <SlideoverMobile
                    onClose={props.onClose}
                >
                    {parkingContent()}
                </SlideoverMobile>
            }
            {device !== 'mobile' &&
                <SlideagainstRightDesktop
                    open
                    onClose={props.onClose}
                >
                    {parkingContent()}
                </SlideagainstRightDesktop>
            }

            <Flash
                open={!!flashMessage}
                onClose={() => setFlashMessage(undefined)}
            >
                {flashMessage}
            </Flash>

            {modalParkingOpen &&
                <ParkingModal
                    parkingLocation={parking.location}
                    onClose={() => setModalParkingOpen(false)}
                />
            }
        </>
    )
});

ParkingSlide.displayName = "ParkingSlide";