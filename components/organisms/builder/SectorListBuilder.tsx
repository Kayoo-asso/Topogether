import React, { useCallback, useState } from "react";
import { createTrack, deleteBoulder } from "helpers/builder";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, Sector, Topo, UUID } from "types";
import { useSession } from "helpers/services";
import { useBreakpoint, useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";
import { useSelectStore } from "components/pages/selectStore";
import { ModalRenameSector } from "./ModalRenameSector";
import { Map } from "ol";
import { BoulderItemLeftbar } from "components/layouts/BoulderItemLeftbar";
import { fromLonLat } from "ol/proj";

import ArrowSimple from "assets/icons/arrow-simple.svg";
import Edit from "assets/icons/edit.svg";

import {
	DndContext, 
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	SortableData,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
	restrictToVerticalAxis,
} from '@dnd-kit/modifiers';

export interface SectorListBuilderProps {
	topoQuark: Quark<Topo>;
	boulderOrder: globalThis.Map<UUID, number>;
	map: Map | null
}

export const SectorListBuilder: React.FC<SectorListBuilderProps> =
	watchDependencies((props: SectorListBuilderProps) => {
		const session = useSession();
		if (!session) return null;
		const breakpoint = useBreakpoint();

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
		
		const [sectorToRename, setSectorToRename] = useState<Quark<Sector>>();
		const [ModalDeleteBoulder, showModalDeleteBoulder] = useModal<Quark<Boulder>>();

		const [draggingSectorId, setDraggingSectorId] = useState<UUID | 'no-sector'>();
		const sensors = useSensors(
			useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
			useSensor(KeyboardSensor, {
			  coordinateGetter: sortableKeyboardCoordinates,
			})
		);
		const handleDragStart = (e: DragStartEvent) => {
			const sector = e.active.data.current as SortableData;
			const sectorId = sector.sortable.containerId as UUID;
			setDraggingSectorId(sectorId);
		}
		const handleDragEnd = useCallback((e: DragEndEvent) => {
			const {active, over} = e;
			if (over && active.id !== over.id) {
				if (draggingSectorId === 'no-sector') {
					let newLonelyBoulders = [...topo.lonelyBoulders];
					const fromIndex = newLonelyBoulders.indexOf(active.id as UUID);
					const toIndex = newLonelyBoulders.indexOf(over.id as UUID);
					newLonelyBoulders = arrayMove(
						newLonelyBoulders,
						fromIndex,
						toIndex
					);
					props.topoQuark.set((t) => ({
						...t,
						lonelyBoulders: newLonelyBoulders,
					}));
				}
				else {
					const sector = topo.sectors.findQuark(s => s.id === draggingSectorId);
					if (sector) {
						let newSectorBoulders = [...sector().boulders];
						const fromIndex = newSectorBoulders.indexOf(active.id as UUID);
						const toIndex = newSectorBoulders.indexOf(over.id as UUID);
						newSectorBoulders = arrayMove(
							newSectorBoulders,
							fromIndex,
							toIndex
						);
						sector.set((s) => ({
							...s,
							boulders: newSectorBoulders,
						}));
					}
				}
			}
			setDraggingSectorId(undefined);
		}, [draggingSectorId]);

		return (
			<>
				<div className="mb-6">				
					{topo.sectors.quarks().map((sectorQuark, sectorIndex) => {
						const sector = sectorQuark();
						const boulders: Quark<Boulder>[] = [];
						for (const id of sector.boulders) {
							boulders.push(boulderQuarksMap.get(id)!);
						}
						return (
							<div key={sector.id} className="mb-10 flex flex-col pb-6">
								<div className="ktext-label text-grey-medium">
									Secteur {sectorIndex + 1}
								</div>
								<div className="ktext-section-title mb-1 flex flex-row items-center text-main">
									<button
										className="md:cursor-pointer pr-3"
										onClick={() => toggleSector(sector)}
									>
										<ArrowSimple
											className={
												"h-3 w-3 stroke-main stroke-2 " +
												(hiddenSectors.has(sector.id)
													? "rotate-180"
													: "-rotate-90")
											}
										/>
									</button>

									<div
										className="flex-1"
										onClick={() => toggleSector(sector)}
									>
										<span className={"md:cursor-pointer " + (sector.name.length > 12
											? "text-lg"
											: "")}>
											{sector.name}
										</span>
									</div>

									<div
										className="md:cursor-pointer pr-1"
										onClick={() => setSectorToRename(() => sectorQuark)}
									>
										<Edit className={"h-5 w-5 stroke-main"} />
									</div>
								</div>

								{!hiddenSectors.has(sector.id) && (
									// BOULDERS
									<div
										className={
											"ml-1 flex flex-col gap-1 rounded-sm p-2 " +
											(draggingSectorId === sector.id
												? "bg-grey-superlight"
												: "")
										}
									>
										{boulders.length === 0 && (
											<div className="">Aucun rocher référencé</div>
										)}
										{boulders.length > 0 &&
											<DndContext 
												id={sector.id}
												sensors={sensors}
												collisionDetection={closestCenter}
												modifiers={[restrictToVerticalAxis]}
												onDragStart={handleDragStart}
												onDragEnd={handleDragEnd}
											>
												<SortableContext 
													items={boulders.map(b => b().id)}
													strategy={verticalListSortingStrategy}
													id={sector.id}
												>
													{boulders.map((boulderQuark, index) => {
														const boulder = boulderQuark();
														return (
															<BoulderItemLeftbar
																key={boulder.id}
															    boulder={boulderQuark}
															    orderIndex={props.boulderOrder.get(boulder.id)!}
															    selected={!!(selectedBoulder && selectedBoulder.value().id === boulder.id)}
															    displayed={displayedBoulders.has(boulder.id)}
															    onArrowClick={() => toggleBoulder(boulder)}
															    onNameClick={() => {
															        selectStore.select.boulder(boulderQuark);
															        props.map?.getView().setCenter(fromLonLat(boulderQuark().location));
															        toggleBoulder(boulder);
															    }}
															    onDeleteClick={() => showModalDeleteBoulder(boulderQuark) }
															    onTrackClick={(trackQuark) => selectStore.select.track(trackQuark, boulderQuark)}
															    displayCreateTrack
															    onCreateTrack={() => createTrack(boulder, session.id)}
															/>
														);
													})}
												</SortableContext>
											</DndContext>
										}
										
									</div>
								)}
							</div>
						)
					})}

					<div className="flex flex-col">
						{topo.sectors.length > 0 && lonelyQuarks.length > 0 && (
							<div className="ktext-label mb-1 text-grey-medium">
								Sans secteur
							</div>
						)}
						<div
							className={
								"ml-1 flex flex-col gap-1 rounded-sm p-2 " +
								(draggingSectorId === "no-sector"
									? "bg-grey-superlight"
									: "")
							}
						>
							<DndContext 
								sensors={sensors}
								collisionDetection={closestCenter}
								modifiers={[restrictToVerticalAxis]}
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}
							>
								<SortableContext 
									items={lonelyQuarks.map(b => b().id)}
									strategy={verticalListSortingStrategy}
									id="no-sector"
								>
									{lonelyQuarks.map((boulderQuark, index) => {
										const boulder = boulderQuark();
										return (
											<BoulderItemLeftbar
												key={index}
												boulder={boulderQuark}
												orderIndex={props.boulderOrder.get(boulder.id)!}
												selected={!!(selectedBoulder && selectedBoulder.value().id === boulder.id)}
												displayed={displayedBoulders.has(boulder.id)}
												onArrowClick={() => toggleBoulder(boulder)}
												onNameClick={() => {
													selectStore.select.boulder(boulderQuark);
													props.map?.getView().setCenter(fromLonLat(boulderQuark().location));
													toggleBoulder(boulder);
												}}
												onDeleteClick={() => showModalDeleteBoulder(boulderQuark) }
												onTrackClick={(trackQuark) =>
													selectStore.select.track(trackQuark, boulderQuark)
												}
												displayCreateTrack
												onCreateTrack={() =>
													createTrack(boulder, session.id)
												}
											/>
										)}
									)}
								</SortableContext>
							</DndContext>
						</div>
					</div>
				</div>	

				{sectorToRename &&
					<ModalRenameSector 
						sector={sectorToRename}
						onClose={() => setSectorToRename(undefined)}
					/>
				}

				<ModalDeleteBoulder
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={(boulderQuark) => deleteBoulder(props.topoQuark, boulderQuark, breakpoint === 'mobile' ? selectStore.flush.all : selectStore.flush.item, selectedBoulder) }
				>
					Êtes-vous sûr de vouloir supprimer le bloc et toutes les voies
					associées ?
				</ModalDeleteBoulder>
			</>
		);
	});

SectorListBuilder.displayName = "SectorListBuilder";
