import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Topo, UUID } from 'types';
import { For } from 'components/atoms';
import { BoulderFilterOptions, BoulderMarker, filterBoulders, isMouseEvent, isPointerEvent, isTouchEvent, ParkingMarker, SectorAreaMarker, WaypointMarker } from 'components/map';
import { sectorChanged } from 'helpers/builder';
import { InteractItem, useSelectStore } from 'components/pages/selectStore';
import { useContextMenu } from 'helpers/hooks';

interface BuilderMarkersProps {
    topoQuark: Quark<Topo>,
    boulderFilters: Quark<BoulderFilterOptions>,
    boulderOrder: Map<UUID, number>,
    setDropdownItem: Dispatch<SetStateAction<InteractItem>>,
    setDropdownPosition: React.Dispatch<React.SetStateAction<{
        x: number;
        y: number;
    } | undefined>>
}

export const BuilderMarkers: React.FC<BuilderMarkersProps> = watchDependencies(
    (props: BuilderMarkersProps) => {
    const topo = props.topoQuark();
    const select = useSelectStore(s => s.select);
    const selectedItem = useSelectStore(s => s.item);

    const setDropdown = (e: Event, item: InteractItem) => {
        if (isMouseEvent(e) || isPointerEvent(e))
				props.setDropdownPosition({ x: e.pageX, y: e.pageY });
        else if (isTouchEvent(e))
            props.setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
        props.setDropdownItem(item);
    }

    useContextMenu(() => props.setDropdownItem({ type: 'none', value: undefined}));
   
    return (
        <>
            <For each={() => filterBoulders(topo.boulders.quarks(), props.boulderFilters())}>
                {(boulder) => (
                    <BoulderMarker
                        key={boulder().id}
                        boulder={boulder}
                        boulderOrder={props.boulderOrder}
                        selectedBoulder={selectedItem.type === 'boulder' ? selectedItem.value : undefined}
                        topo={props.topoQuark}
                        onClick={(boulderQuark) => select.boulder(boulderQuark)}
                        onContextMenu={(e, b) => setDropdown(e, { type: 'boulder', value: b })}
                        draggable={selectedItem.type === 'boulder' && selectedItem.value === boulder}
                    />
                )}
            </For>
            <For each={() => topo.sectors.quarks().toArray()}>
                {(sector) => (
                    <SectorAreaMarker
                        key={sector().id}
                        topoQuark={props.topoQuark}
                        sector={sector}
                        boulderOrder={props.boulderOrder}
                        isOnBuilder
                        onContextMenu={(e, s) => setDropdown(e, { type: 'sector', value: s })}
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
                        onContextMenu={(e, w) => setDropdown(e, { type: 'waypoint', value: w })}
                        draggable
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
                        onContextMenu={(e, p) => setDropdown(e, { type: 'parking', value: p })}
                        draggable
                    />
                )}
            </For>
        </>
    )
})

BuilderMarkers.displayName = "BuilderMarkers";