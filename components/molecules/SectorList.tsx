import React, { useState } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, Sector, Topo, UUID } from "types";
import { BoulderItemLeftbar } from "components/layouts/BoulderItemLeftbar";
import { useSelectStore } from "components/store/selectStore";
import { Map } from "ol";
import { transform } from 'ol/proj.js';

import ArrowSimple from "assets/icons/arrow-simple.svg";
import { useBoulderOrder } from "components/store/boulderOrderStore";

interface SectorListProps {
	topoQuark: Quark<Topo>;
	// if undefined: all boulders are displayed
	bouldersToDisplay?: UUID[];
	displayEmptySectors?: boolean;
	expandOnClick?: boolean
	map: Map | null;
}

export const SectorList: React.FC<SectorListProps> = watchDependencies(
	({
		displayEmptySectors = true,
		expandOnClick = true,
		...props
	}: SectorListProps) => {
		const selectStore = useSelectStore();
		const selectedBoulder = selectStore.item.type === 'boulder' ? selectStore.item : undefined;	
		const topo = props.topoQuark();

		const boulderQuarksMap = new globalThis.Map<UUID, Quark<Boulder>>();
		for (const bq of topo.boulders.quarks()) {
			const b = bq();
			boulderQuarksMap.set(b.id, bq);
		}
		const lonelyQuarks: Quark<Boulder>[] = [];
		for (const id of topo.lonelyBoulders) {
			lonelyQuarks.push(boulderQuarksMap.get(id)!);
		}

		const boulderOrder = useBoulderOrder(bo => bo.value);

		// By default, all sectors are shown
		// Thus, it's cheaper and easier to track the sectors we hide
		const [hiddenSectors, setHiddenSectors] = useState<Set<UUID>>(new Set());
		// The reverse is true for boulders
		const [displayedBoulders, setDisplayedBoulders] = useState<Set<UUID>>(
			new Set()
		);

		const toggleSector = (sector: Sector) => {
			const hs = new Set(hiddenSectors);
			if (!hs.delete(sector.id)) {
				hs.add(sector.id);
			}
			setHiddenSectors(hs);
		};
		const toggleBoulder = (boulder: Boulder) => {
			const db = new Set(displayedBoulders);
			if (!db.delete(boulder.id)) {
				db.add(boulder.id);
			}
			setDisplayedBoulders(db);
		};

		return (
			<div className="mb-6 h-[95%] px-4">
				{topo.sectors.quarks().map((sectorQuark, sectorIndex) => {
					const sector = sectorQuark();
					const boulderIds = (props.bouldersToDisplay && props.bouldersToDisplay.length > 0) ? 
						sector.boulders.filter(id => props.bouldersToDisplay?.includes(id)) : 
						sector.boulders;
					const boulders: Quark<Boulder>[] = [];
					for (const id of boulderIds) {
						const bQ = boulderQuarksMap.get(id);
						if (bQ) boulders.push(bQ);
					}
					if (!displayEmptySectors && boulders.length < 1) return;
					return (
						<div className="mb-10 flex flex-col pb-6" key={sector.id}>
							<div className="ktext-label text-grey-medium">
								Secteur {sectorIndex + 1}
							</div>
							<div className={`ktext-section-title mb-2 flex flex-row items-center text-main md:cursor-pointer`}>
								<div className="pr-3">
									<ArrowSimple
										className={`h-3 w-3 stroke-main stroke-2 md:cursor-pointer 
										${hiddenSectors.has(sector.id) ? "rotate-180" : "-rotate-90"}`}
										onClick={() => toggleSector(sector)}
									/>
								</div>
								<div onClick={() => expandOnClick && toggleSector(sector)}>{sector.name}</div>
							</div>

							{!hiddenSectors.has(sector.id) && (
								// BOULDERS
								<div className="ml-3 flex flex-col gap-1">
									{boulders.length === 0 && (
										<div className="">Aucun rocher référencé</div>
									)}
									{boulders.length > 0 &&
										boulders.map((boulderQuark) => {
											const boulder = boulderQuark();
											return (
												<div key={boulder.id}>
													<BoulderItemLeftbar
														boulder={boulderQuark}
														orderIndex={boulderOrder.get(boulder.id)!}
														selected={!!(selectedBoulder && selectedBoulder.value().id === boulder.id)}
														displayed={displayedBoulders.has(boulder.id)}
														onArrowClick={() => toggleBoulder(boulder)}
														onNameClick={() => {
															selectStore.select.boulder(boulderQuark);
															props.map?.getView().setCenter(transform(boulderQuark().location, 'EPSG:4326', 'EPSG:3857'));
															expandOnClick && toggleBoulder(boulder);
														}}
														displayCreateTrack={false}
													/>
												</div>
											);
										})}
								</div>
							)}
						</div>
					);
				})}

				{/* BOULDERS WITHOUT SECTOR       */}
				<div className="mb-10 flex flex-col">
					{topo.sectors.length > 0 && lonelyQuarks.length > 0 && (
						<div className="ktext-label mb-2 text-grey-medium">
							Sans secteur
						</div>
					)}
					<div className="ml-3 flex flex-col gap-1">
						{lonelyQuarks.map((boulderQuark) => {
							const boulder = boulderQuark();
							return (
								<div key={boulder.id}>
									<BoulderItemLeftbar
										boulder={boulderQuark}
										orderIndex={boulderOrder.get(boulder.id)!}
										selected={!!(selectedBoulder && selectedBoulder.value().id === boulder.id)}
										displayed={displayedBoulders.has(boulder.id)}
										onArrowClick={() => toggleBoulder(boulder)}
										onNameClick={() => {
											selectStore.select.boulder(boulderQuark);
											props.map?.getView().setCenter(transform(boulderQuark().location, 'EPSG:4326', 'EPSG:3857'));
											toggleBoulder(boulder);
										}}
										displayCreateTrack={false}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
);

SectorList.displayName = "SectorList";
