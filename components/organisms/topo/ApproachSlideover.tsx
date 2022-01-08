import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { Signal } from 'helpers/quarky';
import { Topo } from 'types';
import { DeviceContext } from 'helpers';

interface ApproachSlideoverProps {
    topo: Signal<Topo>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const ApproachSlideover: React.FC<ApproachSlideoverProps> = ({
    open = true,
    ...props
}: ApproachSlideoverProps) => {
    const device = useContext(DeviceContext);
    const topo = props.topo();

    const approachContent = () => (
       <div>TOPO APPROCHE</div> 
    )

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    initialFull={true}
                >
                    {approachContent()}
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideoverLeftDesktop 
                    title="Marche d'approche"  
                    open={open}
                    onClose={props.onClose}
                    className={props.className}
                >
                    {approachContent()}
                </SlideoverLeftDesktop>
            }
        </> 
    )
}