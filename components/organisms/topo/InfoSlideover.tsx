import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { Signal } from 'helpers/quarky';
import { Topo } from 'types';
import { DeviceContext } from 'helpers';

interface InfoSlideoverProps {
    topo: Signal<Topo>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const InfoSlideover: React.FC<InfoSlideoverProps> = ({
    open = true,
    ...props
}: InfoSlideoverProps) => {
    const device = useContext(DeviceContext);
    const topo = props.topo();

    const infosContent = () => (
       <div>TOPO APPROCHE</div> 
    )

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    initialFull={true}
                >
                    {infosContent()}
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideoverLeftDesktop 
                    title="Infos du spot"  
                    open={open}
                    onClose={props.onClose}
                    className={props.className}
                >
                    {infosContent()}
                </SlideoverLeftDesktop>
            }
        </> 
    )
}