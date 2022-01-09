import React, { useContext } from 'react';
import { Button, Icon } from 'components';
import { UserContext } from 'helpers';
import { Quark, QuarkIter } from 'helpers/quarky';
import { Sector } from 'types';

interface LeftbarBuilderDesktopProps {
    onValidate: () => void,
    sectors: Iterable<Quark<Sector>>,
}

export const LeftbarBuilderDesktop: React.FC<LeftbarBuilderDesktopProps> = (props: LeftbarBuilderDesktopProps) => {
    const { session } = useContext(UserContext);

    const sectors = Array.from(props.sectors);
    
    if (!session) return null;
    return (
        <div className='bg-white border-r border-grey-medium w-[300px] h-full hidden md:flex flex-col px-8 py-10 z-100'>
            
            {sectors.map((sectorQuark, index) => {
                const sector = sectorQuark();
                const boulders = sector.boulders.quarks();
                return (
                    <div className='flex flex-col'>
                        <div className="ktext-label text-grey-medium">Secteur {index}</div>
                        <div className="ktext-section-title text-main">{sector.name}</div>

                        <div className='flex flex-col pl-3'>
                            {boulders.map((boulderQuark) => {
                                const boulder = boulderQuark();
                                const tracks = boulder.tracks.quarks();
                                return (
                                    <>
                                        <div className='flex flex-row cursor-pointer text-dark'>
                                            <div className='basis-1/8'>{boulder.orderIndex}</div>
                                            <div className='basis-6/8'>{boulder.name}</div>
                                            <div className='basis-1/8'>
                                                <Icon 
                                                    name='arrow-simple'
                                                />
                                            </div>
                                        </div>

                                        <div className='flex flex-col pl-3'>
                                            {tracks.map((trackQuark) => {
                                                const track = trackQuark();
                                                return (
                                                    <div className='flex flex-row cursor-pointer'>
                                                        <div className='basis-1/4'>{track.grade}</div>
                                                        <div className='basis-3/4'>{track.name}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                )
            })}

            <Button 
                content='Valider le topo'
                onClick={props.onValidate}
            />
        </div>
    )
}