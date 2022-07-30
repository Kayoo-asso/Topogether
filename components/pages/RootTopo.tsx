import React, { useCallback, useEffect, useState } from "react";
import {
	AccessSlideover,
	InfoSlideover,
	ManagementSlideover,
	BoulderSlideagainstDesktop,
	BoulderSlideoverMobile,
	TrackSlideagainstDesktop,
	SectorSlideoverMobile,
	Show,
	DropdownOption,
	For,
	ParkingSlide,
	TracksImage,
	WaypointSlide,
} from "components";
import {
	Boulder,
	ClimbTechniques,
	Image,
	isUUID,
	Parking,
	Sector,
	Topo,
	TopoStatus,
	Track,
	Waypoint,
} from "types";
import {
	Quark,
	QuarkIter,
	useCreateDerivation,
	useCreateQuark,
	useLazyQuarkyEffect,
	useQuarkyCallback,
	useSelectQuark,
	watchDependencies,
} from "helpers/quarky";
import { useRouter } from "next/router";
import { useFirstRender } from "helpers/hooks/useFirstRender";
import { Header } from "components/layouts/Header";
import { LeftbarTopoDesktop } from "components/layouts/LeftbarTopoDesktop";
import {
	BoulderFilterOptions,
	MapControl,
	ClusterProvider,
	filterBoulders,
	BoulderMarker,
	SectorAreaMarker,
	WaypointMarker,
	ParkingMarker,
} from "components/map";
import { useBreakpoint } from "helpers/hooks";
import { useSession } from "helpers/services";
import { sortBoulders } from "helpers/topo";
import { decodeUUID, encodeUUID } from "helpers/utils";

interface RootTopoProps {
	topoQuark: Quark<Topo>;
}

export const RootTopo: React.FC<RootTopoProps> = watchDependencies(
	(props: RootTopoProps) => {
		const router = useRouter();
		const session = useSession();
		const { b: bId } = router.query; // Get boulder id from url if selected
		const breakpoint = useBreakpoint();

		const topo = props.topoQuark();

		const sectors = topo.sectors;
		const boulders = topo.boulders;
		const parkings = topo.parkings;
		const waypoints = topo.waypoints;
		const boulderOrder = useCreateDerivation(() =>
			sortBoulders(topo.sectors, topo.lonelyBoulders)
		);



		const [currentImage, setCurrentImage] = useState<Image>();
		const selectedSector = useSelectQuark<Sector>();
		const selectedBoulder = useSelectQuark<Boulder>();
		const selectedTrack = useSelectQuark<Track>();
		const selectedParking = useSelectQuark<Parking>();
		const selectedWaypoint = useSelectQuark<Waypoint>();

		const toggleSectorSelect = useCallback(
			(sectorQuark: Quark<Sector>) => {
				if (selectedSector()?.id === sectorQuark().id)
					selectedSector.select(undefined);
				else selectedSector.select(sectorQuark);
			},
			[selectedSector, selectedBoulder]
		);

		const toggleBoulderSelect = useQuarkyCallback(
			(boulderQuark: Quark<Boulder>) => {
				selectedTrack.select(undefined);
				selectedParking.select(undefined);
				selectedWaypoint.select(undefined);
				const boulder = boulderQuark();
				if (selectedBoulder()?.id === boulder.id)
					selectedBoulder.select(undefined);
				else {
					if (boulder.images[0]) setCurrentImage(boulder.images[0]);
					selectedBoulder.select(boulderQuark);
				}
			},
			[selectedBoulder]
		);
		// Hack: select boulder from query parameter
		useEffect(() => {
			if (typeof bId === "string") {
				const expanded = decodeUUID(bId);
				if (isUUID(expanded)) {
					const boulder = boulders.findQuark((b) => b.id === expanded);
					if (boulder) toggleBoulderSelect(boulder);
				}
			}
		}, [])

		const toggleTrackSelect = useCallback(
			(trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => {
				selectedBoulder.select(undefined);
				selectedParking.select(undefined);
				selectedWaypoint.select(undefined);
				if (selectedTrack()?.id === trackQuark().id) {
					selectedTrack.select(undefined);
				} else {
					selectedBoulder.select(boulderQuark);
					selectedTrack.select(trackQuark);
				}
			},
			[selectedTrack]
		);
		const toggleParkingSelect = useQuarkyCallback(
			(parkingQuark: Quark<Parking>) => {
				selectedBoulder.select(undefined);
				selectedTrack.select(undefined);
				selectedWaypoint.select(undefined);
				if (selectedParking()?.id === parkingQuark().id)
					selectedParking.select(undefined);
				else selectedParking.select(parkingQuark);
			},
			[selectedParking]
		);
		const toggleWaypointSelect = useQuarkyCallback(
			(waypointQuark: Quark<Waypoint>) => {
				selectedBoulder.select(undefined);
				selectedTrack.select(undefined);
				selectedParking.select(undefined);
				if (selectedWaypoint()?.id === waypointQuark().id)
					selectedWaypoint.select(undefined);
				else selectedWaypoint.select(waypointQuark);
			},
			[selectedWaypoint]
		);
		useLazyQuarkyEffect(
			([boulder]) => {
				if (boulder)
					router.push(
						{
							pathname: window.location.href.split("?")[0],
							query: { b: encodeUUID(boulder.id) },
						},
						undefined,
						{ shallow: true }
					);
				else
					router.push(
						{ pathname: window.location.href.split("?")[0] },
						undefined,
						{ shallow: true }
					);
			},
			[selectedBoulder]
		);

		const [displaySectorSlideover, setDisplaySectorSlideover] =
			useState<boolean>(false);
		const [displayInfo, setDisplayInfo] = useState<boolean>(false);
		const [displayApproach, setDisplayApproach] = useState<boolean>(false);
		const [displayManagement, setDisplayManagement] = useState<boolean>(false);
		const [currentDisplay, setCurrentDisplay] = useState<
			"INFO" | "APPROACH" | "MANAGEMENT" | "none"
		>();
		useEffect(() => {
			if (currentDisplay) {
				selectedBoulder.select(undefined);
				selectedTrack.select(undefined);
				selectedParking.select(undefined);
				selectedWaypoint.select(undefined);
				if (currentDisplay === "INFO") {
					setDisplayInfo(true);
					setTimeout(() => {
						setDisplayApproach(false);
						setDisplayManagement(false);
					}, 150);
				} else if (currentDisplay === "APPROACH") {
					setDisplayApproach(true);
					setTimeout(() => {
						setDisplayInfo(false);
						setDisplayManagement(false);
					}, 150);
				} else if (currentDisplay === "MANAGEMENT") {
					setDisplayManagement(true);
					setTimeout(() => {
						setDisplayInfo(false);
						setDisplayApproach(false);
					}, 150);
				} else {
					setDisplayInfo(false);
					setDisplayApproach(false);
					setDisplayManagement(false);
				}
			}
		}, [currentDisplay]);

		const constructMenuOptions = () => {
			const menuOptions: DropdownOption[] = [
				{ value: "Infos du topo", action: () => setCurrentDisplay("INFO") },
				{
					value: "Marche d'approche",
					action: () => setCurrentDisplay("APPROACH"),
				},
				{
					value: "Gestionnaires du site",
					action: () => setCurrentDisplay("MANAGEMENT"),
				},
			];
			if (
				topo.status === TopoStatus.Draft &&
				(topo.creator?.id === session?.id || session?.role === "ADMIN")
			)
				menuOptions.push({
					value: "Modifier",
					action: () => router.push(`/builder/${encodeUUID(topo.id)}`),
				});
			// TODO : add topo.creator.mail as the first option of the OR (after mailto)
			else
				menuOptions.push({
					value: "Signaler une erreur",
					action: () =>
						window.open(
							"mailto:" +
								(topo.managers.toArray()[0]?.contactMail ||
									"contact@kayoo-asso.fr") +
								"?subject=Signaler une erreur | Topo : " +
								topo.name
						),
				});
			return menuOptions;
		};

		let maxTracks = 0;
		for (const boulder of boulders) {
			maxTracks = Math.max(maxTracks, boulder.tracks.length);
		}
		const defaultBoulderFilterOptions: BoulderFilterOptions = {
			techniques: ClimbTechniques.None,
			tracksRange: [0, maxTracks],
			gradeRange: [3, 9],
			mustSee: false,
		};
		const boulderFilters = useCreateQuark<BoulderFilterOptions>(
			defaultBoulderFilterOptions
		);

		return (
			<>
				<Header
					title={topo.name}
					backLink="/"
					onBackClick={
						selectedBoulder()
							? () => {
									selectedTrack.select(undefined);
									selectedBoulder.select(undefined);
							  }
							: selectedParking()
							? () => selectedParking.select(undefined)
							: selectedWaypoint()
							? () => selectedWaypoint.select(undefined)
							: undefined
					}
					menuOptions={constructMenuOptions()}
				/>

				{/* overflow-clip instead of overflow-hidden, so that the Slideagainst can appear off-screen without 
                triggering a shift of content in this div */}
				<div className="relative flex h-content flex-row md:h-full md:overflow-clip">
					<LeftbarTopoDesktop
						topoQuark={props.topoQuark}
						boulderOrder={boulderOrder()}
						selectedBoulder={selectedBoulder}
						onBoulderSelect={toggleBoulderSelect}
						onTrackSelect={toggleTrackSelect}
					/>
					<Show
						when={() =>
							[breakpoint === "mobile", displaySectorSlideover] as const
						}
					>
						{() => (
							<SectorSlideoverMobile
								topoQuark={props.topoQuark}
								boulderOrder={boulderOrder()}
								selectedBoulder={selectedBoulder}
								onBoulderSelect={toggleBoulderSelect}
								onTrackSelect={toggleTrackSelect}
								onClose={() => setDisplaySectorSlideover(false)}
							/>
						)}
					</Show>

					<Show when={() => displayInfo}>
						<InfoSlideover
							topo={props.topoQuark}
							open={displayInfo}
							onClose={() => setCurrentDisplay("none")}
							className={currentDisplay === "INFO" ? "z-300" : "z-50"}
						/>
					</Show>
					<Show when={() => displayApproach}>
						<AccessSlideover
							accesses={topo.accesses}
							open={displayApproach}
							onClose={() => setCurrentDisplay("none")}
							className={currentDisplay === "APPROACH" ? "z-300" : "z-50"}
						/>
					</Show>
					<Show when={() => displayManagement}>
						<ManagementSlideover
							managers={topo.managers}
							open={displayManagement}
							onClose={() => setCurrentDisplay("none")}
							className={currentDisplay === "MANAGEMENT" ? "z-300" : "z-50"}
						/>
					</Show>

					<MapControl
						initialCenter={topo.location}
						initialZoom={16}
						displaySectorButton
						onSectorButtonClick={() => setDisplaySectorSlideover(true)}
						searchbarOptions={{
							findBoulders: true,
						}}
						onBoulderResultSelect={(boulder) =>
							toggleBoulderSelect(
								boulders.findQuark((b) => b.id === boulder.id)!
							)
						}
						topo={props.topoQuark}
						boulderFilters={boulderFilters}
						boulderFiltersDomain={defaultBoulderFilterOptions}
						boundsTo={boulders
							.map((b) => b.location)
							.concat(parkings.map((p) => p.location))
							.toArray()
						}
					>
						{/* TODO: improve the callbacks */}
						<ClusterProvider>
							<For
								each={() => filterBoulders(boulders.quarks().toArray(), boulderFilters())}
							>
								{(boulder) => (
									<BoulderMarker
										key={boulder().id}
										boulder={boulder}
										boulderOrder={boulderOrder()}
										selectedBoulder={selectedBoulder}
										topo={props.topoQuark}
										onClick={toggleBoulderSelect}
									/>
								)}
							</For>
						</ClusterProvider>
						<For each={() => sectors.quarks().toArray()}>
							{(sector) => (
								<SectorAreaMarker
									key={sector().id}
									sector={sector}
									selected={selectedSector.quark() === sector}
									onClick={toggleSectorSelect}
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
								/>
							)}
						</For>
					</MapControl>

					<Show
						when={() =>
							[breakpoint !== "mobile", selectedTrack.quark()] as const
						}
					>
						{([, track]) => (
							<>
								<TrackSlideagainstDesktop
									track={track}
									onClose={() => selectedTrack.select(undefined)}
								/>
								<div className="absolute top-0 z-1000 flex h-full w-full flex-col bg-black bg-opacity-90 md:w-[calc(100%-600px)]">
									<div className="relative flex h-full flex-1 items-center">
										<TracksImage
											sizeHint="100vw"
											image={currentImage}
											tracks={new QuarkIter([track])}
											selectedTrack={selectedTrack}
											displayTracksDetails
										/>
									</div>
								</div>
							</>
						)}
					</Show>

					<Show when={selectedBoulder.quark}>
						{(boulder) => {
							if (breakpoint === "mobile") {
								return (
									<BoulderSlideoverMobile
										open
										boulder={boulder}
										selectedTrack={selectedTrack}
										topoCreatorId={topo.creator?.id}
										currentImage={currentImage}
										setCurrentImage={setCurrentImage}
										onClose={() => {
											selectedTrack.select(undefined);
											selectedBoulder.select(undefined);
										}}
									/>
								);
							} else
								return (
									<BoulderSlideagainstDesktop
										boulder={boulder}
										selectedTrack={selectedTrack}
										topoCreatorId={topo.creator?.id}
										currentImage={currentImage}
										setCurrentImage={setCurrentImage}
										onClose={() => {
											selectedTrack.select(undefined);
											selectedBoulder.select(undefined);
										}}
									/>
								);
						}}
					</Show>

					<Show when={selectedParking.quark}>
						{(parking) => {
							return (
								<ParkingSlide
									open
									parking={parking}
									onClose={() => selectedParking.select(undefined)}
								/>
							);
						}}
					</Show>
					<Show when={selectedWaypoint.quark}>
						{(waypoint) => {
							return (
								<WaypointSlide
									open
									waypoint={waypoint}
									onClose={() => selectedWaypoint.select(undefined)}
								/>
							);
						}}
					</Show>
				</div>
			</>
		);
	}
);

RootTopo.displayName = "RootTopo";
