import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { QuarkArray } from 'helpers/quarky';
import { Manager } from 'types';
import { DeviceContext } from 'helpers';
import { ManagementForm } from '..';

interface ManagementFormSlideoverProps {
    managers: QuarkArray<Manager>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const ManagementFormSlideover: React.FC<ManagementFormSlideoverProps> = ({
    open = true,
    ...props
}: ManagementFormSlideoverProps) => {
    const device = useContext(DeviceContext);

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    onlyFull
                    initialFull={true}
                >
                    <div className='px-6 py-10 h-full'>
                        <div className='ktext-title mb-6'>Gestionnaire du spot</div>
                        <ManagementForm 
                            manager={props.managers.quarkAt(0)}
                        />
                    </div>
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideoverLeftDesktop 
                    title="Gestionnaires du spot"  
                    open={open}
                    onClose={props.onClose}
                    className={props.className}
                >
                    <ManagementForm 
                        manager={props.managers.quarkAt(0)}
                        className='mt-6'
                    />
                </SlideoverLeftDesktop>
            }
        </> 
    )
}