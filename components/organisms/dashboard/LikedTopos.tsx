import React, { useCallback, useState } from "react";
import { TopoCardList } from "components";
import { LightTopo, TopoStatus } from "types";
import { watchDependencies } from "helpers/quarky";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks";

import { TopoPreview } from "../TopoPreview";
import { encodeUUID } from "helpers/utils";

interface LikedToposProps {
	likedTopos: LightTopo[];
}

export const LikedTopos: React.FC<LikedToposProps> = watchDependencies(
	(props: LikedToposProps) => {
		const [likedTopos, setLikedTopos] = useState(props.likedTopos);
		const [ModalUnlike, showModalUnlike] = useModal<LightTopo>(); //TODO : Link that action

		const [previewTopo, setPreviewTopo] = useState<LightTopo>();
		const togglePreviewTopo = useCallback((topo: LightTopo) => {
			if (previewTopo && previewTopo.id === topo.id) setPreviewTopo(undefined);
			else setPreviewTopo(topo);
		}, [previewTopo]);

		const unlikeTopo = useCallback(
			(topo: LightTopo) => {
				if (topo) {
					topo.liked.set(false);
					const newLikedTopos = likedTopos.filter((t) => t.id !== topo.id);
					setLikedTopos(newLikedTopos);
				}
			},
			[likedTopos]
		);

		return (
			<>
				<div className="flex items-center justify-between px-4 py-6 md:px-8">
					<div className="ktext-section-title text-center md:hidden">
						Topos favoris
					</div>
				</div>
				
				{props.likedTopos.length > 0 && (
					<>
						<div className="flex flex-col gap-6">
							<TopoCardList
								topos={likedTopos}
								status={TopoStatus.Validated}
								onClick={togglePreviewTopo}
							/>
						</div>
			
						{previewTopo && 
							<TopoPreview
								topo={previewTopo}
								displayParking
								displayCreator
								displayLikeDownload
								mainButton={{ content: 'Ouvrir', link: '/topo/' + encodeUUID(previewTopo.id) }}
								onClose={() => setPreviewTopo(undefined)}
							/>
						}
					</>
				)}
				{props.likedTopos.length === 0 && (
					<div className="relative flex h-[70vh] w-full justify-center">
						<div className="relative flex h-full w-[90%] items-center overflow-hidden rounded bg-grey-superlight">
								<div className="flex w-full flex-col items-center">
									<span>Aucun topo favoris</span>
								</div>
						</div>
					</div>
				)}

				<ModalUnlike
					buttonText="Enlever"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={unlikeTopo}
				>
					Le topo ne sera plus dans vos favoris. Etes-vous sûr de vouloir continuer ?
				</ModalUnlike>
			</>
		);
	}
);

LikedTopos.displayName = 'LikedTopos';