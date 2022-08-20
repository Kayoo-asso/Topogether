import React, { Dispatch, SetStateAction } from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Topo, UUID } from 'types';
import { For } from 'components/atoms';
import { BoulderFilterOptions, BoulderMarker, ClusterProvider, filterBoulders, ParkingMarker, SectorAreaMarker, WaypointMarker } from 'components/map';
import { InteractItem, useSelectStore } from 'components/pages/selectStore';

interface TopoMarkersProps {
    topoQuark: Quark<Topo>,
    boulderFilters: Quark<BoulderFilterOptions>,
    boulderOrder: Map<UUID, number>,
}

export const TopoMarkers: React.FC<TopoMarkersProps> = watchDependencies(
    (props: TopoMarkersProps) => {
    const topo = props.topoQuark();
    const select = useSelectStore(s => s.select);
    const selectedItem = useSelectStore(s => s.item);
   
    return (
        <>
            <ClusterProvider>
                <For each={() => filterBoulders(topo.boulders.quarks(), props.boulderFilters())}>
                    {(boulder) => (
                        <BoulderMarker
                            key={boulder().id}
                            boulder={boulder}
                            boulderOrder={props.boulderOrder}
                            selectedBoulder={selectedItem.type === 'boulder' ? selectedItem.value : undefined}
                            topo={props.topoQuark}
                            onClick={(boulderQuark) => select.boulder(boulderQuark)}
                        />
                    )}
                </For>
            </ClusterProvider>
            <For each={() => topo.sectors.quarks().toArray()}>
                {(sector) => (
                    <SectorAreaMarker
                        key={sector().id}
                        sector={sector}
                        // selected={props.selectedItem.type === 'sector' && props.selectedItem.value === sector}
                        // onClick={toggleSectorSelect}
                    />
                )}
            </For>
            <For each={() => topo.waypoints.quarks().toArray()}>
                {(waypoint) => (
                    <WaypointMarker
                        key={waypoint().id}
                        waypoint={waypoint}
                        selected={selectedItem.type === 'waypoint' && selectedItem.value === waypoint}
                        onClick={(waypointQuark) => select.waypoint(waypointQuark)}
                    />
                )}
            </For>
            <For each={() => topo.parkings.quarks().toArray()}>
                {(parking) => (
                    <ParkingMarker
                        key={parking().id}
                        parking={parking}
                        selected={selectedItem.type === 'parking' && selectedItem.value === parking}
                        onClick={(parkingQuark) => select.parking(parkingQuark) }
                    />
                )}
            </For>
        </>
    )
})

TopoMarkers.displayName = "BuilderMarkers";