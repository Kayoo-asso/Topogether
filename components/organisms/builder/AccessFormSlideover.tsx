import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { QuarkArray, watchDependencies } from 'helpers/quarky';
import { TopoAccess } from 'types';
import { DeviceContext } from 'helpers';
import { AccessForm } from '..';
import { v4 } from 'uuid';

interface AccessFormSlideoverProps {
    accesses: QuarkArray<TopoAccess>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const AccessFormSlideover: React.FC<AccessFormSlideoverProps> = watchDependencies(({
    open = true,
    ...props
}: AccessFormSlideoverProps) => {
    const device = useContext(DeviceContext);

    return (
        <>
            {device === 'mobile' &&
                <SlideoverMobile
                    onClose={props.onClose}
                >
                    <div className='px-6 mt-10 pb-10 h-full overflow-auto'>
                        <div className='ktext-title mb-6'>Marche d'approche</div>
                        <AccessForm 
                            access={props.accesses.quarkAt(0)}
                            onCreateAccess={() => props.accesses.push({
                                id: v4(),
                                steps: []
                            })}
                            onDeleteAccess={(accessQuark) => props.accesses.removeQuark(accessQuark)}
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
                        onCreateAccess={() => props.accesses.push({
                            id: v4(),
                            steps: []
                        })}
                        onDeleteAccess={(accessQuark) => props.accesses.removeQuark(accessQuark)}
                    />
                </SlideoverLeftDesktop>
            }
        </> 
    )
});