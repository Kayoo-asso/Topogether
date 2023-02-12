import React from "react";
import { GeocodingFeature } from "helpers/map/geocodingMapbox";
import { LightTopo } from "types";
import { Map } from "ol";
import Link from "next/link";
import { encodeUUID } from "helpers/utils";
import { useSelectStore } from "components/pages/selectStore";
import { fromLonLat } from "ol/proj";

import MarkerIcon from "assets/icons/marker.svg";
import Flag from "assets/icons/flag.svg";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";

export interface SearchbarToposProps {
	topoApiResults: LightTopo[];
	mapboxApiResults: GeocodingFeature[];
    map: Map | null;
}

export const SearchbarToposResults: React.FC<SearchbarToposProps> = (props: SearchbarToposProps) => {
    {/* TODO: Add closing button */}
    {/* TODO: Add "Résultats récents" */}
    const bp = useBreakpoint();
	const select = useSelectStore(s => s.select);

	const selectPlace = (place: GeocodingFeature) => {
		props.map?.getView().animate({
            center: fromLonLat(place.center),
            duration: 300,
            zoom: 13
        });
		select.info('NONE', bp);
	};

    return (
        <div className='flex flex-col px-4'>
            {props.topoApiResults.length > 0 &&
                <>
                    <div className='ktext-section-title py-4'>Liste des topos</div>
                    {props.topoApiResults.map((topo) => (
                        <Link href={"/topo/" + encodeUUID(topo.id)} key={topo.id}>
                            <a 
                                className={`ktext-base flex flex-row items-center gap-4 py-3 px-7 text-dark md:cursor-pointer hover:bg-grey-light`}
                                onClick={() => select.info('NONE', bp)}
                            >
                                <MarkerIcon className="h-5 w-5 fill-main" />
                                <div>{topo.name}</div>
                            </a>
                        </Link>
                    ))}
                </>
            }
            {props.mapboxApiResults.length > 0 &&
                <>
                    <div className='ktext-section-title py-4'>Lieux</div>
                    {props.mapboxApiResults.map((res) => (
                        <div
                            key={res.place_name}
                            className={`ktext-base flex flex-row items-center gap-4 py-3 px-7 text-dark md:cursor-pointer hover:bg-grey-light`}
                            onClick={() => selectPlace(res)}
                        >
                            <Flag className="h-5 w-5 stroke-dark" />
                            <div>{res.text}</div>
                        </div>
                    ))}
                </>
            }
        </div>
    )
};

SearchbarToposResults.displayName = 'SearchbarToposResults';