import { useUser } from "@clerk/nextjs";
import { InferGetStaticPropsType, NextPage } from "next";
import { useRef } from "react";
import { HeaderDesktop } from "~/components/layout/HeaderDesktop";
import { getLightTopos } from "~/server/queries";
import { Map } from "ol";
import { usePosition } from "~/components/providers/UserPositionProvider";
import { LeftbarDesktop } from "~/components/layout/LeftbarDesktop";
import { WorldMap } from "~/components/map/WorldMap";

export const getStaticProps = async () => {
	return {
		props: {
			lightTopos: await getLightTopos(),
		},
	};
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Page: NextPage<Props> = ({ lightTopos }) => {
	const { user } = useUser();

	const { position } = usePosition();
	const mapRef = useRef<Map>(null);

	// const SearchbarDesktop: React.FC = () => (
	// 	<SearchbarToposDesktop map={mapRef.current} />
	// );
	// const [Filters, filterTopos, resetFilters] = useToposFilters(lightTopos);
	// const FiltersDesktop: React.FC = () => (
	// 	<ToposFiltersDesktop Filters={Filters} onResetClick={resetFilters} />
	// );
	// TOOD
	const onGoingDl = 0;
	return (
		<>
			<HeaderDesktop
				backLink="#"
				title="Carte des topo"
				displayLogin={user ? false : true}
			>
				<div
					className={`${
						onGoingDl > 0 ? "" : "hidden"
					} ktext-label flex w-full justify-end text-white`}
				>
					Téléchargement en cours... ({onGoingDl})
				</div>
			</HeaderDesktop>
			<div
				className={`flex h-header items-center bg-dark px-8 ${
					onGoingDl > 0 ? "md:hidden" : "hidden"
				}`}
			>
				<div
					className={`${
						onGoingDl > 0 ? "" : "hidden"
					} ktext-label flex w-full justify-end text-white`}
				>
					Téléchargement en cours... ({onGoingDl})
				</div>
			</div>

			<div
				className={`${
					onGoingDl > 0 ? "h-content" : "h-contentPlusHeader"
				} relative flex flex-row md:h-full`}
			>
				{user && <LeftbarDesktop currentMenuItem="MAP" />}
				<WorldMap topos={lightTopos} />
				{/*
				<SlideoverMobileWorldmap
					map={mapRef.current}
					Filters={Filters}
					onFilterReset={resetFilters}
				/>

				<MapControl
					ref={mapRef}
					initialZoom={5}
					initialCenter={position || undefined}
					displayUserMarker="under"
					// onUserMarkerClick={(e) => console.log(e)}
					Searchbar={SearchbarDesktop}
					Filters={FiltersDesktop}
					onClick={(e) => {
						const map = e.map;
						const hit = map?.forEachFeatureAtPixel(
							e.pixel,
							function (feature, layer) {
								return true;
							}
						);
						if (!hit) setSelectedTopo(undefined);
					}}
				>
					<TopoMarkersLayer
						topos={props.lightTopos.filter(filterTopos)}
						selectedTopo={selectedTopo}
						onTopoSelect={(t) => setSelectedTopo(t as LightTopo)}
					/>
				</MapControl>

				{selectedTopo && (
					<TopoPreview
						topo={selectedTopo}
						displayLikeDownload={!!user}
						// displayCreator
						displayParking
						mainButton={{
							content: "Entrer",
							link: "/topo/" + encodeUUID(selectedTopo.id),
						}}
						onClose={() => setSelectedTopo(undefined)}
					/>
				)} */}
			</div>
		</>
	);
};

export default Page;
