import { Icon } from 'components/atoms';
import Link from 'next/link';
import React from 'react';
import { LightTopo } from 'types';

interface MapSearchresultsProps {
    topoApiResults: LightTopo[],
    googleApiResults: google.maps.places.AutocompletePrediction[],
    onPlaceSelect: (res: google.maps.places.AutocompletePrediction) => void,
    onClose: () => void,
}

export const MapSearchresults: React.FC<MapSearchresultsProps> = (props: MapSearchresultsProps) => {

    return (
        <div className='absolute h-full w-full bg-white px-7 left-0 top-0 pt-[85px] z-50'>

            {/* TODO: Add closing button */}

            {props.topoApiResults.length > 0 &&
                props.topoApiResults.map((topo) =>
                    <Link href={'/topo/'+topo.id}>
                        <div 
                            key={topo.id}
                            className='flex flex-row gap-4 items-center py-3 text-dark cursor-pointer ktext-base'
                        >
                            <div>
                                <Icon name='waypoint' SVGClassName='w-5 h-5 fill-main' />
                            </div>
                            <div>{topo.name}</div>
                        </div>
                    </Link>
                )
            }

            {props.googleApiResults.length > 0 &&
                <>
                    <div className="text-grey-medium ktext-label uppercase mt-5 mb-2">Lieux</div>
                    {props.googleApiResults.map((res) =>
                        <div 
                            key={res.place_id}
                            className='flex flex-row gap-4 items-center py-3 text-dark cursor-pointer ktext-base'
                            onClick={() => props.onPlaceSelect(res)}
                        >
                            <div>
                                <Icon name='flag' SVGClassName='w-5 h-5 stroke-dark' />
                            </div>
                            <div>{res.description}</div>
                        </div>
                    )}
                </>
            }

        </div>
    )
}