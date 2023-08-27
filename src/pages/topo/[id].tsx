import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { TopoDocProvider } from "~/components/providers/TopoDocProvider";
import { Desktop, Mobile } from "~/components/responsive";
import {
	TopoViewerDesktop,
	TopoViewerMobile,
} from "~/components/viewer/TopoViewer";
import { db, topos } from "~/db";
import { getTopo } from "~/server/queries";
import { TopoDoc, UUID } from "~/types";
import { decodeUUID, encodeUUID } from "~/utils";

interface Props {
	doc: TopoDoc;
}

export const getStaticProps: GetStaticProps<Props, { id: string }> = async (
	ctx
) => {
	const topoId = decodeUUID(ctx.params!.id);
	console.log("topoId", topoId)
	const doc = await getTopo(topoId, undefined);
	console.log("doc", doc)
	if (!doc) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			doc,
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const rows = await db.select({ id: topos.id }).from(topos);
	const paths = rows.map((x) => ({ params: { id: encodeUUID(x.id) } }));
	return {
		paths,
		// return 404 for other paths
		fallback: false,
	};
};

const Page: NextPage<Props> = ({ doc }) => {
	return (
		<TopoDocProvider doc={doc}>
			<Desktop>
				<TopoViewerDesktop doc={doc} />
			</Desktop>
			<Mobile>
				<TopoViewerMobile doc={doc} />
			</Mobile>
		</TopoDocProvider>
	);
};

export default Page;
