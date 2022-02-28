import React, { useContext, useState } from 'react';
import { ModalDelete, SlideagainstRightDesktop, SlideoverMobile } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Waypoint } from 'types';
import { DeviceContext } from 'helpers';
import { WaypointForm } from '..';

interface WaypointBuilderSlideProps {
    open: boolean,
    waypoint: Quark<Waypoint>,
    onDeleteWaypoint: () => void,
    onClose?: () => void,
}

export const WaypointBuilderSlide: React.FC<WaypointBuilderSlideProps> = watchDependencies(({
    open = true,
    ...props
  }: WaypointBuilderSlideProps) => {
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
                        <WaypointForm 
                            waypoint={props.waypoint}
                            onDeleteWaypoint={() => setDisplayDeleteModal(true)}
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
                        <WaypointForm 
                            waypoint={props.waypoint}
                            onDeleteWaypoint={() => setDisplayDeleteModal(true)}
                        />
                    </div>
                </SlideagainstRightDesktop>
            }

            {displayDeleteModal &&
                <ModalDelete
                    onClose={() => setDisplayDeleteModal(false)}
                    onDelete={() => props.onDeleteWaypoint()}
                >
                    Etes-vous sûr de vouloir supprimer le point de repère ?
                </ModalDelete>
            }
        </>
    )
});

WaypointBuilderSlide.displayName = "WaypointBuilderSlide";