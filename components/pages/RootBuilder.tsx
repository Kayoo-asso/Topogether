import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
	GeoCoordinates,
	MapToolEnum,
	Topo,
	TopoStatus,
	ClimbTechniques,
} from "types";
import {
	Quark,
	useCreateDerivation,
	useCreateQuark,
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
} from "components/map";
import {
	createBoulder,
	createParking,
	createWaypoint,
} from "helpers/builder";
import { staticUrl } from "helpers/constants";
import {
	useBreakpoint,
	useLoader,
	useModal,
} from "helpers/hooks";
import { sortBoulders, computeBuilderProgress } from "helpers/topo";
import { encodeUUID } from "helpers/utils";
import {
	SlideoverLeftBuilder,
} from "components/organisms/builder/Slideover.left.builder";
import {
	SlideoverRightBuilder,
} from "components/organisms/builder/Slideover.right.builder";
import { BuilderProgressIndicator } from "components/organisms/builder/BuilderProgressIndicator";
import { BuilderDropdown } from "components/organisms/builder/BuilderDropdown";
import { BuilderModalDelete } from "components/organisms/builder/BuilderModalDelete";
import { BuilderMarkers } from "components/organisms/builder/BuilderMarkers";
import { InteractItem, useSelectStore } from "./selectStore";
import { SyncUrl } from "components/organisms/SyncUrl";
import { KeyboardShortcut } from "components/organisms/builder/KeyboardShortcuts";

interface RootBuilderProps {
	topoQuark: Quark<Topo>;
}

export const RootBuilder: React.FC<RootBuilderProps> = watchDependencies(
	(props: RootBuilderProps) => {
		const router = useRouter();
		const session = useSession()!;
		const breakpoint = useBreakpoint();

		const showLoader = useLoader();

		const topo = props.topoQuark();
		const boulderOrder = useCreateDerivation(() =>
			sortBoulders(topo.sectors, topo.lonelyBoulders)
		);

		const isEmptyStore = useSelectStore(s => s.isEmpty);
		const flush = useSelectStore(s => s.flush);
		const select = useSelectStore(s => s.select);

		const [dropdownItem, setDropdownItem] = useState<InteractItem>({ type: 'none', value: undefined });
		const [dropdownPosition, setDropdownPosition] = useState<{
			x: number;
			y: number;
		}>();
		const [deleteItem, setDeleteItem] = useState<InteractItem>({ type: 'none', value: undefined });

		const mapRef = useRef<google.maps.Map>(null);
		const [currentTool, setCurrentTool] = useState<MapToolEnum>();
		
		const [ModalSubmitTopo, showModalSubmitTopo] = useModal();
		const [ModalDeleteTopo, showModalDeleteTopo] = useModal();

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
				<SyncUrl topo={topo} />
				<KeyboardShortcut 
					currentTool={currentTool}
					setCurrentTool={setCurrentTool}
					onDelete={(item) => setDeleteItem(item)}
				/>
				
				<Header
					title={topo.name}
					backLink="/builder/dashboard"
					onBackClick={!isEmptyStore() ? () => flush.all() : undefined}
					menuOptions={[
						{ value: "Infos du topo", action: () => select.info("INFO", breakpoint) },
						{
							value: "Marche d'approche",
							action: () => select.info("ACCESS", breakpoint),
						},
						{
							value: "Gestionnaires du spot",
							action: () => select.info("MANAGEMENT", breakpoint),
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

					<SlideoverLeftBuilder
						topo={props.topoQuark}
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
						onMapZoomChange={() => setDropdownItem({ type: 'none', value: undefined })}
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
					</MapControl>

					<SlideoverRightBuilder
						topo={props.topoQuark}
					/>
				</div>
				
				{dropdownPosition && dropdownItem.type !== 'none' &&
					<BuilderDropdown 
						position={dropdownPosition}
						dropdownItem={dropdownItem}
						setDropdownItem={setDropdownItem}
						setDeleteItem={setDeleteItem}
					/>
				}

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
			</>
		);
	}
);

RootBuilder.displayName = "RootBuilder";
