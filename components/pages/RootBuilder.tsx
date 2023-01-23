import React, { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
	GeoCoordinates,
	Topo,
	TopoStatus,
} from "types";
import {
	Quark,
	useCreateDerivation,
	watchDependencies,
} from "helpers/quarky";
import { api, sync } from "helpers/services";
import { useSession } from "helpers/services";
import { Header } from "components/layouts/Header";
import { LeftbarBuilderDesktop } from "components/layouts/LeftbarBuilderDesktop";
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
import { InteractItem, useSelectStore } from "./selectStore";
import { SyncUrl } from "components/organisms/SyncUrl";
import { KeyboardShortcut } from "components/organisms/builder/KeyboardShortcuts";
import { DropdownOption } from "components/molecules";
import { Flash } from "components/atoms/overlays";
import { NetworkIndicator } from "components/atoms/NetworkIndicator";
import { MapControl } from "components/map/MapControl";
import { Map, MapBrowserEvent } from "ol";
import { toLonLat } from "ol/proj";
import { SectorAreaMarkersLayer } from "components/map/markers/SectorAreaMarkersLayer";
import { BoulderMarkersLayer } from "components/map/markers/BoulderMarkersLayer";
import { ParkingMarkersLayer } from "components/map/markers/ParkingMarkersLayer";
import { WaypointMarkersLayer, disappearZoom } from "components/map/markers/WaypointMarkersLayer";
import { CreatingMarkersLayer } from "components/map/markers/CreatingMarkersLayer";
import { SelectInteraction } from "components/map/markers/SelectInteraction";
import { DragInteraction } from "components/map/markers/DragInteraction";
import { SearchbarBouldersDesktop } from "components/map/searchbar/SearchbarBoulders.desktop";
import { useBouldersFilters } from "components/map/filters/useBouldersFilters";
import { BouldersFiltersDesktop } from "components/map/filters/BouldersFilters.desktop";

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
		const boulderOrder = sortBoulders(topo.sectors, topo.lonelyBoulders)

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

		const menuOptions = useMemo((): DropdownOption[] => ([
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

		const [flashOpen, setFlashOpen] = useState(false);
		const handleCreateNewMarker = useCallback(
			(e: MapBrowserEvent<any>, filtersEmpty) => {
				e.preventDefault(); e.stopPropagation();
				if (!isEmptyStore()) {
					flush.info();
					flush.item();
				}
				else if (e.coordinate) {
					const lonlat = toLonLat(e.coordinate)
					const loc: GeoCoordinates = [lonlat[0], lonlat[1]];
					switch (tool) {
						case "ROCK":
							if (!filtersEmpty) setFlashOpen(true);
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
			[topo, tool, createBoulder, createParking, createWaypoint, isEmptyStore()]
		);

		const SearchbarDesktop: React.FC = () =>
			<SearchbarBouldersDesktop 
				topo={props.topoQuark}
				boulderOrder={boulderOrder}
				map={mapRef.current}
			/>
		const [Filters, filterBoulders, resetFilters, areFiltersEmpty] = useBouldersFilters(topo);
		const FiltersDesktop: React.FC = () => <BouldersFiltersDesktop Filters={Filters} onResetClick={resetFilters} />;

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
					menuOptions={menuOptions}
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
						boulderOrder={boulderOrder}
						map={mapRef.current}
						onSubmit={showModalSubmitTopo}
						activateSubmission={progress() === 100}
					/>

					<SlideoverLeftBuilder
						topo={props.topoQuark}
						boulderOrder={boulderOrder}
						map={mapRef.current}
						Filters={Filters}
						onFilterReset={resetFilters}
					/>

					<MapControl 
						ref={mapRef}
						topo={props.topoQuark}
						initialZoom={16}
						minZoom={disappearZoom - 1}
						initialCenter={topo.location}
						displayToolSelector
						Searchbar={SearchbarDesktop}
						Filters={FiltersDesktop}
					>
						{tool && tool !== "SECTOR" &&
							<CreatingMarkersLayer 
								boulderOrder={boulderOrder}
								onCreate={(e) => handleCreateNewMarker(e, areFiltersEmpty)}
							/>
						}
						<SelectInteraction
							boulderOrder={boulderOrder}
							selectableSector
						/>
						<DragInteraction 
							topoQuark={props.topoQuark}
							boulderOrder={boulderOrder}
						/>
						<SectorAreaMarkersLayer
							topoQuark={props.topoQuark}
							boulderOrder={boulderOrder}
							creating={tool === "SECTOR"}
						/>
						<ParkingMarkersLayer 
							parkings={topo.parkings}
						/>
						<WaypointMarkersLayer 
							waypoints={topo.waypoints}
						/>
						<BoulderMarkersLayer 
							boulders={filterBoulders(props.topoQuark().boulders.quarks())}
							boulderOrder={boulderOrder}
						/>
					</MapControl>

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
