import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { Quark } from 'helpers/quarky';
import { Topo } from 'types';
import { DeviceContext } from 'helpers';

interface ApproachFormSlideoverProps {
    topo: Quark<Topo>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const ApproachFormSlideover: React.FC<ApproachFormSlideoverProps> = ({
    open = true,
    ...props
}: ApproachFormSlideoverProps) => {
    const device = useContext(DeviceContext);
    const topo = props.topo();

    const approachForm = () => (
       <div>TOPO APPROCHE FORM</div> 
    )

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    initialFull={true}
                >
                    {approachForm()}
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideoverLeftDesktop 
                    title="Marche d'approche"  
                    open={open}
                    onClose={props.onClose}
                    className={props.className}
                >
                    {approachForm()}
                </SlideoverLeftDesktop>
            }
        </> 
    )
}