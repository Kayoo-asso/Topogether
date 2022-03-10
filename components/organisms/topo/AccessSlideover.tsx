import React, { useContext, useState } from 'react';
import { SlideoverLeftDesktop, SlideoverMobile, TabOption, Tabs } from 'components';
import { QuarkArray } from 'helpers/quarky';
import { Difficulty, TopoAccess } from 'types';
import { DeviceContext } from 'helpers';
import { default as NextImage } from 'next/image';
import { DifficultyName } from 'types/EnumNames';

interface AccessSlideoverProps {
    accesses: QuarkArray<TopoAccess>,
    open?: boolean,
    className?: string,
    onClose: () => void,
}

export const AccessSlideover: React.FC<AccessSlideoverProps> = ({
    open = true,
    ...props
}: AccessSlideoverProps) => {
    const device = useContext(DeviceContext);
    const [accessTab, setAccessTab] = useState(0);
    const access = props.accesses ? props.accesses.toArray()[accessTab] : undefined;

    const getTabOptions = (): TabOption[] => {
        const tabs: TabOption[] = [];
        props.accesses.toArray().map((access, index: number) => {
            tabs.push({ label: 'marche '+index, color: 'main', action: () => setAccessTab(index)})
        })
        return tabs;
    }

    const approachContent = () => {
        if (!access) return (
            <div className='flex flex-col h-full pt-5 md:pt-0'>
                <div className='flex flex-col px-6 md:px-0 pt-5 md:pt-0'>
                    <div className='ktext-big-title text-center w-full mt-4 mb-6 md:mb-3'>
                        Aucune marche d'approche référencée
                    </div>
                </div>
            </div>
        )
        else return (
            <div className='flex flex-col h-full pt-5 md:pt-0'>
                <div className='flex flex-col px-6 md:px-0 pt-5 md:pt-0'>
                    <div className='ktext-big-title text-center w-full mt-4 mb-6 md:hidden'>{"Marche"+(props.accesses.length > 1 ? "s" : "")+" d'approche"}</div>

                    {props.accesses.length > 1 &&
                        <Tabs 
                            tabs={getTabOptions()}
                            className='pt-2 md:pt-8 pb-6'
                        />
                    }
                    <div className='flex flex-row justify-between md:flex-col'>
                        {access.difficulty && <div><span className='font-semibold'>Difficulté : </span>{DifficultyName[access.difficulty]}</div>}
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
                            {step.imagePath &&
                                <div className="w-auto relative mt-2 h-[200px]">
                                    <NextImage
                                        src={step.imagePath}
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
        );
    }

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
                    title={"Marche"+(props.accesses.length > 1 ? "s" : "")+" d'approche"}
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