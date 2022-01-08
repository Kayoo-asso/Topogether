import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { Quark } from 'helpers/quarky';
import { Topo } from 'types';
import { DeviceContext } from 'helpers';

interface ManagementFormSlideoverProps {
    topo: Quark<Topo>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const ManagementFormSlideover: React.FC<ManagementFormSlideoverProps> = ({
    open = true,
    ...props
}: ManagementFormSlideoverProps) => {
    const device = useContext(DeviceContext);
    const topo = props.topo();

    const managementForm = () => (
       <div>TOPO MANAGEMENT FORM</div> 
    )

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    initialFull={true}
                >
                    {managementForm()}
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideoverLeftDesktop 
                    title="Gestionnaires du spot"  
                    open={open}
                    onClose={props.onClose}
                    className={props.className}
                >
                    {managementForm()}
                </SlideoverLeftDesktop>
            }
        </> 
    )
}