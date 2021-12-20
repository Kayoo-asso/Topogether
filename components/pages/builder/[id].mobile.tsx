import { MapControl, MobileHeader } from 'components';
import { markerSize } from 'helpers';
import React, { useCallback, useState } from 'react';
import { Boulder, GeoCoordinates, MarkerProps, Topo } from 'types';

interface BuilderMapMobileProps {
    topo: Topo,
    crud: any,
}

export const BuilderMapMobile:React.FC<BuilderMapMobileProps> = (props: BuilderMapMobileProps) => {
    const [selectedBoulder, setSelectedBoulder] = useState<Boulder>();

    const getMarkersFromBoulders = () => {
        const markers: MarkerProps[] = []
        for (let i = 0; i< props.topo.sectors.length; i++) {
            if (props.topo.sectors[i].boulders) {
                const sector = props.topo.sectors[i];
                for (let j = 0; j< sector.boulders.length; j++) {
                    const boulder = sector.boulders[j];
                    markers.push({
                        id: boulder.id,
                        options: {
                            icon: {
                                url: '/assets/icons/colored/_rock.svg',
                                scaledSize: markerSize(30)
                            },
                            position: boulder.location,
                            draggable: true,
                        },
                        handlers: {
                            onClick: () => setSelectedBoulder(boulder),
                            onDragEnd: useCallback((e) => {
                                console.log("foo");
                                if (e.latLng) {
                                    const newCoords: GeoCoordinates = {
                                        lat: e.latLng.lat(),
                                        lng: e.latLng.lng(),
                                    }
                                    props.crud.boulder.update(i, j, "location", newCoords);
                                }
                            }, [])
                        }
                    })
                }
            }
        }
        return markers;
    }

    return (
        <>
            <MobileHeader
                title={props.topo.name}
                menu={[]}
                backLink={'/builder/dashboard'}
            />

            <MapControl 
                initialZoom={5}
                markers={getMarkersFromBoulders()}
                boundsToMarkers={true}
                searchbarOptions={{
                    findTopos: false,
                    findPlaces: false,
                }}
            />
        </>
    )
}