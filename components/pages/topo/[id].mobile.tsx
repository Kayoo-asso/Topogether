import { BoulderSlideoverMobile, MapControl, HeaderMobile, For, BoulderMarker } from 'components';
import { markerSize } from 'helpers';
import React, { useMemo, useState } from 'react';
import { Boulder, MarkerProps, Topo, Track } from 'types';
import { Signal, reactKey, Quark } from 'helpers/quarky';

interface TopoMobileProps {
    topo: Signal<Topo>,
}

export const TopoMobile: React.FC<TopoMobileProps> = (props: TopoMobileProps) => {
    const [selectedBoulder, setSelectedBoulder] = useState<Quark<Boulder>>();
    const [selectedTrack, setSelectedTrack] = useState<Quark<Track>>();

    const [displayInfo, setDisplayInfo] = useState<boolean>(false);
    const [displayApproach, setDisplayApproach] = useState<boolean>(false);
    const [displayManagement, setDisplayManagement] = useState<boolean>(false);

    const topo = props.topo();
    const boulders = useMemo(() => topo.sectors
        .lazy()
        .map(x => x.boulders.quarks())
        .flatten()
        , [topo.sectors]);

    return (
        <>
            <HeaderMobile
                title={props.topo.name}
                backLink='/'
                menuOptions={[
                    { value: 'Infos du topo', action: () => setDisplayInfo(true) },
                    { value: 'Marche d\'approche', action: () => setDisplayApproach(true) },
                    { value: 'Gestionnaires du site', action: () => setDisplayManagement(true) },
                ]}
            />

            <MapControl
                initialZoom={5}
                displayPhotoButton={false}
                boundsToMarkers={true}
                searchbarOptions={{
                    findTopos: false,
                    findPlaces: false,
                }}
            >
                <For each={boulders.toArray}>
                    {(boulder) =>
                        <BoulderMarker
                            key={reactKey(boulder)}
                            boulder={boulder}
                            onClick={setSelectedBoulder}
                        />
                    }
                </For>
            </MapControl>

            {selectedBoulder &&
                <BoulderSlideoverMobile
                    topoCreatorId={props.topo().creatorId}
                    boulder={selectedBoulder}
                    selectedTrack={selectedTrack}
                    onSelectTrack={setSelectedTrack}
                    onClose={() => setSelectedBoulder(undefined)}
                />
            }
        </>
    )
}