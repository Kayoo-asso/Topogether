import React, { useContext } from 'react';
import { SlideagainstRightDesktop, SlideoverMobile } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Parking } from 'types';
import { BreakpointContext, staticUrl, useModal } from 'helpers';
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
    const [ModalDelete, showModalDelete] = useModal();
    const device = useContext(BreakpointContext);

    return (
        <>
            {device === 'mobile' &&
                <SlideoverMobile
                    onClose={props.onClose}
                >
                    <div className='px-6 py-14 h-full'>
                        <ParkingForm 
                            parking={props.parking}
                            onDeleteParking={showModalDelete}
                        />
                    </div>
                </SlideoverMobile>
            }
            {device !== 'mobile' && 
                <SlideagainstRightDesktop
                    open
                    onClose={props.onClose}
                >
                    <div className='px-5 py-3 h-full'>
                        <ParkingForm 
                            parking={props.parking}
                            onDeleteParking={showModalDelete}
                        />
                    </div>
                </SlideagainstRightDesktop>
            }

            <ModalDelete
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={props.onDeleteParking} 
            >
                Etes-vous sûr de vouloir supprimer le parking ?
            </ModalDelete>
        </>
    )
});

ParkingBuilderSlide.displayName = "ParkingBuilderSlide";