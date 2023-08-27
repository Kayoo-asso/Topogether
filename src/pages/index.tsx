import type { GetStaticProps, NextPage } from "next";
import { getLightTopos } from "~/server/queries";
import { WorldMapDesktop, WorldMapMobile } from "~/components/map/WorldMap";
import { Desktop, Mobile } from "~/components/responsive";
import type { LightTopo } from "~/types";

interface Props {
	lightTopos: LightTopo[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	return {
		props: {
			lightTopos: await getLightTopos({ status: "validated" }),
		},
	};
};

const Page: NextPage<Props> = ({ lightTopos }) => {
	return (
		<>
			<Desktop>
				<WorldMapDesktop topos={lightTopos} />
			</Desktop>
			<Mobile>
				<WorldMapMobile topos={lightTopos} />
			</Mobile>
		</>
	);
};

export default Page;
