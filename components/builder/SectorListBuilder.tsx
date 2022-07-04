import React, { useCallback, useEffect, useState } from "react";
import { BoulderItemLeftbar } from "components/layouts/BoulderItemLeftbar";
import { arrayMove, splitArray } from "helpers/utils";
import { createTrack } from "helpers/builder";
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
import { DraggableList } from "components/atoms/DraggableList";

export interface SectorListBuilderProps {
	topoQuark: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder: SelectQuarkNullable<Boulder>;
	onBoulderSelect: (boulder: Quark<Boulder>) => void;
	onTrackSelect: (track: Quark<Track>, boulder: Quark<Boulder>) => void;
	onRenameSector: (sector: Quark<Sector>) => void;
	onDeleteBoulder: (boulder: Quark<Boulder>) => void;
}

// Note: some cleanup happened here
export const SectorListBuilder: React.FC<SectorListBuilderProps> =
	watchDependencies((props: SectorListBuilderProps) => {
		const session = useSession()!;

		const selectedBoulder = props.selectedBoulder();
		const topo = props.topoQuark();
		const sectors = topo.sectors;

		const boulderQuarksMap = new Map<UUID, Quark<Boulder>>();
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

		return (
			<div className="mb-6 h-full px-4">
				{sectors.quarks().map((sectorQuark, sectorIndex) => {
					const sector = sectorQuark();
					const quarks: Quark<Boulder>[] = [];
					for (const id of sector.boulders) {
						quarks.push(boulderQuarksMap.get(id)!);
					}
					return (
						<div className="mb-10 flex flex-col pb-6">
							<div className="ktext-label text-grey-medium">
								Secteur {sectorIndex + 1}
							</div>
							<div className="ktext-section-title mb-1 flex flex-row items-center text-main">
								<button
									className="cursor-pointer pr-3"
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

								<div className="flex-1" onClick={() => toggleSector(sector)}>
									<span className="cursor-pointer">{sector.name}</span>
								</div>

								<div
									className="cursor-pointer pr-1"
									onClick={() => props.onRenameSector(sectorQuark)}
								>
									<Edit className={"h-5 w-5 stroke-main"} />
								</div>
							</div>

							{!hiddenSectors.has(sector.id) && (
								// BOULDERS
								<div
									className={
										"ml-1 flex flex-col gap-1 rounded-sm p-2 " +
										(draggingSectorId === sector.id ? "bg-grey-superlight" : "")
									}
								>
									{quarks.length === 0 && (
										<div className="">Aucun rocher référencé</div>
									)}
									<DraggableList
										items={quarks.map((boulderQuark, index) => {
											const boulder = boulderQuark();
											return (
												<div className="flex flex-col">
													<BoulderItemLeftbar
														boulder={boulderQuark}
														orderIndex={props.boulderOrder.get(boulder.id)!}
														selected={selectedBoulder?.id === boulder.id}
														displayed={displayedBoulders.has(boulder.id)}
														onArrowClick={() => toggleBoulder(boulder)}
														onNameClick={() => {
															props.onBoulderSelect(boulderQuark);
															toggleBoulder(boulder);
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
											);
										})}
									/>
								</div>
							)}
						</div>
					);
				})}

				{/* <DragDropContext
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
                  {sectors.length > 0 && lonelyQuarks.length > 0 && (
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
                    {lonelyQuarks.map((boulderQuark, index) => {
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
                                displayed={displayedBoulders.has(boulder.id)}
                                onArrowClick={() => toggleBoulder(boulder)}
                                onNameClick={() => {
                                  props.onBoulderSelect(boulderQuark);
                                  toggleBoulder(boulder);
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
        </DragDropContext> */}
			</div>
		);
	});

SectorListBuilder.displayName = "SectorList Builder";
