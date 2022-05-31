import { encodeUUID, useLoader } from 'helpers';
import Link from 'next/link';
import React from 'react';
import { Boulder, LightTopo } from 'types';
import Rock from 'assets/icons/rock.svg';
import Flag from 'assets/icons/flag.svg';
import WaypointIcon from 'assets/icons/waypoint.svg';

interface MapSearchResultsProps {
    topoApiResults: LightTopo[],
    googleApiResults: google.maps.places.AutocompletePrediction[],
    boulderResults: Boulder[],
    onPlaceSelect: (place: google.maps.places.AutocompletePrediction) => void,
    onBoulderSelect: (boulder: Boulder) => void,
    onClose: () => void,
}

export const MapSearchResults: React.FC<MapSearchResultsProps> = (props: MapSearchResultsProps) => {
    const [Loader, showLoader] = useLoader();

    return (
        <div className='absolute w-[94%] md:w-[97%] shadow rounded-lg bg-white px-7 left-0 top-0 pt-[55px] pb-3 z-50'>

            {/* TODO: Add closing button */}
            {/* TODO: Add "Résultats récents" */}

            {props.topoApiResults.length > 0 &&
                props.topoApiResults.map((topo) =>
                    <Link href={'/topo/' + encodeUUID(topo.id)} key={topo.id}>
                        <a className='flex flex-row gap-4 items-center py-3 text-dark cursor-pointer ktext-base' onClick={showLoader}>
                            <WaypointIcon className='w-5 h-5 fill-main' />
                            <div>{topo.name}</div>
                        </a>
                    </Link>
                )
            }

            {props.boulderResults.length > 0 &&
                props.boulderResults.map((boulder) =>
                    <div
                        key={boulder.id}
                        className='flex flex-row gap-4 items-center py-3 text-dark cursor-pointer ktext-base'
                        onClick={() => props.onBoulderSelect(boulder)}
                    >
                        <Rock className='w-5 h-5 stroke-main' />
                        <div>{boulder.name}</div>
                    </div>
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
                            <Flag className='w-5 h-5 stroke-dark' />
                            <div>{res.description}</div>
                        </div>
                    )}
                </>
            }
            <Loader />
        </div>
    )
}