import { BoulderSlideover, MapControl, MobileHeader } from 'components';
import { markerSize } from 'helpers';
import { fakeTopo } from 'helpers/fakeData/fakeTopo';
import React, { useState } from 'react';
import { Boulder, MarkerProps } from 'types';

export const TopoMobile:React.FC = (props) => {
    const [topo, setTopo] = useState(fakeTopo);
    const [selectedBoulder, setSelectedBoulder] = useState<Boulder>();
    const [selectedTrack, setSelectedTrack] = useState<number>();

    const getMarkersFromBoulders = () => {
        const markers: MarkerProps[] = []
        for (const sector of fakeTopo.sectors) {
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
            <MobileHeader
                title={topo.name}
                menu={[]}
                onBackClick={() => {}}
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
                <BoulderSlideover 
                    topoCreatorId={topo.creatorId}
                    boulder={selectedBoulder}
                    onClose={() => setSelectedBoulder(undefined)}
                />
            }
        </>
    )
}