import { BoulderSlideoverMobile, MapControl, HeaderMobile } from 'components';
import { markerSize } from 'helpers';
import React, { useState } from 'react';
import { BoulderData, MarkerProps, TopoData } from 'types';

interface TopoMobileProps {
    topo: TopoData,
}

export const TopoMobile: React.FC<TopoMobileProps> = (props: TopoMobileProps) => {
    const [selectedBoulder, setSelectedBoulder] = useState<BoulderData>();
    const [selectedTrack, setSelectedTrack] = useState<number>();

    const [displayInfo, setDisplayInfo] = useState<boolean>(false);
    const [displayApproach, setDisplayApproach] = useState<boolean>(false);
    const [displayManagement, setDisplayManagement] = useState<boolean>(false);

    const getMarkersFromBoulders = () => {
        const markers: MarkerProps[] = []
        for (const sector of props.topo.sectors) {
            if (sector.boulders) {
                for (const boulder of sector.boulders) {
                    markers.push({
                        id: boulder.id,
                        options: {
                            icon: {
                                url: '/assets/icons/colored/_rock.svg',
                                scaledSize: markerSize(30)
                            },
                            position: boulder.location,
                        },
                        handlers: {
                            onClick: () => setSelectedBoulder(boulder),
                        }
                    })
                }
            }
        }
        return markers;
    }

    return (
        <>
            <HeaderMobile
                title={props.topo.name}
                backLink='/'
                menuOptions={[
                    { value: 'Infos du topo', action: () => setDisplayInfo(true)},
                    { value: 'Marche d\'approche', action: () => setDisplayApproach(true)},
                    { value: 'Gestionnaires du site', action: () => setDisplayManagement(true)},
                ]}
            />

            <MapControl 
                initialZoom={5}
                displayPhotoButton={false}
                markers={getMarkersFromBoulders()}
                boundsToMarkers={true}
                searchbarOptions={{
                    findTopos: false,
                    findPlaces: false,
                }}
            />

            {selectedBoulder &&
                <BoulderSlideoverMobile 
                    topoCreatorId={props.topo.creatorId}
                    boulder={selectedBoulder}
                    onClose={() => setSelectedBoulder(undefined)}
                />
            }
        </>
    )
}