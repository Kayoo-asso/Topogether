import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { Signal } from 'helpers/quarky';
import { Topo } from 'types';
import { DeviceContext } from 'helpers';

interface ManagementSlideoverProps {
    topo: Signal<Topo>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const ManagementSlideover: React.FC<ManagementSlideoverProps> = ({
    open = true,
    ...props
}: ManagementSlideoverProps) => {
    const device = useContext(DeviceContext);
    const topo = props.topo();

    const managementContent = () => (
       <div>TOPO GESTIONNAIRES</div> 
    )

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    initialFull={true}
                    onlyFull
                    onClose={props.onClose}
                >
                    {managementContent()}
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideoverLeftDesktop 
                    title="Gestionnaires du spot"  
                    open={open}
                    onClose={props.onClose}
                    className={props.className}
                >
                    {managementContent()}
                </SlideoverLeftDesktop>
            }
        </> 
    )
}