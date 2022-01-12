import React, { useContext } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { Signal } from 'helpers/quarky';
import { Topo } from 'types';
import { DeviceContext } from 'helpers';
import { default as NextImage } from 'next/image';

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
    const access = topo.access ? topo.access.toArray()[0] : undefined;

    const approachContent = () => {
        if (!access) return (
            <div>Aucune marche d'approche référencée</div>
        )
        else return (
        <div className='flex flex-col h-full pt-5 md:pt-0'>
            <div className='flex flex-col px-6 md:px-0 pt-5 md:pt-0'>
                <div className='ktext-big-title text-center w-full mt-4 mb-6 md:mb-3'>Marche d'approche</div>

                <div className='flex flex-row justify-between md:flex-col'>
                    {access.difficulty && <div><span className='font-semibold'>Difficulté : </span>{access.difficulty}</div>}
                    {access.duration && <div><span className='font-semibold'>Durée : </span>{access.duration}min</div>}
                </div>
            </div>

            <div className='flex flex-col px-6 md:px-0 mt-6 overflow-auto'>
                {access.steps?.map((step, index) => (
                    <div key={index} className='mb-6'>
                        {access.steps && access.steps.length > 1 && 
                            <div className='font-semibold'>Etape {index+1}</div>
                        }
                        <div>{step.description}</div>
                        {step.image &&
                            <div className="w-auto relative mt-2 h-[200px]">
                                <NextImage
                                    src={step.image.url}
                                    className="rounded-lg"
                                    alt={"Marche d'approche étape "+index}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )};

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    initialFull={true}
                    onlyFull
                    onClose={props.onClose}
                >
                    {approachContent()}
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideoverLeftDesktop 
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