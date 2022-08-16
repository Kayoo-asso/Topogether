import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Topo, UUID } from 'types';
import { InteractItem, selectBoulder, SelectedItem } from 'types/SelectedItems';
import { For } from 'components/atoms';
import { BoulderFilterOptions, BoulderMarker, filterBoulders, isMouseEvent, isPointerEvent, isTouchEvent, ParkingMarker, SectorAreaMarker, WaypointMarker } from 'components/map';
import { sectorChanged } from 'helpers/builder';

interface BuilderMarkersProps {
    topoQuark: Quark<Topo>,
    boulderFilters: Quark<BoulderFilterOptions>,
    boulderOrder: Map<UUID, number>,
    selectedItem: SelectedItem,
    setSelectedItem: Dispatch<SetStateAction<SelectedItem>>,
    setDropdownItem: Dispatch<SetStateAction<InteractItem>>,
    setDropdownPosition: React.Dispatch<React.SetStateAction<{
        x: number;
        y: number;
    } | undefined>>
}

export const BuilderMarkers: React.FC<BuilderMarkersProps> = watchDependencies(
    (props: BuilderMarkersProps) => {
    const topo = props.topoQuark();
    const sectors = topo.sectors;
    const boulders = topo.boulders;
    const parkings = topo.parkings;
    const waypoints = topo.waypoints;

    const setDropdown = (e: Event, item: InteractItem) => {
        if (isMouseEvent(e) || isPointerEvent(e))
				props.setDropdownPosition({ x: e.pageX, y: e.pageY });
        else if (isTouchEvent(e))
            props.setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
        props.setDropdownItem(item);
    }
   
    return (
        <>
            <For each={() => filterBoulders(boulders.quarks(), props.boulderFilters())}>
                {(boulder) => (
                    <BoulderMarker
                        key={boulder().id}
                        boulder={boulder}
                        boulderOrder={props.boulderOrder}
                        selectedItem={props.selectedItem}
                        topo={props.topoQuark}
                        onClick={(boulderQuark) => selectBoulder(boulderQuark, props.setSelectedItem)}
                        onContextMenu={(e, b) => setDropdown(e, { type: 'boulder', value: b })}
                        draggable={props.selectedItem.type === 'boulder' && props.selectedItem.value === boulder}
                    />
                )}
            </For>
            <For each={() => sectors.quarks().toArray()}>
                {(sector) => (
                    <SectorAreaMarker
                        key={sector().id}
                        sector={sector}
                        // selected={props.selectedItem.type === 'sector' && props.selectedItem.value === sector}
                        // TODO: improve the callbacks
                        // TODO: how to avoid problems with the mousemove event not reaching the map while creating a sector?

                        // Avoid the sector area intercepting clicks if another tool is selected
                        // onClick={toggleSectorSelect}
                        onContextMenu={(e, s) => setDropdown(e, { type: 'sector', value: s })}
                        // onDragStart={() => selectedSector.select(sector)}
                        onDragEnd={useCallback(() => {
                            sectorChanged(props.topoQuark, sector().id, props.boulderOrder)
                        }, [props.topoQuark, props.boulderOrder])}
                    />
                )}
            </For>
            <For each={() => waypoints.quarks().toArray()}>
                {(waypoint) => (
                    <WaypointMarker
                        key={waypoint().id}
                        waypoint={waypoint}
                        selected={props.selectedItem.type === 'waypoint' && props.selectedItem.value === waypoint}
                        onClick={(waypointQuark) => props.setSelectedItem({ type: 'waypoint', value: waypointQuark })}
                        onContextMenu={(e, w) => setDropdown(e, { type: 'waypoint', value: w })}
                        draggable
                    />
                )}
            </For>
            <For each={() => parkings.quarks().toArray()}>
                {(parking) => (
                    <ParkingMarker
                        key={parking().id}
                        parking={parking}
                        selected={props.selectedItem.type === 'parking' && props.selectedItem.value === parking}
                        onClick={(parkingQuark) => props.setSelectedItem({ type: 'parking', value: parkingQuark })}
                        onContextMenu={(e, p) => setDropdown(e, { type: 'parking', value: p })}
                        draggable
                    />
                )}
            </For>
        </>
    )
})

BuilderMarkers.displayName = "BuilderMarkers";