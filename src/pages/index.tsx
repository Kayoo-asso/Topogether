import { useUser } from "@clerk/nextjs";
import { InferGetStaticPropsType, NextPage } from "next";
import { useRef } from "react";
import { HeaderDesktop } from "~/components/layout/HeaderDesktop";
import { getLightTopos } from "~/server/queries";
import { Map } from "ol";
import { usePosition } from "~/components/providers/UserPositionProvider";
import { LeftbarDesktop } from "~/components/layout/LeftbarDesktop";
import { WorldMapDesktop, WorldMapMobile } from "~/components/map/WorldMap";
import { Desktop, Mobile } from "~/components/responsive";

export const getStaticProps = async () => {
	return {
		props: {
			lightTopos: await getLightTopos(),
		},
	};
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Page: NextPage<Props> = ({ lightTopos }) => {
	// TOOD
	return (
		<>
			{/* Header stuff */}
			{/* <div
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
			</div> */}

			{/* {user && <LeftbarDesktop currentMenuItem="MAP" />} */}
			<Desktop>
				<WorldMapDesktop topos={lightTopos} />
			</Desktop>
			<Mobile>
				<WorldMapMobile topos={lightTopos} />
			</Mobile>

			{/*
				<SlideoverMobileWorldmap
					map={mapRef.current}
					Filters={Filters}
					onFilterReset={resetFilters}
				/>


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
		</>
	);
};

export default Page;
