import { UserPositionContext } from 'helpers/context/UserPositionProvider';
import { Portal, useBreakpoint, useIsIos} from 'helpers';
import launchNavigation from 'helpers/map/launchNavigation';
import React, { useContext, useState } from 'react';
import { GeoCoordinates } from 'types';
import { Flash } from '.';

interface ParkingModalProps {
    open: boolean,
    parkingLocation: GeoCoordinates,
    onClose: () => void,
}

export const ParkingModal: React.FC<ParkingModalProps> = (props: ParkingModalProps) => {
    const breakpoint = useBreakpoint();
    const { position } = useContext(UserPositionContext);
    const [flashMessage, setFlashMessage] = useState<string>();
    const isIos = useIsIos();

    return (
        <Portal open={props.open}>
            <div 
                className='absolute top-0 left-0 flex z-full w-screen h-screen bg-black bg-opacity-80'
                onClick={props.onClose}
            >
                <div className='w-11/12 shadow absolute left-[50%] translate-x-[-50%] bottom-[80px]'>
                    <div className='ktext-base rounded bg-white text-main text-center cursor-pointer'>
                        <div 
                            className='py-5 border-b border-grey-light' 
                            onClick={(e) => {
                                e.stopPropagation();
                                launchNavigation(props.parkingLocation, position, 'google', breakpoint, isIos);
                                props.onClose();
                            }}
                        >Google Maps</div>
                        {isIos  && 
                            <div 
                                className='py-5 border-b border-grey-light' 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    launchNavigation(props.parkingLocation, position, 'apple', breakpoint, isIos)
                                    props.onClose();
                                }}
                            >Apple Maps</div>
                        }
                        <div 
                            className='py-5' 
                            onClick={(e) => {
                                e.stopPropagation();
                                const data = [new ClipboardItem({ "text/plain": new Blob([props.parkingLocation[1]+','+props.parkingLocation[0]], { type: "text/plain" }) })];
                                navigator.clipboard.write(data).then(function() {
                                    setFlashMessage("Coordonnées copiées dans le presse papier.");
                                }, function() {
                                    setFlashMessage("Impossible de copier les coordonées.");
                                });
                            }}
                        >Copier les coordonnées</div>
                    </div>
                    <div className='ktext-base rounded mt-2 py-5 bg-white text-main text-center cursor-pointer'>
                        Annuler
                    </div>
                </div>
            </div>
            <Flash 
                open={!!flashMessage}
                onClose={() => setFlashMessage(undefined)}
            >
                {flashMessage}
            </Flash>
        </Portal>
    )
}