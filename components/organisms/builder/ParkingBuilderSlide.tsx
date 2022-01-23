import React, { useContext, useState } from 'react';
import { ModalDelete, SlideagainstRightDesktop, SlideoverMobile } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Parking } from 'types';
import { DeviceContext } from 'helpers';
import { ParkingForm } from '..';

interface ParkingBuilderSlideProps {
    open: boolean,
    parking: Quark<Parking>,
    onDeleteParking: () => void,
    onClose?: () => void,
}

export const ParkingBuilderSlide: React.FC<ParkingBuilderSlideProps> = watchDependencies(({
    open = true,
    ...props
  }: ParkingBuilderSlideProps) => {
    const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
    const device = useContext(DeviceContext);

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    initialFull={true}
                    onlyFull
                    onClose={props.onClose}
                >
                    <div className='px-6 py-14 h-full'>
                        <ParkingForm 
                            parking={props.parking}
                            onDeleteParking={props.onDeleteParking}
                        />
                    </div>
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideagainstRightDesktop
                    open
                    onClose={props.onClose}
                >
                    <div className='px-5 py-3 h-full'>
                        <ParkingForm 
                            parking={props.parking}
                            onDeleteParking={() => setDisplayDeleteModal(true)}
                        />
                    </div>
                </SlideagainstRightDesktop>
            }

            {displayDeleteModal &&
                <ModalDelete
                    onClose={() => setDisplayDeleteModal(false)}
                    onDelete={() => props.onDeleteParking()}
                >
                    Etes-vous sûr de vouloir supprimer le parking ?
                </ModalDelete>
            }
        </>
    )
});