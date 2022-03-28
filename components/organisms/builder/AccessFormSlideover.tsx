import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { QuarkArray } from 'helpers/quarky';
import { TopoAccess } from 'types';
import { DeviceContext } from 'helpers';
import { AccessForm } from '..';

interface AccessFormSlideoverProps {
    accesses: QuarkArray<TopoAccess>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const AccessFormSlideover: React.FC<AccessFormSlideoverProps> = ({
    open = true,
    ...props
}: AccessFormSlideoverProps) => {
    const device = useContext(DeviceContext);

    return (
        <>
            {device === 'mobile' &&
                <SlideoverMobile
                    open
                    onlyFull
                    initialFull={true}
                    onClose={props.onClose}
                >
                    <div className='px-6 py-10 h-full'>
                        <div className='ktext-title mb-6'>Marche d'approche</div>
                        <AccessForm 
                            access={props.accesses.quarkAt(0)}
                        />
                    </div>
                </SlideoverMobile>
            }
            {device !== 'mobile' && 
                <SlideoverLeftDesktop 
                    title="Marche d'approche"  
                    open={open}
                    className={props.className}
                    onClose={props.onClose}
                >
                    <AccessForm 
                        access={props.accesses?.quarkAt(0)}
                        className='mt-6'
                    />
                </SlideoverLeftDesktop>
            }
        </> 
    )
}