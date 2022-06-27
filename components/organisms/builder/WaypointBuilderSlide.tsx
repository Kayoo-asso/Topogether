import React, {  } from 'react';
import { SlideagainstRightDesktop, SlideoverMobile } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Waypoint } from 'types';
import { staticUrl, useBreakpoint, useModal } from 'helpers';
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
    const [ModalDelete, showModalDelete] = useModal();
    const breakpoint = useBreakpoint();

    return (
        <>
            {breakpoint === 'mobile' &&
                <SlideoverMobile
                    onClose={props.onClose}
                >
                    <div className='px-6 py-14 h-full'>
                        <WaypointForm 
                            waypoint={props.waypoint}
                            onDeleteWaypoint={showModalDelete}
                        />
                    </div>
                </SlideoverMobile>
            }
            {breakpoint !== 'mobile' && 
                <SlideagainstRightDesktop
                    open
                    onClose={props.onClose}
                >
                    <div className='px-5 py-3 h-full'>
                        <WaypointForm 
                            waypoint={props.waypoint}
                            onDeleteWaypoint={showModalDelete}
                        />
                    </div>
                </SlideagainstRightDesktop>
            }

            <ModalDelete
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={props.onDeleteWaypoint}
            >
                Etes-vous sûr de vouloir supprimer le point de repère ?
            </ModalDelete>
        </>
    )
});

WaypointBuilderSlide.displayName = "WaypointBuilderSlide";