import { TopoDoc } from "~/types";
import { HeaderDesktop } from "../layout/HeaderDesktop";
import { urlWithQueryParam, useQueryParam } from "~/helpers/queryParams";
import { useRouter } from "next/router";
import { BaseMap } from "../map/BaseMap";
import { SectorList } from "./SectorList";

interface Props {
	doc: TopoDoc;
}

export function TopoViewerDesktop({ doc }: Props) {
	const router = useRouter();
	const managementEmail =
		doc.managers.length > 0
			? doc.managers[0].contactMail
			: "contact@kayoo-asso.fr";
	return (
		<div>
			<HeaderDesktop
				title={doc.topo.name}
				backLink="/"
				menuOptions={[
					{
						label: "Infos du topo",
						href: urlWithQueryParam(router, "info", "info"),
					},
					{
						label: "Marche d'approche",
						href: urlWithQueryParam(router, "info", "access"),
					},
					{
						label: "Gestionnaires du site",
						href: urlWithQueryParam(router, "info", "management"),
					},
					{
						label: "Signaler une erreur",
						href: `mailto:${managementEmail}?subject=${encodeURIComponent(
							"Signaler une erreur | Topo : " + doc.topo.name
						)}`,
					},
				]}
			/>
			{/* Min zoom = 14, individual markers disappear above zoom 14 */}
			<div className="w-full h-contentPlusShell">
				<BaseMap initialCenter={doc.topo.location} initialZoom={16} minZoom={13}>
					<div className="absolute left-0 top-0 h-full w-[280px] border-r border-grey-medium bg-white px-2 py-10">
						<SectorList sectors={doc.sectors} rocks={doc.rocks} />
					</div>
				</BaseMap>
			</div>
		</div>
	);
}

export function TopoViewerMobile({ doc }: Props) {
	return <div></div>;
}
