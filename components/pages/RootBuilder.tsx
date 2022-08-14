import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
	Boulder,
	GeoCoordinates,
	Img,
	MapToolEnum,
	Parking,
	Sector,
	Track,
	Waypoint,
	Topo,
	isUUID,
	TopoStatus,
	ClimbTechniques,
} from "types";
import {
	Quark,
	useCreateDerivation,
	useCreateQuark,
	useLazyQuarkyEffect,
	useQuarkyCallback,
	useSelectQuark,
	watchDependencies,
} from "helpers/quarky";
import { api, sync } from "helpers/services";
import { useFirstRender } from "helpers/hooks/useFirstRender";
import { useSession } from "helpers/services";
import { Header } from "components/layouts/Header";
import { LeftbarBuilderDesktop } from "components/layouts/LeftbarBuilderDesktop";
import {
	BoulderFilterOptions,
	MapControl,
	filterBoulders,
	BoulderMarkerDropdown,
	SectorAreaMarkerDropdown,
	WaypointMarkerDropdown,
	ParkingMarkerDropdown,
	BoulderMarker,
	CreatingSectorAreaMarker,
	isMouseEvent,
	isPointerEvent,
	isTouchEvent,
	ParkingMarker,
	SectorAreaMarker,
	WaypointMarker,
} from "components/map";
import {
	TrackFormSlideagainstDesktop,
	Drawer,
} from "components/organisms";
import {
	BuilderProgressIndicator,
} from "../builder";
import {
	createBoulder,
	createParking,
	createWaypoint,
	createTrack,
	createSector,
	sectorChanged,
	deleteTrack,
} from "helpers/builder";
import { staticUrl } from "helpers/constants";
import {
	useBreakpoint,
	useContextMenu,
	useLoader,
	useModal,
} from "helpers/hooks";
import { toLatLng } from "helpers/map";
import { sortBoulders, computeBuilderProgress } from "helpers/topo";
import { decodeUUID, encodeUUID } from "helpers/utils";
import { Show, For } from "components/atoms";
import { InfoType, SlideoverLeftBuilder } from "components/organisms/builder/Slideover.left.builder";
import { isBoulder, ItemType, SlideoverRightBuilder } from "components/organisms/builder/Slideover.right.builder";

interface RootBuilderProps {
	topoQuark: Quark<Topo>;
}

export const RootBuilder: React.FC<RootBuilderProps> = watchDependencies(
	(props: RootBuilderProps) => {
		const router = useRouter();
		const session = useSession()!;
		const { b: bId } = router.query; // Get boulder id from url if selected
		const breakpoint = useBreakpoint();

		const showLoader = useLoader();

		const topo = props.topoQuark();
		const sectors = topo.sectors;
		const boulders = topo.boulders;
		const parkings = topo.parkings;
		const waypoints = topo.waypoints;
		const boulderOrder = useCreateDerivation(() =>
			sortBoulders(topo.sectors, topo.lonelyBoulders)
		);

		const mapRef = useRef<google.maps.Map>(null);
		const multipleImageInputRef = useRef<HTMLInputElement>(null);
		const [currentTool, setCurrentTool] = useState<MapToolEnum>();
		const [tempCurrentTool, setTempCurrentTool] = useState<MapToolEnum>();
		const [currentImage, setCurrentImage] = useState<Img>();

		const sectorRightClicked = useSelectQuark<Sector>();
        const [ModalDeleteSector, showModalDeleteSector] = useModal<Quark<Sector>>();

		const boulderRightClicked = useSelectQuark<Boulder>();
		const [ModalDeleteBoulder, showModalDeleteBoulder] =
			useModal<Quark<Boulder>>();

		const parkingRightClicked = useSelectQuark<Parking>();
		const [ModalDeleteParking, showModalDeleteParking] =
			useModal<Quark<Parking>>();

		const waypointRightClicked = useSelectQuark<Waypoint>();
		const [ModalDeleteWaypoint, showModalDeleteWaypoint] =
			useModal<Quark<Waypoint>>();

		const [dropdownPosition, setDropdownPosition] = useState<{
			x: number;
			y: number;
		}>();
		const closeDropdown = useCallback(() => {
			boulderRightClicked.select(undefined);
			waypointRightClicked.select(undefined);
			parkingRightClicked.select(undefined);
			sectorRightClicked.select(undefined);
		}, []);
		useContextMenu(closeDropdown);

		const [ModalSubmitTopo, showModalSubmitTopo] = useModal();
		const [ModalDeleteTopo, showModalDeleteTopo] = useModal();
		const [displayModalSectorRename, setDisplayModalSectorRename] = useState(false);

        // TODO
		// Hack: select boulder from query parameter
		// useEffect(() => {
		// 	if (typeof bId === "string") {
		// 		const expanded = decodeUUID(bId);
		// 		if (isUUID(expanded)) {
		// 			const boulder = boulders.findQuark((b) => b.id === expanded);
		// 			if (boulder) toggleBoulderSelect(boulder);
		// 		}
		// 	}
		// }, []);

		// useLazyQuarkyEffect(
		// 	([selectedB]) => {
		// 		if (selectedB)
		// 			router.push(
		// 				{
		// 					pathname: window.location.href.split("?")[0],
		// 					query: { b: encodeUUID(selectedB.id) },
		// 				},
		// 				undefined,
		// 				{ shallow: true }
		// 			);
		// 		else
		// 			router.push(
		// 				{ pathname: window.location.href.split("?")[0] },
		// 				undefined,
		// 				{
		// 					shallow: true,
		// 				}
		// 			);
		// 	},
		// 	[selectedBoulder]
		// );

		const displayBoulderDropdown = (e: Event, boulderQuark: Quark<Boulder>) => {
			if (isMouseEvent(e) || isPointerEvent(e))
				setDropdownPosition({ x: e.pageX, y: e.pageY });
			else if (isTouchEvent(e))
				setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
			boulderRightClicked.select(boulderQuark);
		};
		const displayWaypointDropdown = useCallback(
			(e: Event, waypointQuark: Quark<Waypoint>) => {
				if (isMouseEvent(e) || isPointerEvent(e))
					setDropdownPosition({ x: e.pageX, y: e.pageY });
				else if (isTouchEvent(e))
					setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
				waypointRightClicked.select(waypointQuark);
			},
			[]
		);
		const displayParkingDropdown = useCallback(
			(e: Event, parkingQuark: Quark<Parking>) => {
				if (isMouseEvent(e) || isPointerEvent(e))
					setDropdownPosition({ x: e.pageX, y: e.pageY });
				else if (isTouchEvent(e))
					setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
				parkingRightClicked.select(parkingQuark);
			},
			[]
		);
		const displaySectorDropdown = useCallback(
			(e: Event, sectorQuark: Quark<Sector>) => {
				if (isMouseEvent(e) || isPointerEvent(e))
					setDropdownPosition({ x: e.pageX, y: e.pageY });
				else if (isTouchEvent(e))
					setDropdownPosition({ x: e.touches[0].pageX, y: e.touches[0].pageY });
				sectorRightClicked.select(sectorQuark);
			},
			[]
		);

		const handleCreateNewMarker = useCallback(
			(e) => {
				if (e.latLng) {
					const loc: GeoCoordinates = [e.latLng.lng(), e.latLng.lat()];
					switch (currentTool) {
						case "ROCK":
							createBoulder(props.topoQuark, loc);
							break;
						case "PARKING":
							createParking(topo, loc);
							break;
						case "WAYPOINT":
							createWaypoint(topo, loc);
							break;
						// case 'SECTOR' is handled by inserting a CreatingSectorAreaMarker component
						default:
							break;
					}
				}
			},
			[topo, currentTool, createBoulder, createParking, createWaypoint]
		);
        
        // TODO
		// useEffect(() => {
		// 	const handleKeyDown = (e: KeyboardEvent) => {
		// 		if (e.code === "Escape") {
		// 			// TODO: change this, we first wish to cancel any ongoing action,
		// 			// then set the current tool to undefined
		// 			if (currentTool) setCurrentTool(undefined);
		// 			else if (
		// 				(breakpoint !== "mobile" || displayDrawer) &&
		// 				selectedBoulder() &&
		// 				selectedTrack()
		// 			)
		// 				return; //If the Drawer is open, Escape should only deactivate Drawer tools
		// 			else {
		// 				selectedSector.select(undefined);
		// 				selectedBoulder.select(undefined);
		// 				selectedTrack.select(undefined);
		// 				selectedParking.select(undefined);
		// 				selectedWaypoint.select(undefined);
		// 			}
		// 		}
		// 		// TODO : Add a check to know if we are on the map and not in an input or textarea in a form, to avoid deleting items when we just want to delete characters
		// 		// else if (e.code === 'Delete') {
		// 		//     if (selectedSector()) showModalDeleteSector(selectedSector.quark()!);
		// 		//     else if (selectedBoulder()) showModalDeleteBoulder(selectedBoulder.quark()!);
		// 		//     else if (selectedParking()) showModalDeleteParking(selectedParking.quark()!);
		// 		//     else if (selectedWaypoint()) showModalDeleteWaypoint(selectedWaypoint.quark()!);
		// 		// }
		// 		else if (e.code === "Space" && currentTool) {
		// 			setTempCurrentTool(currentTool);
		// 			setCurrentTool(undefined);
		// 		}
		// 	};
		// 	const handleKeyUp = (e: KeyboardEvent) => {
		// 		if (e.code === "Space" && tempCurrentTool) {
		// 			setCurrentTool(tempCurrentTool);
		// 			setTempCurrentTool(undefined);
		// 		}
		// 	};
		// 	window.addEventListener("keydown", handleKeyDown);
		// 	window.addEventListener("keyup", handleKeyUp);
		// 	return () => {
		// 		window.removeEventListener("keydown", handleKeyDown);
		// 		window.removeEventListener("keyup", handleKeyUp);
		// 	};
		// }, [currentTool, tempCurrentTool]);

        // TODO
		// const handleNewPhoto = useCallback(
		// 	(img: Img, coords: GeoCoordinates) => {
		// 		if (!coords) {
		// 			console.log("no coords");
		// 			return;
		// 		}
		// 		if (img) {
		// 			setCurrentImage(img);
		// 			if (currentTool === "PARKING") {
		// 				selectedParking.select(createParking(topo, coords, img));
		// 			} else if (currentTool === "WAYPOINT") {
		// 				selectedWaypoint.select(createWaypoint(topo, coords, img));
		// 			} else {
		// 				const sBoulder = selectedBoulder();
		// 				if (sBoulder) {
		// 					const newImages = sBoulder.images;
		// 					newImages.push(img);
		// 					selectedBoulder.quark()!.set((b) => ({
		// 						...b,
		// 						images: newImages,
		// 					}));
		// 					selectedTrack.select(createTrack(sBoulder, session.id));
		// 				} else {
		// 					const newBoulderQuark = createBoulder(
		// 						props.topoQuark,
		// 						coords,
		// 						img
		// 					);
		// 					selectedTrack.select(createTrack(newBoulderQuark(), session.id));
		// 					selectedBoulder.select(newBoulderQuark);
		// 				}
		// 				setDisplayDrawer(true);
		// 			}
		// 		}
		// 	},
		// 	[topo, selectedParking(), selectedWaypoint(), selectedBoulder()]
		// );

		const progress = useCreateDerivation<number>(
			() => computeBuilderProgress(props.topoQuark),
			[props.topoQuark]
		);

		const maxTracks = useCreateDerivation<number>(() => {
			return boulders
				.toArray()
				.map((b) => b.tracks.length)
				.reduce((a, b) => a + b, 0);
		}, [boulders]);
		const defaultBoulderFilterOptions: BoulderFilterOptions = {
			techniques: ClimbTechniques.None,
			tracksRange: [0, maxTracks()],
			gradeRange: [3, 9],
			mustSee: false,
		};
		const boulderFilters = useCreateQuark<BoulderFilterOptions>(
			defaultBoulderFilterOptions
		);
		useEffect(() => {
			const max = maxTracks();
			if (max !== boulderFilters().tracksRange[1]) {
				boulderFilters.set((opts) => ({
					...opts,
					tracksRange: [opts.tracksRange[0], max],
				}));
			}
		}, [maxTracks()]);

                
        const [selectedInfo, setSelectedInfo] = useState<InfoType>();
        const [selectedItem, setSelectedItem] = useState<ItemType>();
        const selectedTrack = useSelectQuark<Track>();

        const [displayDrawer, setDisplayDrawer] = useState<boolean>(false);

		return (
			<>
				<Header
					title={topo.name}
					backLink="/builder/dashboard"
					onBackClick={undefined} //TO-REDO
					menuOptions={[ //TODO
						{ value: "Infos du topo", action: () => setSelectedInfo('INFO') },
						{
							value: "Marche d'approche",
							action: () => setSelectedInfo('ACCESS'),
						},
						{
							value: "Gestionnaires du spot",
							action: () => setSelectedInfo('MANAGEMENT'),
						},
						...session.role === 'ADMIN' ? [{
							value:  "Voir le topo",
							action: () => router.push("/topo/" + encodeUUID(topo.id))
						}] : [],
						{ value: "Valider le topo", action: () => showModalSubmitTopo() },
						{ value: "Supprimer le topo", action: () => showModalDeleteTopo() },
					]}
				>
					<BuilderProgressIndicator
						topo={props.topoQuark}
						progress={progress()}
						displayInfosTopo={() => {}} //TODO
						displayInfosApproach={() => {}} //TODO
					/>
				</Header>

				{/* overflow-clip instead of overflow-hidden, so that the Slideagainst can appear off-screen without 
                triggering a shift of content in this div */}
				<div className="relative flex h-content flex-row md:h-contentPlusShell md:overflow-clip">
                    <LeftbarBuilderDesktop
						topoQuark={props.topoQuark}
						boulderOrder={boulderOrder()}
						selectedBoulder={(selectedItem && isBoulder(selectedItem)) ? selectedItem : undefined}
						onBoulderSelect={(boulderQuark) => {
							setSelectedItem(boulderQuark);
							mapRef.current?.setCenter(toLatLng(boulderQuark().location));
						}}
						onTrackSelect={(trackQuark, boulderQuark) => {
							selectedTrack.select(trackQuark);
							setSelectedItem(boulderQuark);
						}}
						onSubmit={showModalSubmitTopo}
						activateSubmission={progress() === 100}
						onDeleteBoulder={showModalDeleteBoulder}
					/>

                    <SlideoverLeftBuilder 
                        topo={props.topoQuark}
                        selected={selectedInfo}
                        onClose={() => setSelectedInfo(undefined)}
                    />

					<MapControl
						ref={mapRef}
						initialZoom={16}
						initialCenter={topo.location}
						displaySectorButton
						onSectorButtonClick={() => {}} //TODO
						searchbarOptions={{
							findBoulders: true,
							focusOnOpen: true,
						}}
						onBoulderResultSelect={(boulder) => {}} //TODO
						currentTool={currentTool}
						onToolSelect={(tool) =>
							tool === currentTool
								? setCurrentTool(undefined)
								: setCurrentTool(tool)
						}
						// onNewPhoto={handleNewPhoto}
						draggableCursor={
							currentTool === "ROCK"
								? "url(/assets/icons/colored/_rock.svg) 16 32, auto"
								: currentTool === "SECTOR"
								? "url(/assets/icons/colored/line-point/_line-point-grey.svg), auto"
								: currentTool === "PARKING"
								? "url(/assets/icons/colored/_parking.svg) 16 30, auto"
								: currentTool === "WAYPOINT"
								? "url(/assets/icons/colored/_help-round.svg) 16 30, auto"
								: ""
						}
						topo={props.topoQuark}
						boulderFilters={boulderFilters}
						boulderFiltersDomain={defaultBoulderFilterOptions}
						onMapZoomChange={closeDropdown}
						onClick={handleCreateNewMarker}
						boundsTo={boulders
							.map((b) => b.location)
							.concat(parkings.map((p) => p.location))
							.toArray()}
					>
						{currentTool === "SECTOR" && (
							<CreatingSectorAreaMarker
								onComplete={(path) => {
									const sector = createSector(
										props.topoQuark,
										path,
										boulderOrder()
									);
									// selectedSector.select(sector); //TODO
									setDisplayModalSectorRename(true);
									setCurrentTool(undefined);
								}}
							/>
						)}
                        {/* TODO */}
						{/* <For each={() => filterBoulders(boulders.quarks(), boulderFilters())}>
							{(boulder) => (
								<BoulderMarker
									key={boulder().id}
									boulder={boulder}
									boulderOrder={boulderOrder()}
									selectedBoulder={selectedBoulder}
									topo={props.topoQuark}
									onClick={toggleBoulderSelect}
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
						</For> */}
					</MapControl>

                    <SlideoverRightBuilder 
                        topo={props.topoQuark}
                        selected={selectedItem}
                        selectedTrack={selectedTrack}
                        currentImage={currentImage}
                        setCurrentImage={setCurrentImage}
                        setDisplayDrawer={setDisplayDrawer}
                        onClose={() => setSelectedItem(undefined)}
                    />

					<ModalSubmitTopo
						buttonText="Confirmer"
						imgUrl={staticUrl.defaultProfilePicture}
						onConfirm={async () => {
							showLoader(true);
							props.topoQuark.set({
								...topo,
								status: TopoStatus.Submitted,
							});
							await sync.attemptSync();
							router.push("/builder/dashboard");
						}}
					>
						Le topo sera envoyé en validation. Etes-vous sûr de vouloir
						continuer ?
					</ModalSubmitTopo>
					<ModalDeleteTopo
						buttonText="Confirmer"
						imgUrl={staticUrl.deleteWarning}
						onConfirm={async () => {
							showLoader(true);
							api.deleteTopo(topo);
							await sync.attemptSync();
							router.push("/builder/dashboard");
						}}
					>
						Le topo sera entièrement supprimé. Etes-vous sûr de vouloir
						continuer ?
					</ModalDeleteTopo>
				</div>
                
                {/* TODO */}
				{/* <Show when={() => boulderRightClicked.quark()}>
					{(quarkBoulder) => (
						<BoulderMarkerDropdown
							position={dropdownPosition}
							toggleTrackSelect={toggleTrackSelect}
							boulder={quarkBoulder}
							multipleImageInputRef={multipleImageInputRef}
							deleteBoulder={showModalDeleteBoulder}
							onSelect={() => boulderRightClicked.select(undefined)}
							onAddImageClick={() => {
								if (
									!selectedBoulder() ||
									selectedBoulder()?.id !== quarkBoulder().id
								)
									toggleBoulderSelect(quarkBoulder);
								setTimeout(() => {
									if (multipleImageInputRef?.current)
										multipleImageInputRef.current.click();
								}, 5);
							}}
						/>
					)}
				</Show>

				<Show when={() => sectorRightClicked.quark()}>
					{(quarkSector) => (
						<SectorAreaMarkerDropdown
							position={dropdownPosition}
							sector={quarkSector}
							deleteSector={showModalDeleteSector}
							renameSector={() => {
								selectedSector.select(quarkSector);
								setDisplayModalSectorRename(true);
							}}
							onSelect={() => sectorRightClicked.select(undefined)}
						/>
					)}
				</Show>

				<Show when={() => waypointRightClicked.quark()}>
					{(quarkWaypoint) => (
						<WaypointMarkerDropdown
							position={dropdownPosition}
							waypoint={quarkWaypoint}
							deleteWaypoint={showModalDeleteWaypoint}
							onSelect={() => waypointRightClicked.select(undefined)}
						/>
					)}
				</Show>

				<Show when={() => parkingRightClicked.quark()}>
					{(quarkParking) => (
						<ParkingMarkerDropdown
							position={dropdownPosition}
							parking={quarkParking}
							deleteParking={showModalDeleteParking}
							onSelect={() => parkingRightClicked.select(undefined)}
						/>
					)}
				</Show> */}

                {/* TODO */}
				{/* <Show
					when={() =>
						[
							breakpoint !== "mobile" || displayDrawer,
							selectedBoulder(),
							selectedTrack(),
						] as const
					}
				>
					{([, sBoulder, sTrack]) => (
						<Drawer
							image={
								sBoulder.images.find(
									(img) => img.id === sTrack.lines.lazy().toArray()[0]?.imageId
								) || currentImage!
							}
							tracks={sBoulder.tracks}
							selectedTrack={selectedTrack}
							open
							onValidate={() => setDisplayDrawer(false)}
						/>
					)}
				</Show> */}

                {/* TODO */}
				{/* <ModalDeleteSector
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={(sector) => {
						topo.sectors.removeQuark(sector);
						if (selectedSector.quark() === sector)
							selectedSector.select(undefined);
					}}
				>
					Êtes-vous sûr de vouloir supprimer le secteur ?
				</ModalDeleteSector>
				<ModalDeleteBoulder
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={(boulderQuark) => {
						topo.boulders.removeQuark(boulderQuark);
						const boulder = boulderQuark();
						const sectorWithBoulder = sectors.findQuark((s) =>
							s.boulders.some((id) => id === boulder.id)
						);
						if (sectorWithBoulder)
							//The boulder to delete is in a sector
							sectorWithBoulder.set((s) => ({
								...s,
								boulders: s.boulders.filter((id) => id !== boulder.id),
							}));
						else {
							//The boulder to delete is in lonelyboulders
							props.topoQuark.set((t) => ({
								...t,
								lonelyBoulders: t.lonelyBoulders.filter(
									(id) => id !== boulder.id
								),
							}));
						}
						if (selectedBoulder.quark() === boulderQuark)
							selectedBoulder.select(undefined);
					}}
				>
					Êtes-vous sûr de vouloir supprimer le bloc et toutes les voies
					associées ?
				</ModalDeleteBoulder>
				<ModalDeleteParking
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={(parking) => {
						topo.parkings.removeQuark(parking);
						if (selectedParking.quark() === parking)
							selectedParking.select(undefined);
					}}
				>
					Êtes-vous sûr de vouloir supprimer le parking ?
				</ModalDeleteParking>
				<ModalDeleteWaypoint
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={(waypoint) => {
						topo.waypoints.removeQuark(waypoint);
						if (selectedWaypoint.quark() === waypoint)
							selectedWaypoint.select(undefined);
					}}
				>
					Êtes-vous sûr de vouloir supprimer le point de repère ?
				</ModalDeleteWaypoint> */}

			</>
		);
	}
);

RootBuilder.displayName = "RootBuilder";
