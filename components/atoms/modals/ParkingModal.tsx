import React from 'react';

interface ParkingModalProps {
    open?: boolean
    onGoogleClick?: () => void,
    onAppleClick?: () => void,
    onShareClick?: () => void,
    onClose?: () => void,
}

export const ParkingModal: React.FC<ParkingModalProps> = ({
    open = true,
    ...props
}: ParkingModalProps) => {

    return (
        <>
            {open &&
                <div 
                    className='h-full w-full bg-black bg-opacity-80 fixed z-500'
                    onClick={props.onClose}
                >
                    <div className='w-11/12 shadow absolute left-[50%] translate-x-[-50%] bottom-[20px]'>
                        <div className='ktext-subtitle rounded bg-white text-main text-center'>
                            <div 
                                className='py-5 border-b border-grey-light' 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.onGoogleClick && props.onGoogleClick();
                                }}
                            >Google Maps</div>
                            <div 
                                className='py-5 border-b border-grey-light' 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.onAppleClick && props.onAppleClick()
                                }}
                            >Apple Maps</div>
                            <div 
                                className='py-5' 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.onShareClick && props.onShareClick()
                                }}
                            >Partager les coordonnées</div>
                        </div>
                        <div className='ktext-subtitle rounded mt-2 py-5 bg-white text-main text-center'>
                            Annuler
                        </div>
                    </div>
                </div>
            }
        </>
    )
}