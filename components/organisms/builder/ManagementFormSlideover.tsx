import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { QuarkArray, watchDependencies } from 'helpers/quarky';
import { Manager, Name } from 'types';
import { DeviceContext } from 'helpers';
import { ManagementForm } from '..';
import { v4 } from 'uuid';

interface ManagementFormSlideoverProps {
    managers: QuarkArray<Manager>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const ManagementFormSlideover: React.FC<ManagementFormSlideoverProps> = watchDependencies(({
    open = true,
    ...props
}: ManagementFormSlideoverProps) => {
    const device = useContext(DeviceContext);

    return (
        <>
            {device === 'mobile' &&
                <SlideoverMobile
                    onClose={props.onClose}
                >
                    <div className='px-6 mt-10 pb-10 h-full overflow-auto'>
                        <div className='ktext-title mb-6'>Gestionnaire du spot</div>
                        <ManagementForm 
                            manager={props.managers.quarkAt(0)}
                            onCreateManager={() => props.managers.push({
                                id: v4(),
                                name: '' as Name,
                                contactName: '' as Name,
                            })}
                            onDeleteManager={(managerQuark) => props.managers.removeQuark(managerQuark)}
                        />
                    </div>
                </SlideoverMobile>
            }
            {device !== 'mobile' && 
                <SlideoverLeftDesktop 
                    title="Gestionnaires du spot" 
                    className={props.className} 
                    open={open}
                    onClose={props.onClose}
                >
                    <ManagementForm 
                        manager={props.managers.quarkAt(0)}
                        onCreateManager={() => props.managers.push({
                            id: v4(),
                            name: '' as Name,
                            contactName: '' as Name,
                        })}
                        onDeleteManager={(managerQuark) => props.managers.removeQuark(managerQuark)}
                    />
                </SlideoverLeftDesktop>
            }
        </> 
    )
});