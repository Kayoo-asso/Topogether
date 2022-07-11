import React, { useState } from "react";
import { Quark, SelectQuarkNullable, watchDependencies } from "helpers/quarky";
import { Boulder, Sector, Topo, Track, UUID } from "types";
import ArrowSimple from "assets/icons/arrow-simple.svg";
import { BoulderItemLeftbar } from "components/layouts/BoulderItemLeftbar";
import { splitArray } from "helpers/utils";

interface SectorListProps {
	topoQuark: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder: SelectQuarkNullable<Boulder>;
	onBoulderSelect: (boulderQuark: Quark<Boulder>) => void;
	onTrackSelect: (
		trackQuark: Quark<Track>,
		boulderQuark: Quark<Boulder>
	) => void;
}

export const SectorList: React.FC<SectorListProps> = watchDependencies(
	(props: SectorListProps) => {
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

		return (
			<div className="mb-6 h-[95%] px-4">
				{sectors.quarks().map((sectorQuark, sectorIndex) => {
					const sector = sectorQuark();
					const quarks: Quark<Boulder>[] = [];
					for (const id of sector.boulders) {
						quarks.push(boulderQuarksMap.get(id)!);
					}

					return (
						<div className="mb-10 flex flex-col pb-6" key={sector.id}>
							<div className="ktext-label text-grey-medium">
								Secteur {sectorIndex + 1}
							</div>
							<div className="ktext-section-title mb-2 flex cursor-pointer flex-row items-center text-main">
								<div className="pr-3">
									<ArrowSimple
										className={
											"h-3 w-3 cursor-pointer stroke-main stroke-2 " +
											(hiddenSectors.has(sector.id)
												? "rotate-180"
												: "-rotate-90")
										}
										onClick={() => toggleSector(sector)}
									/>
								</div>
								<div onClick={() => toggleSector(sector)}>{sector.name}</div>
							</div>

							{!hiddenSectors.has(sector.id) && (
								// BOULDERS
								<div className="ml-3 flex flex-col gap-1">
									{quarks.length === 0 && (
										<div className="">Aucun rocher référencé</div>
									)}
									{quarks.length > 0 &&
										quarks.map((boulderQuark) => {
											const boulder = boulderQuark();
											return (
												<div key={boulder.id}>
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
														onTrackClick={(trackQuark) =>
															props.onTrackSelect(trackQuark, boulderQuark)
														}
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
					{sectors.length > 0 && lonelyQuarks.length > 0 && (
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
										orderIndex={props.boulderOrder.get(boulder.id)!}
										selected={selectedBoulder?.id === boulder.id}
										displayed={displayedBoulders.has(boulder.id)}
										onArrowClick={() => toggleBoulder(boulder)}
										onNameClick={() => {
											props.onBoulderSelect(boulderQuark);
											toggleBoulder(boulder);
										}}
										onTrackClick={(trackQuark) =>
											props.onTrackSelect(trackQuark, boulderQuark)
										}
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
