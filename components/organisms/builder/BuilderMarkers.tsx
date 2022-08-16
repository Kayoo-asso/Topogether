import React, { Dispatch, SetStateAction } from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Topo, UUID } from 'types';
import { InteractItem, SelectedItem } from 'types/SelectedItems';
import { For } from 'components/atoms';
import { BoulderFilterOptions, BoulderMarker, filterBoulders, ParkingMarker, SectorAreaMarker, WaypointMarker } from 'components/map';

interface BuilderMarkersProps {
    topoQuark: Quark<Topo>,
    boulderFilters: Quark<BoulderFilterOptions>,
    boulderOrder: Map<UUID, number>,
    selectedItem: SelectedItem,
    setSelectedItem: Dispatch<SetStateAction<SelectedItem>>,
    setDropdownItem: Dispatch<SetStateAction<InteractItem>>,
    setDropdownPosition: 
}

export const BuilderMarkers: React.FC<BuilderMarkersProps> = watchDependencies(
    (props: BuilderMarkersProps) => {
    const topo = props.topoQuark();
    const sectors = topo.sectors;
    const boulders = topo.boulders;
    const parkings = topo.parkings;
    const waypoints = topo.waypoints;

    const setDropdown = () => {

    }
   
    return (
        <>
            <For each={() => filterBoulders(boulders.quarks(), props.boulderFilters())}>
                {(boulder) => (
                    <BoulderMarker
                        key={boulder().id}
                        boulder={boulder}
                        boulderOrder={props.boulderOrder}
                        selectedBoulder={selectedBoulder}
                        topo={props.topoQuark}
                        onClick={(boulderQuark) => props.setSelectedItem({ type: 'boulder', value: boulderQuark })}
                        onContextMenu={displayBoulderDropdown}
                        draggable={selectedBoulder.quark() === boulder}
                    />
                )}
            </For>
            <For each={() => sectors.quarks().toArray()}>
                {(sector) => (
                    <SectorAreaMarker
                        key={sector().id}
                        sector={sector}
                        selected={selectedSector.quark() === sector}
                        // TODO: improve the callbacks
                        // TODO: how to avoid problems with the mousemove event not reaching the map while creating a sector?

                        // Avoid the sector area intercepting clicks if another tool is selected
                        onClick={toggleSectorSelect}
                        onContextMenu={displaySectorDropdown}
                        onDragStart={() => selectedSector.select(sector)}
                        onDragEnd={() =>
                            sectorChanged(props.topoQuark, sector().id, boulderOrder())
                        }
                    />
                )}
            </For>
            <For each={() => waypoints.quarks().toArray()}>
                {(waypoint) => (
                    <WaypointMarker
                        key={waypoint().id}
                        waypoint={waypoint}
                        selected={selectedWaypoint.quark() === waypoint}
                        onClick={toggleWaypointSelect}
                        onContextMenu={displayWaypointDropdown}
                        draggable
                    />
                )}
            </For>
            <For each={() => parkings.quarks().toArray()}>
                {(parking) => (
                    <ParkingMarker
                        key={parking().id}
                        parking={parking}
                        selected={selectedParking.quark() === parking}
                        onClick={toggleParkingSelect}
                        onContextMenu={displayParkingDropdown}
                        draggable
                    />
                )}
            </For>
        </>
    )
})

BuilderMarkers.displayName = "BuilderMarkers";