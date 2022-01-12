import React, { useContext, useState } from 'react';
import { Flash, Icon, ParkingButton, ParkingModal, SlideagainstRightDesktop, SlideoverMobile } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Parking } from 'types';
import { DeviceContext, staticUrl } from 'helpers';
import { default as NextImage } from 'next/image';
import launchNavigation from 'helpers/map/launchNavigation';

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
            <div className='flex flex-col items-center md:items-start mt-10 md:mt-0 px-6'>
                <div className='ktext-big-title flex flex-row gap-3 items-center'>
                    <Icon 
                        name='parking'
                        SVGClassName='h-6 w-6 fill-second'
                    />
                    {parking.name}
                </div>
                <div 
                    className='ktext-label text-grey-medium cursor-pointer'
                    onClick={() => {
                        const data = [new ClipboardItem({ "text/plain": new Blob([parking.location.lat+','+parking.location.lng], { type: "text/plain" }) })];
                        navigator.clipboard.write(data).then(function() {
                            setFlashMessage("Coordonnées copiées dans le presse papier.");
                        }, function() {
                            setFlashMessage("Impossible de copier les coordonées.");
                        });
                    }}
                >{parseFloat(parking.location.lat.toFixed(12)) + ',' + parseFloat(parking.location.lng.toFixed(12))}</div>
            </div>

            <div className='w-full relative max-h-[200px] h-[30%] md:h-[25%] mt-6'>
                <NextImage 
                    src={parking.image ? parking.image.url : staticUrl.defaultKayoo}
                    alt="Parking"
                    priority
                    layout="fill"
                    objectFit="contain"
                />
            </div>
            
            <div className='px-6 mt-6'>
                <div><span className='font-semibold'>Nombre de places : </span>{parking.spaces}</div>
                <div className='mt-2'>{parking.description}</div>
            </div>
            
            <div className='absolute text-center px-6 bottom-[10%] md:bottom-[3%] w-full'>
                <ParkingButton 
                    onClick={() => setModalParkingOpen(true)}
                />
            </div>
        </>
    );

    return (
        <>
            {(device === 'MOBILE') &&
                <SlideoverMobile
                    open
                    initialFull={true}
                    onlyFull
                    onClose={props.onClose}
                >
                    {parkingContent()}
                </SlideoverMobile>
            }
            {(device !== 'MOBILE') && 
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

            <ParkingModal
                open={modalParkingOpen}
                onGoogleClick={() => launchNavigation(parking.location, 'google')}
                onAppleClick={() => launchNavigation(parking.location, 'apple')}
                onClose={() => setModalParkingOpen(false)}
            />
        </>
    )
});