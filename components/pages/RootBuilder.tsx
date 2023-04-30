import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { computeBuilderProgress } from "helpers/topo";
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
import { SelectedItem, useSelectStore } from "../store/selectStore";
import { SyncUrl } from "components/organisms/SyncUrl";
import { KeyboardShortcut } from "components/organisms/builder/KeyboardShortcuts";
import { NetworkIndicator } from "components/atoms/NetworkIndicator";
import { MapControl } from "components/map/MapControl";
import { Map, MapBrowserEvent } from "ol";
import { toLonLat } from "ol/proj";
import { SectorAreaMarkersLayer } from "components/map/markers/SectorAreaMarkersLayer";
import { BoulderMarkersLayer } from "components/map/markers/BoulderMarkersLayer";
import { ParkingMarkersLayer } from "components/map/markers/ParkingMarkersLayer";
import { WaypointMarkersLayer, disappearZoom } from "components/map/markers/WaypointMarkersLayer";
import { CreatingMarkersLayer } from "components/map/markers/CreatingMarkersLayer";
import { DragInteraction } from "components/map/markers/DragInteraction";
import { SearchbarBouldersDesktop } from "components/map/searchbar/SearchbarBoulders.desktop";
import { useBouldersFilters } from "components/map/filters/useBouldersFilters";
import { BouldersFiltersDesktop } from "components/map/filters/BouldersFilters.desktop";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { useLoader } from "helpers/hooks/useLoader";
import { useModal } from "helpers/hooks/useModal";
import { DropdownOption } from "components/molecules/form/Dropdown";
import { Flash } from "components/atoms/overlays/Flash";
import { OnClickInteraction } from "components/map/markers/OnClickInteraction";
import { ModifyInteraction } from "components/map/markers/ModifyInteraction";
import { useBoulderOrder } from "components/store/boulderOrderStore";
import { SectorCreationTuto } from "components/molecules/tutos/SectorCreationTuto";

interface RootBuilderProps {
	topoQuark: Quark<Topo>;
}

export const RootBuilder: React.FC<RootBuilderProps> = watchDependencies(
	(props: RootBuilderProps) => {
		const router = useRouter();
		const session = useSession()!;
		const breakpoint = useBreakpoint();
		const sortBoulderOrder = useBoulderOrder(bo => bo.sort);

		const showLoader = useLoader();

		const topo = props.topoQuark();
		useEffect(() => {
			sortBoulderOrder(topo.sectors, topo.lonelyBoulders);
		}, [topo.sectors, topo.lonelyBoulders]);

		const isEmptyStore = useSelectStore(s => s.isEmpty);
		const flush = useSelectStore(s => s.flush);
		const select = useSelectStore(s => s.select);
		const tool = useSelectStore(s => s.tool);

		//TODO: refactor with a dropdownStore (like deleteStore)
		const [dropdownItem, setDropdownItem] = useState<SelectedItem>({ type: 'none', value: undefined });
		const [dropdownPosition, setDropdownPosition] = useState<{
			x: number;
			y: number;
		}>();

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

		const SearchbarDesktop: React.FC = () =>
			<SearchbarBouldersDesktop 
				topo={props.topoQuark}
				map={mapRef.current}
			/>
		const [Filters, filterBoulders, resetFilters, areFiltersEmpty] = useBouldersFilters(topo);
		const FiltersDesktop: React.FC = () => <BouldersFiltersDesktop Filters={Filters} onResetClick={resetFilters} />;

		const [flashOpen, setFlashOpen] = useState(false);
		const handleCreateNewMarker = useCallback(
			(e: MapBrowserEvent<any>) => {
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
							if (!areFiltersEmpty) setFlashOpen(true);
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
			[topo, tool, areFiltersEmpty, createBoulder, createParking, createWaypoint, isEmptyStore()]
		);

		return (
			<>
				<SyncUrl topo={topo} />
				<KeyboardShortcut />
				<SectorCreationTuto />
				
				<Header
					title={topo.name}
					backLink="/builder/dashboard"
					onBackClick={flush.all}
					menuOptions={menuOptions}
				>
					<>
						<BuilderProgressIndicator
							topo={props.topoQuark()}
							progress={progress()}
						/>
						<div className="md:pl-8"><NetworkIndicator /></div>
					</>
				</Header>

				{/* overflow-clip instead of overflow-hidden, so that the Slideagainst can appear off-screen without 
                triggering a shift of content in this div */}
				<div className="relative flex h-content flex-row md:h-contentPlusShell md:overflow-clip">
					<LeftbarBuilderDesktop
						topoQuark={props.topoQuark}
						map={mapRef.current}
						onSubmit={showModalSubmitTopo}
						activateSubmission={progress() === 100}
					/>

					<SlideoverLeftBuilder
						topo={props.topoQuark}
						map={mapRef.current}
						Filters={Filters}
						onFilterReset={resetFilters}
					/>

					<SlideoverRightBuilder
						topo={props.topoQuark}
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
						{tool && tool !== "SECTOR" && //isEmptyStore() &&  Uncomment when bug with DragInteraction will be fixed
							<CreatingMarkersLayer 
								onCreate={handleCreateNewMarker}
							/>
						}
						<OnClickInteraction
							selectableSector
						/>
						<DragInteraction 
							topoQuark={props.topoQuark}
						/>
						<ModifyInteraction 
							topoQuark={props.topoQuark}
						/>

						<SectorAreaMarkersLayer
							topoQuark={props.topoQuark}
							creating={tool === "SECTOR"}
						/>
						<ParkingMarkersLayer 
							parkings={topo.parkings.quarks().toArray()}
						/>
						<WaypointMarkersLayer 
							waypoints={topo.waypoints.quarks().toArray()}
						/>
						<BoulderMarkersLayer 
							boulders={filterBoulders(props.topoQuark().boulders.quarks())}
						/>
					</MapControl>

				</div>

				<BuilderDropdown 
					position={dropdownPosition}
					dropdownItem={dropdownItem}
					setDropdownItem={setDropdownItem}
				/>

				<BuilderModalDelete topo={props.topoQuark} />

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
