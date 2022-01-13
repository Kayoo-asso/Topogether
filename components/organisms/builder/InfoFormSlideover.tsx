import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { Quark } from 'helpers/quarky';
import { Topo } from 'types';
import { DeviceContext } from 'helpers';

interface InfoFormSlideoverProps {
    topo: Quark<Topo>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const InfoFormSlideover: React.FC<InfoFormSlideoverProps> = ({
    open = true,
    ...props
}: InfoFormSlideoverProps) => {
    const device = useContext(DeviceContext);
    const topo = props.topo();

    const infosForm = () => (
       <div>TOPO INFOS FORM</div> 
    )

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    initialFull={true}
                    onlyFull
                >
                    {infosForm()}
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideoverLeftDesktop 
                    title="Infos du spot"  
                    open={open}
                    onClose={props.onClose}
                    className={props.className}
                >
                    {infosForm()}
                </SlideoverLeftDesktop>
            }
        </> 
    )
}