import launchNavigation from 'helpers/map/launchNavigation';
import React, { useState } from 'react';
import { GeoCoordinates } from 'types';
import { Flash } from '.';

interface ParkingModalProps {
    parkingLocation: GeoCoordinates,
    onClose?: () => void,
}

export const ParkingModal: React.FC<ParkingModalProps> = (props: ParkingModalProps) => {
    const [flashMessage, setFlashMessage] = useState<string>();

    return (
        <>
            <div 
                className='h-full w-full bg-black bg-opacity-80 fixed z-1000'
                onClick={props.onClose}
            >
                <div className='w-11/12 shadow absolute left-[50%] translate-x-[-50%] bottom-[80px]'>
                    <div className='ktext-base rounded bg-white text-main text-center cursor-pointer'>
                        <div 
                            className='py-5 border-b border-grey-light' 
                            onClick={(e) => {
                                e.stopPropagation();
                                launchNavigation(props.parkingLocation, 'google')
                            }}
                        >Google Maps</div>
                        <div 
                            className='py-5 border-b border-grey-light' 
                            onClick={(e) => {
                                e.stopPropagation();
                                launchNavigation(props.parkingLocation, 'apple')
                            }}
                        >Apple Maps</div>
                        <div 
                            className='py-5' 
                            onClick={(e) => {
                                e.stopPropagation();
                                const data = [new ClipboardItem({ "text/plain": new Blob([props.parkingLocation.lat+','+props.parkingLocation.lng], { type: "text/plain" }) })];
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
        </>
    )
}