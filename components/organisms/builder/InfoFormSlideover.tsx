import React from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { Quark } from 'helpers/quarky';
import { Topo } from 'types';
import { useBreakpoint } from 'helpers';
import { InfoForm } from '..';

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
    const breakpoint = useBreakpoint();

    return (
        <>
            {breakpoint === 'mobile' &&
                <SlideoverMobile
                    onClose={props.onClose}
                >
                    <div className='px-6 py-10 h-full'>
                        <div className='ktext-title mb-6'>Infos du spot</div>
                        <InfoForm 
                            topo={props.topo}
                        />
                    </div>
                </SlideoverMobile>
            }
            {breakpoint !== 'mobile' && 
                <SlideoverLeftDesktop 
                    title="Infos du spot"  
                    className={props.className}
                    open={open}
                    onClose={props.onClose}
                >
                    <InfoForm 
                        topo={props.topo}
                    />
                </SlideoverLeftDesktop>
            }
        </> 
    )
}