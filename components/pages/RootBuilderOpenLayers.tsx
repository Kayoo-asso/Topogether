import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
	GeoCoordinates,
	MapToolEnum,
	Topo,
	TopoStatus,
	ClimbTechniques,
	UUID,
	isUUID,
} from "types";
import {
	Quark,
	useCreateDerivation,
	useCreateQuark,
	useLazyQuarkyEffect,
	watchDependencies,
} from "helpers/quarky";
import { api, sync } from "helpers/services";
import { useSession } from "helpers/services";
import { Header } from "components/layouts/Header";
import { LeftbarBuilderDesktop } from "components/layouts/LeftbarBuilderDesktop";
import {
	BoulderFilterOptions,
	MapControl,
	CreatingSectorAreaMarker,
	filterBoulders,
} from "components/map";
import { createBoulder, createParking, createWaypoint } from "helpers/builder";
import { fontainebleauLocation, staticUrl } from "helpers/constants";
import { useBreakpoint, useLoader, useModal } from "helpers/hooks";
import { sortBoulders, computeBuilderProgress } from "helpers/topo";
import { decodeUUID, encodeUUID } from "helpers/utils";
import { SlideoverLeftBuilder } from "components/organisms/builder/Slideover.left.builder";
import { SlideoverRightBuilder } from "components/organisms/builder/Slideover.right.builder";
import { BuilderProgressIndicator } from "components/organisms/builder/BuilderProgressIndicator";
import { BuilderDropdown } from "components/organisms/builder/BuilderDropdown";
import { BuilderModalDelete } from "components/organisms/builder/BuilderModalDelete";
import { BuilderMarkers } from "components/organisms/builder/BuilderMarkers";
import {
	InteractItem,
	SelectedInfo,
	SelectedItem,
	useSelectStore,
} from "./selectStore";
import { isOnMap } from "helpers/map";
import { updateUrl } from "helpers/updateUrl";
import { Map } from "components/map/ol/Map";
import { UserMarker } from "components/map/ol/UserMarker";
import { BoulderMarker } from "components/map/ol/BoulderMarker";
import { For } from "components/atoms/utils";

interface RootBuilderProps {
	topoQuark: Quark<Topo>;
}

export const RootBuilderOpenLayers: React.FC<RootBuilderProps> =
	watchDependencies((props: RootBuilderProps) => {
		const router = useRouter();
		const session = useSession()!;
		const breakpoint = useBreakpoint();

		const showLoader = useLoader();

		const topo = props.topoQuark();
		const boulderOrder = useCreateDerivation(() =>
			sortBoulders(topo.sectors, topo.lonelyBoulders)
		);

		const isEmptyStore = useSelectStore((s) => s.isEmpty);
		const selectedItem = useSelectStore((s) => s.item);
		const selectedInfo = useSelectStore((s) => s.info);
		const flush = useSelectStore((s) => s.flush);
		const select = useSelectStore((s) => s.select);
		const selectInfo = (i: SelectedInfo) => {
			if (breakpoint === "mobile") flush.item();
			select.info(i);
		};

		const [dropdownItem, setDropdownItem] = useState<InteractItem>({
			type: "none",
			value: undefined,
		});
		const [dropdownPosition, setDropdownPosition] = useState<{
			x: number;
			y: number;
		}>();
		const [deleteItem, setDeleteItem] = useState<InteractItem>({
			type: "none",
			value: undefined,
		});

		const mapRef = useRef<google.maps.Map>(null);
		const [currentTool, setCurrentTool] = useState<MapToolEnum>();
		const [tempCurrentTool, setTempCurrentTool] = useState<MapToolEnum>();

		const [ModalSubmitTopo, showModalSubmitTopo] = useModal();
		const [ModalDeleteTopo, showModalDeleteTopo] = useModal();

		// TODO
		// Hack: select boulder from query parameter
		useEffect(() => {
			const { i, p, w, b, t } = router.query;
			if (p) {
				const pId = decodeUUID(p as string);
				if (isUUID(pId)) {
					const pQ = topo.parkings.findQuark((p) => p.id === pId);
					if (pQ) select.parking(pQ);
				}
			} else if (w) {
				const wId = decodeUUID(w as string);
				if (isUUID(wId)) {
					const wQ = topo.waypoints.findQuark((w) => w.id === wId);
					if (wQ) select.waypoint(wQ);
				}
			}
			if (b) {
				const bId = decodeUUID(b as string);
				if (isUUID(bId)) {
					const bQ = topo.boulders.findQuark((b) => b.id === bId);
					if (bQ) {
						if (t) {
							const tId = decodeUUID(t as string);
							if (isUUID(tId)) {
								const tQ = bQ().tracks.findQuark((t) => t.id === tId);
								if (tQ) select.track(tQ, bQ);
							}
						} else select.boulder(bQ);
					}
				}
			}
			if (i) selectInfo(i as SelectedInfo);
		}, []);

		useEffect(() => {
			updateUrl(selectedInfo, selectedItem, router);
		}, [selectedInfo, selectedItem]);

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

		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.code === "Escape") {
					// TODO: change this, we first wish to cancel any ongoing action,
					// then set the current tool to undefined
					if (currentTool) setCurrentTool(undefined);
					else flush.all();
				} else if (e.code === "Delete" && isOnMap(e))
					setDeleteItem(selectedItem);
				else if (e.code === "Space" && currentTool) {
					setTempCurrentTool(currentTool);
					setCurrentTool(undefined);
				}
			};
			const handleKeyUp = (e: KeyboardEvent) => {
				if (e.code === "Space" && tempCurrentTool) {
					setCurrentTool(tempCurrentTool);
					setTempCurrentTool(undefined);
				}
			};
			window.addEventListener("keydown", handleKeyDown);
			window.addEventListener("keyup", handleKeyUp);
			return () => {
				window.removeEventListener("keydown", handleKeyDown);
				window.removeEventListener("keyup", handleKeyUp);
			};
		}, [currentTool, tempCurrentTool]);

		const progress = useCreateDerivation<number>(
			() => computeBuilderProgress(props.topoQuark),
			[props.topoQuark]
		);

		const maxTracks = useCreateDerivation<number>(() => {
			return topo.boulders
				.toArray()
				.map((b) => b.tracks.length)
				.reduce((a, b) => a + b, 0);
		}, [topo.boulders]);
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

		return (
			<>
				<Header
					title={topo.name}
					backLink="/builder/dashboard"
					onBackClick={!isEmptyStore() ? () => flush.all() : undefined}
					menuOptions={[
						{ value: "Infos du topo", action: () => selectInfo("INFO") },
						{
							value: "Marche d'approche",
							action: () => selectInfo("ACCESS"),
						},
						{
							value: "Gestionnaires du spot",
							action: () => selectInfo("MANAGEMENT"),
						},
						...(session.role === "ADMIN"
							? [
									{
										value: "Voir le topo",
										action: () => router.push("/topo/" + encodeUUID(topo.id)),
									},
							  ]
							: []),
						{ value: "Valider le topo", action: () => showModalSubmitTopo() },
						{ value: "Supprimer le topo", action: () => showModalDeleteTopo() },
					]}
				>
					<BuilderProgressIndicator
						topo={props.topoQuark}
						progress={progress()}
					/>
				</Header>

				{/* overflow-clip instead of overflow-hidden, so that the Slideagainst can appear off-screen without 
                triggering a shift of content in this div */}
				<div className="relative flex h-content flex-row md:h-contentPlusShell md:overflow-clip">
					<LeftbarBuilderDesktop
						topoQuark={props.topoQuark}
						boulderOrder={boulderOrder()}
						map={mapRef.current}
						onSubmit={showModalSubmitTopo}
						activateSubmission={progress() === 100}
					/>

					<SlideoverLeftBuilder topo={props.topoQuark} />

					<Map initialCenter={topo.location}>
						<UserMarker	/>

            <For each={() => filterBoulders(topo.boulders.quarks(), boulderFilters())}>
                {(boulder) => (
                    <BoulderMarker
                        key={boulder().id}
                        boulder={boulder}
                        boulderOrder={boulderOrder()}
                        selectedBoulder={selectedItem.type === 'boulder' ? selectedItem.value : undefined}
                        topo={props.topoQuark}
                        onClick={(boulderQuark) => select.boulder(boulderQuark)}
                        // onContextMenu={(e, b) => setDropdown(e, { type: 'boulder', value: b })}
                        draggable={selectedItem.type === 'boulder' && selectedItem.value === boulder}
                    />
                )}
            </For>
						{/* TODO: put everything into BuilderMarkers */}
					</Map>
					{/* <MapControl
						ref={mapRef}
						initialZoom={16}
						initialCenter={topo.location}
						displaySectorButton
						onSectorButtonClick={() => {}} //TODO
						searchbarOptions={{
							findBoulders: true,
							focusOnOpen: true,
						}}
						currentTool={currentTool}
						onToolSelect={(tool) =>
							tool === currentTool
								? setCurrentTool(undefined)
								: setCurrentTool(tool)
						}
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
						onMapZoomChange={() =>
							setDropdownItem({ type: "none", value: undefined })
						}
						onClick={handleCreateNewMarker}
						boundsTo={topo.boulders
							.map((b) => b.location)
							.concat(topo.parkings.map((p) => p.location))
							.toArray()}
					>
						{currentTool === "SECTOR" && (
							<CreatingSectorAreaMarker
								topoQuark={props.topoQuark}
								boulderOrder={boulderOrder()}
								onComplete={(path) => {
									// selectedSector.select(sector); //TODO
									setCurrentTool(undefined);
								}}
							/>
						)}

						<BuilderMarkers
							topoQuark={props.topoQuark}
							boulderFilters={boulderFilters}
							boulderOrder={boulderOrder()}
							setDropdownItem={setDropdownItem}
							setDropdownPosition={setDropdownPosition}
						/>
					</MapControl> */}

					<SlideoverRightBuilder topo={props.topoQuark} />
				</div>

				{dropdownPosition && dropdownItem.type !== "none" && (
					<BuilderDropdown
						position={dropdownPosition}
						dropdownItem={dropdownItem}
						setDropdownItem={setDropdownItem}
						setDeleteItem={setDeleteItem}
					/>
				)}

				<BuilderModalDelete
					topo={props.topoQuark}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
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
					Le topo sera envoyé en validation. Etes-vous sûr de vouloir continuer
					?
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
					Le topo sera entièrement supprimé. Etes-vous sûr de vouloir continuer
					?
				</ModalDeleteTopo>
			</>
		);
	});

RootBuilderOpenLayers.displayName = "RootBuilder";
