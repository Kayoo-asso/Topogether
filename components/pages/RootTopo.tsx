import React, { useCallback, useEffect, useRef } from "react";
import { DropdownOption } from "components";
import { Topo, TopoStatus, TrackDanger } from "types";
import {
	Quark,
	useCreateDerivation,
	useCreateQuark,
	watchDependencies,
} from "helpers/quarky";
import { useRouter } from "next/router";
import { Header } from "components/layouts/Header";
import { LeftbarTopoDesktop } from "components/layouts/LeftbarTopoDesktop";
import { BoulderFilterOptions } from "components/map";
import { MapControl } from "components/map/MapControl";
import Map from "ol/Map";
import { useBreakpoint } from "helpers/hooks";
import { useSession } from "helpers/services";
import { sortBoulders } from "helpers/topo";
import { encodeUUID } from "helpers/utils";
import { useSelectStore } from "./selectStore";
import { SyncUrl } from "components/organisms/SyncUrl";
import { SlideoverLeftTopo } from "components/organisms/topo/Slideover.left.topo";
import { SlideoverRightTopo } from "components/organisms/topo/Slideover.right.topo";
import { BoulderMarkersLayer } from "components/map/markers/BoulderMarkersLayer";
import { SectorAreaMarkersLayer } from "components/map/markers/SectorAreaMarkersLayer";
import { ParkingMarkersLayer } from "components/map/markers/ParkingMarkersLayer";
import { WaypointMarkersLayer, disappearZoom } from "components/map/markers/WaypointMarkersLayer";
import { SelectInteraction } from "components/map/markers/SelectInteraction";

interface RootTopoProps {
	topoQuark: Quark<Topo>;
}

export const RootTopo: React.FC<RootTopoProps> = watchDependencies(
	(props: RootTopoProps) => {
		const router = useRouter();
		const session = useSession();
		const breakpoint = useBreakpoint();

		const topo = props.topoQuark();
		const boulderOrder = useCreateDerivation(() =>
			sortBoulders(topo.sectors, topo.lonelyBoulders)
		);

		const isEmptyStore = useSelectStore((s) => s.isEmpty);
		const flush = useSelectStore((s) => s.flush);
		const select = useSelectStore((s) => s.select);

		const constructMenuOptions = useCallback((): DropdownOption[] => {
			const menuOptions: DropdownOption[] = [
				{
					value: "Infos du topo",
					action: () => select.info("INFO", breakpoint),
				},
				{
					value: "Marche d'approche",
					action: () => select.info("ACCESS", breakpoint),
				},
				{
					value: "Gestionnaires du site",
					action: () => select.info("MANAGEMENT", breakpoint),
				},
			];
			if (
				(topo.status === TopoStatus.Draft &&
					topo.creator?.id === session?.id) ||
				session?.role === "ADMIN"
			)
				menuOptions.push({
					value: "Modifier le topo",
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
		}, [breakpoint, topo, router, session]);

		const mapRef = useRef<Map>(null);

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

				<Header
					title={topo.name}
					backLink="/"
					onBackClick={!isEmptyStore() ? () => flush.all() : undefined}
					menuOptions={constructMenuOptions()}
				/>

				{/* overflow-clip instead of overflow-hidden, so that the Slideagainst can appear off-screen without 
                triggering a shift of content in this div */}
				<div className="relative flex h-content flex-row md:h-full md:overflow-clip">
					<LeftbarTopoDesktop
						topoQuark={props.topoQuark}
						boulderOrder={boulderOrder()}
						map={mapRef.current}
					/>

					<SlideoverLeftTopo topo={props.topoQuark} boulderOrder={boulderOrder()} map={mapRef.current} />

					<MapControl
						ref={mapRef}
						topo={props.topoQuark}
						initialZoom={16}
						minZoom={disappearZoom - 1}
						initialCenter={topo.location}
						searchbarOptions={{
							findBoulders: true,
						}}
						boulderFilters={boulderFilters}
						boulderFiltersDomain={defaultBoulderFilterOptions}
						displaySectorButton
						onSectorButtonClick={() => select.info("SECTOR", breakpoint)}
					>
						<SelectInteraction
							boulderOrder={boulderOrder()}
						/>
						<SectorAreaMarkersLayer
							topoQuark={props.topoQuark}
							boulderOrder={boulderOrder()}
						/>
						<ParkingMarkersLayer
							parkings={topo.parkings}
						/>
						<WaypointMarkersLayer 
							waypoints={topo.waypoints}
						/>
						<BoulderMarkersLayer 
							topo={props.topoQuark}
							boulderOrder={boulderOrder()}
						/>
						
					</MapControl>

					<SlideoverRightTopo topo={props.topoQuark} />
				</div>
			</>
		);
	}
);

RootTopo.displayName = "RootTopo";
