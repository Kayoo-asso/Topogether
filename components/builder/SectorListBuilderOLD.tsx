import React, { useCallback, useEffect, useState } from "react";
import { Quark, SelectQuarkNullable, watchDependencies } from "helpers/quarky";
import { Boulder, Sector, Topo, Track, UUID } from "types";
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from "react-beautiful-dnd";
import { useSession } from "helpers/services";
import ArrowSimple from "assets/icons/arrow-simple.svg";
import Edit from "assets/icons/edit.svg";
import { arrayMove, splitArray } from "helpers/utils";
import { BoulderItemLeftbar } from "components/layouts/BoulderItemLeftbar";
import { createTrack } from "helpers/builder";

export interface SectorListBuilderProps {
	topoQuark: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder: SelectQuarkNullable<Boulder>;
	onBoulderSelect: (boulderQuark: Quark<Boulder>) => void;
	onTrackSelect: (
		trackQuark: Quark<Track>,
		boulderQuark: Quark<Boulder>
	) => void;
	onRenameSector: (sectorQuark: Quark<Sector>) => void;
	onDeleteBoulder: (boulderQuark: Quark<Boulder>) => void;
}

export const SectorListBuilder: React.FC<SectorListBuilderProps> =
	watchDependencies((props: SectorListBuilderProps) => {
		const session = useSession();

		const selectedBoulder = props.selectedBoulder();
		const topo = props.topoQuark();
		const sectors = topo.sectors;
		const [bouldersIn, bouldersOut] = splitArray(
			topo.boulders.quarks().toArray(),
			(b) =>
				sectors
					.toArray()
					.map((s) => s.boulders)
					.flat()
					.includes(b().id)
		);
		const bouldersOutSorted = topo.lonelyBoulders.map(
			(id) => bouldersOut.find((b) => b().id === id)!
		);

		const [displayedSectors, setDisplayedSectors] = useState<Array<UUID>>(
			sectors.map((sector) => sector.id).toArray()
		);
		const [displayedBoulders, setDisplayedBoulders] = useState<Array<UUID>>([]);

		const [draggingSectorId, setDraggingSectorId] = useState();
		const handleDragStart = useCallback((res) => {
			setDraggingSectorId(res.source.droppableId);
		}, []);

		const handleDragEnd = useCallback(
			(res: DropResult) => {
				setDraggingSectorId(undefined);
				if (res.destination) {
					if (res.source.droppableId === "no-sector") {
						let newLonelyBoulders = [...topo.lonelyBoulders];
						newLonelyBoulders = arrayMove(
							newLonelyBoulders,
							res.source.index,
							res.destination.index
						);
						props.topoQuark.set((t) => ({
							...t,
							lonelyBoulders: newLonelyBoulders,
						}));
					} else {
						const sector = sectors.findQuark(
							(s) => s.id === res.source.droppableId
						);
						if (sector) {
							let newSectorBoulders = [...sector().boulders];
							newSectorBoulders = arrayMove(
								newSectorBoulders,
								res.source.index,
								res.destination.index
							);
							sector.set((s) => ({
								...s,
								boulders: newSectorBoulders,
							}));
						}
					}
				}
			},
			[topo, sectors]
		);

		useEffect(() => {
			if (topo.sectors.length > 0) {
				const lastSector = topo.sectors.at(topo.sectors.length - 1);
				if (!displayedSectors.includes(lastSector.id)) {
					setDisplayedSectors([...displayedSectors, lastSector.id]);
				}
			}
		}, [topo.sectors.length]);

		if (!session) return <></>;

		return (
			<div className="mb-6 px-4">
				{sectors.quarks().map((sectorQuark, sectorIndex) => {
					const sector = sectorQuark();
					const boulderQuarks = sector.boulders.map(
						(id) => bouldersIn.find((b) => b().id === id)!
					);
					return (
						<DragDropContext
							onDragEnd={handleDragEnd}
							onDragStart={handleDragStart}
							key={sector.id}
						>
							<Droppable droppableId={sector.id} key={sector.id}>
								{(provided) => (
									<div
										className="flex flex-col mb-10 pb-6"
										{...provided.droppableProps}
										ref={provided.innerRef}
									>
										<div className="ktext-label text-grey-medium">
											Secteur {sectorIndex + 1}
										</div>
										<div className="ktext-section-title text-main mb-1 flex flex-row items-center">
											<button
												className="pr-3 cursor-pointer"
												onClick={() => {
													const newDS = [...displayedSectors];
													if (newDS.includes(sector.id))
														newDS.splice(newDS.indexOf(sector.id), 1);
													else newDS.push(sector.id);
													setDisplayedSectors(newDS);
												}}
											>
												<ArrowSimple
													className={
														"w-3 h-3 stroke-main stroke-2 " +
														(displayedSectors.includes(sector.id)
															? "-rotate-90"
															: "rotate-180")
													}
												/>
											</button>

											<div
												className="flex-1"
												onClick={() => {
													const newDS = [...displayedSectors];
													if (!newDS.includes(sector.id)) {
														newDS.push(sector.id);
														setDisplayedSectors(newDS);
													}
												}}
											>
												<span className="cursor-pointer">{sector.name}</span>
											</div>

											<div
												className="pr-1 cursor-pointer"
												onClick={() => props.onRenameSector(sectorQuark)}
											>
												<Edit className={"w-5 h-5 stroke-main"} />
											</div>
										</div>

										{displayedSectors.includes(sector.id) && (
											// BOULDERS
											<div
												className={
													"flex flex-col gap-1 ml-1 p-2 rounded-sm " +
													(draggingSectorId === sector.id
														? "bg-grey-superlight"
														: "")
												}
											>
												{boulderQuarks.length === 0 && (
													<div className="">Aucun rocher référencé</div>
												)}
												{boulderQuarks.map((boulderQuark, index) => {
													const boulder = boulderQuark();
													return (
														<Draggable
															key={boulder.id}
															draggableId={boulder.id}
															index={index}
														>
															{(provided) => (
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<BoulderItemLeftbar
																		boulder={boulderQuark}
																		orderIndex={
																			props.boulderOrder.get(boulder.id)!
																		}
																		selected={
																			selectedBoulder?.id === boulder.id
																		}
																		displayed={displayedBoulders.includes(
																			boulder.id
																		)}
																		onArrowClick={() => {
																			const newDB = [...displayedBoulders];
																			if (newDB.includes(boulder.id))
																				newDB.splice(
																					newDB.indexOf(boulder.id),
																					1
																				);
																			else newDB.push(boulder.id);
																			setDisplayedBoulders(newDB);
																		}}
																		onNameClick={() => {
																			props.onBoulderSelect(boulderQuark);
																			const newDB = [...displayedBoulders];
																			if (!newDB.includes(boulder.id)) {
																				newDB.push(boulder.id);
																				setDisplayedBoulders(newDB);
																			}
																		}}
																		onDeleteClick={() =>
																			props.onDeleteBoulder(boulderQuark)
																		}
																		onTrackClick={(trackQuark) =>
																			props.onTrackSelect(
																				trackQuark,
																				boulderQuark
																			)
																		}
																		displayCreateTrack
																		onCreateTrack={() =>
																			createTrack(boulder, session.id)
																		}
																	/>
																</div>
															)}
														</Draggable>
													);
												})}
												{provided.placeholder}
											</div>
										)}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					);
				})}

				<DragDropContext
					onDragEnd={handleDragEnd}
					onDragStart={handleDragStart}
				>
					<Droppable droppableId="no-sector">
						{(provided) => {
							return (
								<div
									className="flex flex-col"
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{sectors.length > 0 && bouldersOutSorted.length > 0 && (
										<div className="ktext-label text-grey-medium mb-1">
											Sans secteur
										</div>
									)}
									<div
										className={
											"flex flex-col gap-1 ml-1 p-2 rounded-sm " +
											(draggingSectorId === "no-sector"
												? "bg-grey-superlight"
												: "")
										}
									>
										{bouldersOutSorted.map((boulderQuark, index) => {
											const boulder = boulderQuark();
											return (
												<Draggable
													key={boulder.id}
													draggableId={boulder.id}
													index={index}
												>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
														>
															<BoulderItemLeftbar
																boulder={boulderQuark}
																orderIndex={props.boulderOrder.get(boulder.id)!}
																selected={selectedBoulder?.id === boulder.id}
																displayed={displayedBoulders.includes(
																	boulder.id
																)}
																onArrowClick={() => {
																	const newDB = [...displayedBoulders];
																	if (newDB.includes(boulder.id))
																		newDB.splice(newDB.indexOf(boulder.id), 1);
																	else newDB.push(boulder.id);
																	setDisplayedBoulders(newDB);
																}}
																onNameClick={() => {
																	props.onBoulderSelect(boulderQuark);
																	const newDB = [...displayedBoulders];
																	if (!newDB.includes(boulder.id)) {
																		newDB.push(boulder.id);
																		setDisplayedBoulders(newDB);
																	}
																}}
																onDeleteClick={() =>
																	props.onDeleteBoulder(boulderQuark)
																}
																onTrackClick={(trackQuark) =>
																	props.onTrackSelect(trackQuark, boulderQuark)
																}
																displayCreateTrack
																onCreateTrack={() =>
																	createTrack(boulder, session.id)
																}
															/>
														</div>
													)}
												</Draggable>
											);
										})}
										{provided.placeholder}
									</div>
								</div>
							);
						}}
					</Droppable>
				</DragDropContext>
			</div>
		);
	});

SectorListBuilder.displayName = "SectorList Builder";
