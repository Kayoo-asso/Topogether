import React, { useContext, useState } from 'react';
import { Button, createTrack, Icon } from 'components';
import { UserContext } from 'helpers';
import { Quark, QuarkArray, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Grade, Name, Sector, Track, UUID } from 'types';
import { v4 } from 'uuid';

interface LeftbarBuilderDesktopProps {
    sectors: QuarkArray<Sector>,
    selectedBoulder: SelectQuarkNullable<Boulder>,
    onBoulderSelect: (boulderQuark: Quark<Boulder>) => void,
    onTrackSelect: (trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => void,
    onValidate: () => void,
}

export const LeftbarBuilderDesktop: React.FC<LeftbarBuilderDesktopProps> = watchDependencies((props: LeftbarBuilderDesktopProps) => {
    const { session } = useContext(UserContext);
    const selectedBoulder = props.selectedBoulder();

    const [displayedSectors, setDisplayedSectors] = useState<Array<UUID>>(props.sectors.map(sector => sector.id).toArray());
    const [displayedBoulders, setDisplayedBoulders] = useState<Array<UUID>>([]);

    const getGradeColorClass = (grade: Grade) => {
        const lightGrade = parseInt(grade[0]);
        switch (lightGrade) {
            case 3:
                return 'text-grade-3';
            case 4:
                return 'text-grade-4';
            case 5:
                return 'text-grade-5';
            case 6:
                return 'text-grade-6';
            case 7:
                return 'text-grade-7';
            case 8:
                return 'text-grade-8';
            case 9:
                return 'text-grade-9';
        }
    }

    if (!session) return null;
    return (
        <div className='bg-white border-r border-grey-medium min-w-[280px] w-[280px] h-full hidden md:flex flex-col px-2 py-10 z-500'>
            
            <div className='h-[95%] overflow-y-auto mb-6 px-4'>
                {props.sectors.quarks().map((sectorQuark, index) => {
                    const sector = sectorQuark();
                    const bouldersIter = sector.boulders.quarks();
                    const boulderQuarks = Array.from(bouldersIter);
                    return (
                        <div key={sector.id} className='flex flex-col mb-10'>
                            <div className="ktext-label text-grey-medium">Secteur {index + 1}</div>
                            <div className="ktext-section-title text-main cursor-pointer mb-2 flex flex-row justify-between">
                                {sector.name}
                                <Icon
                                    name='arrow-simple'
                                    SVGClassName={'w-3 h-3 stroke-main stroke-2 ' + (displayedSectors.includes(sector.id) ? 'rotate-90' : '-rotate-90')}
                                    onClick={() => {
                                        const newDS = [...displayedSectors];
                                        if (newDS.includes(sector.id)) newDS.splice(newDS.indexOf(sector.id), 1)
                                        else newDS.push(sector.id);
                                        setDisplayedSectors(newDS);
                                    }}
                                />
                            </div>
                            
                            {displayedSectors.includes(sector.id) &&
                                <div className='flex flex-col gap-1 ml-3'>
                                    {boulderQuarks.map((boulderQuark) => {
                                        const boulder = boulderQuark();
                                        const tracksIter = boulder.tracks.quarks();
                                        const trackQuarks = Array.from(tracksIter);
                                        return (
                                            <React.Fragment key={boulder.id}>
                                                <div className='flex flex-row cursor-pointer text-dark items-center justify-between'>
                                                    <div
                                                        onClick={() => props.onBoulderSelect(boulderQuark)}
                                                    >
                                                        <span className={'mr-2' + (selectedBoulder?.id === boulder.id ? ' font-semibold' : '')}>{boulder.orderIndex + 1}.</span>
                                                        <span className={'ktext-base' + (selectedBoulder?.id === boulder.id ? ' font-semibold' : '')}>{boulder.name}</span>
                                                    </div>
                                                    <Icon
                                                        name='arrow-simple'
                                                        SVGClassName={'w-3 h-3 stroke-dark ' + (displayedBoulders.includes(boulder.id) ? 'rotate-90' : '-rotate-90')}
                                                        onClick={() => {
                                                            const newDB = [...displayedBoulders];
                                                            if (newDB.includes(boulder.id)) newDB.splice(newDB.indexOf(boulder.id), 1)
                                                            else newDB.push(boulder.id);
                                                            setDisplayedBoulders(newDB);
                                                        }}
                                                    />
                                                </div>
                                                
                                                {displayedBoulders.includes(boulder.id) &&
                                                    <div className='flex flex-col ml-4 mb-4'>
                                                        {trackQuarks.map((trackQuark) => {
                                                            const track = trackQuark();
                                                            return (
                                                                <div 
                                                                    key={track.id} 
                                                                    className='flex flex-row cursor-pointer items-baseline'
                                                                    onClick={() => props.onTrackSelect(trackQuark, boulderQuark)}
                                                                >
                                                                    {track.grade &&
                                                                        <div className={'mr-2 ktext-subtitle ' + getGradeColorClass(track.grade)}>{track.grade}</div>
                                                                    }
                                                                    <div className='text-grey-medium'>{track.name}</div>
                                                                </div>
                                                            )
                                                        })}
                                                        <div
                                                            className='text-grey-medium cursor-pointer mt-2'
                                                            onClick={() => createTrack(boulder, session.id)}
                                                        >
                                                            + Nouveau passage
                                                        </div>
                                                    </div>
                                                }
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                    )
                })}
            </div>

            <div className='px-6'>
                <Button
                    content='Nouveau secteur'
                    white
                    onClick={() => {
                        const newSector: Sector = {
                            id: v4(),
                            name: 'Secteur ' + (props.sectors.length + 1) as Name,
                            boulders: new QuarkArray(),
                            waypoints: new QuarkArray()
                        }
                        props.sectors.push(newSector);
                    }}
                />
            </div>
        </div>
    )
});