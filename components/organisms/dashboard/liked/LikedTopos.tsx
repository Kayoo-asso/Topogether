import React, { useCallback, useState } from "react";
import { LightTopoOld } from "types";
import { watchDependencies } from "helpers/quarky";
import { TopoPreview } from "../../TopoPreview";
import { encodeUUID } from "helpers/utils";
import { LikedHeader } from "./LikedHeader";
import { TopoList } from "components/molecules/TopoList";

import Heart from "assets/icons/heart.svg";

interface LikedToposProps {
	likedTopos: LightTopoOld[];
}

export const LikedTopos: React.FC<LikedToposProps> = watchDependencies(
	(props: LikedToposProps) => {
		const [filter, setFilter] = useState(0);

		const [previewTopo, setPreviewTopo] = useState<LightTopoOld>();
		const togglePreviewTopo = useCallback(
			(topo: LightTopoOld) => {
				if (previewTopo && previewTopo.id === topo.id)
					setPreviewTopo(undefined);
				else setPreviewTopo(topo);
			},
			[previewTopo]
		);

		return (
			<div>
				<LikedHeader
					noTopos={props.likedTopos.length === 0}
					filter={filter}
					setFilter={setFilter}
				/>

				{props.likedTopos.length > 0 && (
					<>
						<div className="flex flex-col gap-6">
							<TopoList
								topos={props.likedTopos}
								likeable
								onClick={togglePreviewTopo}
							/>
						</div>

						{previewTopo && (
							<TopoPreview
								topo={previewTopo}
								displayParking
								displayCreator
								displayLikeDownload
								mainButton={{
									content: "Ouvrir",
									link: "/topo/" + encodeUUID(previewTopo.id),
								}}
								onClose={() => setPreviewTopo(undefined)}
							/>
						)}
					</>
				)}

				<div
					className={`${
						props.likedTopos.length === 0 ? "" : "hidden"
					} hide-scrollbar relative flex w-full items-center justify-center pt-12`}
				>
					<div className="relative flex h-full w-5/6 flex-col items-center gap-16 overflow-hidden rounded-lg bg-grey-superlight p-8 md:w-3/4 md:p-10">
						<div className="flex flex-col items-center rounded-full bg-white px-8 py-3">
							<span className="ktext-label">Aucun topo favoris</span>
						</div>

						<div className="flex flex-col gap-3 rounded-sm bg-white p-10">
							<div className="relative mb-4 w-0 rounded-full border border-grey-medium px-8 py-8">
								<Heart className="absolute left-1/2 top-1/2 ml-[1px] h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform stroke-main" />
							</div>
							<div className="ktext-label">Fonctionnement</div>
							<div>
								Pour retrouver facilement un topo, appuie sur l'icône pour
								l'ajouter à tes favoris
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

LikedTopos.displayName = "LikedTopos";
