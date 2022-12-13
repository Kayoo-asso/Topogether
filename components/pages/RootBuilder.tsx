import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
	GeoCoordinates,
	Topo,
	TopoStatus,
	TrackDanger,
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
import { DropdownOption } from "components/molecules";
import { Flash } from "components/atoms/overlays";
import { NetworkIndicator } from "components/atoms/NetworkIndicator";
import { MapControl2 } from "components/map/MapControl2";
import { Map, MapBrowserEvent } from "ol";
import { toLonLat } from "ol/proj";
import { SectorAreaMarkersLayer } from "components/map/markers/SectorAreaMarkersLayer";
import { BoulderMarkersLayer } from "components/map/markers/BoulderMarkersLayer";

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
		const tool = useSelectStore(s => s.tool);

		const [dropdownItem, setDropdownItem] = useState<InteractItem>({ type: 'none', value: undefined });
		const [dropdownPosition, setDropdownPosition] = useState<{
			x: number;
			y: number;
		}>();
		const [deleteItem, setDeleteItem] = useState<InteractItem>({ type: 'none', value: undefined });

		const mapRef = useRef<Map>(null);
		
		const [ModalSubmitTopo, showModalSubmitTopo] = useModal();
		const [ModalDeleteTopo, showModalDeleteTopo] = useModal();

		const constructMenuOptions = useCallback((): DropdownOption[] => ([
			{ value: "Infos du topo", action: () => select.info("INFO", breakpoint) },
			{
				value: "Marche d'approche",
				action: () => select.info("ACCESS", breakpoint),
			},
			{
				value: "Gestionnaires du spot",
				action: () => select.info("MANAGEMENT", breakpoint),
			},
			{
				value: "Contributeurs",
				action: () => select.info("CONTRIBUTORS", breakpoint),
			},
			{
				value: "",
				isSection: true,
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
		]), [breakpoint, router, topo, session.role]);

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
			spec: TrackDanger.None,
			tracksRange: [0, maxTracks()],
			gradeRange: [3, 9],
			mustSee: false,
		};
		const boulderFilters = useCreateQuark<BoulderFilterOptions>(
			defaultBoulderFilterOptions
		);
		const isFilterEmpty = () => {
			const fl = boulderFilters();
			return (fl.spec === TrackDanger.None && !fl.mustSee && fl.gradeRange[0] === 3 && fl.gradeRange[1] === 9 && fl.tracksRange[0] === 0 && fl.tracksRange[1] === maxTracks())
		}
		useEffect(() => {
			const max = maxTracks();
			if (max !== boulderFilters().tracksRange[1]) {
				boulderFilters.set((opts) => ({
					...opts,
					tracksRange: [opts.tracksRange[0], max],
				}));
			}
		}, [maxTracks()]);

		const [flashOpen, setFlashOpen] = useState(false);
		const handleCreateNewMarker = useCallback(
			(e: MapBrowserEvent<MouseEvent>) => {
				if (!isEmptyStore()) {
					flush.info();
					flush.item();
				}
				else if (e.coordinate) {
					const lonlat = toLonLat(e.coordinate)
					const loc: GeoCoordinates = [lonlat[0], lonlat[1]];
					switch (tool) {
						case "ROCK":
							if (!isFilterEmpty()) setFlashOpen(true);
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
			[topo, tool, createBoulder, createParking, createWaypoint, isEmptyStore(), isFilterEmpty()]
		);

		return (
			<>
				<SyncUrl topo={topo} />
				<KeyboardShortcut 
					onDelete={(item) => setDeleteItem(item)}
				/>
				
				<Header
					title={topo.name}
					backLink="/builder/dashboard"
					onBackClick={flush.all}
					menuOptions={constructMenuOptions()}
				>
					<BuilderProgressIndicator
						topo={props.topoQuark()}
						progress={progress()}
					/>
					<div className="md:pl-8"><NetworkIndicator /></div>
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
						boulderOrder={boulderOrder()}
						map={mapRef.current}
					/>

					<MapControl2 
						ref={mapRef}
						topo={props.topoQuark}
						initialZoom={16}
						initialCenter={topo.location}
						displaySectorButton
						onSectorButtonClick={() => select.info("SECTOR", breakpoint)}
						searchbarOptions={{
							findBoulders: true,
							focusOnOpen: true,
						}}
						displayToolSelector
						boulderFilters={boulderFilters}
						boulderFiltersDomain={defaultBoulderFilterOptions}
						onClick={handleCreateNewMarker}
					>
						<SectorAreaMarkersLayer
							topoQuark={props.topoQuark}
							boulderOrder={boulderOrder()}
							selectable
							creating={tool === "SECTOR"}
						/>
						<BoulderMarkersLayer 
							boulders={props.topoQuark().boulders}
							boulderOrder={boulderOrder()}
							// draggable
						/>

					</MapControl2>

					{/* <MapControl
						ref={mapRef}
						initialZoom={16}
						initialCenter={topo.location}
						displaySectorButton
						onSectorButtonClick={() => select.info("SECTOR", breakpoint)}
						searchbarOptions={{
							findBoulders: true,
							focusOnOpen: true,
						}}
						displayToolSelector
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
						
						{tool === "SECTOR" && (
							<CreatingSectorAreaMarker
								topoQuark={props.topoQuark}
								boulderOrder={boulderOrder()}
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

					<SlideoverRightBuilder
						topo={props.topoQuark}
					/>

				</div>

				<BuilderDropdown 
					position={dropdownPosition}
					dropdownItem={dropdownItem}
					setDropdownItem={setDropdownItem}
					setDeleteItem={setDeleteItem}
				/>

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

				<Flash 
					open={flashOpen}
					onClose={() => setFlashOpen(false)}
				>Attention ! Des filtres sont activés et peuvent masquer les nouveaux blocs.</Flash>
			</>
		);
	}
);

RootBuilder.displayName = "RootBuilder";
