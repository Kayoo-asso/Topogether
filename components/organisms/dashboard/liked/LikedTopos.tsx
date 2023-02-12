import React, { useCallback, useState } from "react";
import { LightTopo } from "types";
import { watchDependencies } from "helpers/quarky";
import { TopoPreview } from "../../TopoPreview";
import { encodeUUID } from "helpers/utils";
import { LikedHeader } from "./LikedHeader";
import { TopoList } from "components/molecules/TopoList";

import Heart from "assets/icons/heart.svg";


interface LikedToposProps {
	likedTopos: LightTopo[];
}

export const LikedTopos: React.FC<LikedToposProps> = watchDependencies(
	(props: LikedToposProps) => {
		const [filter, setFilter] = useState(0);

		const [previewTopo, setPreviewTopo] = useState<LightTopo>();
		const togglePreviewTopo = useCallback((topo: LightTopo) => {
			if (previewTopo && previewTopo.id === topo.id) setPreviewTopo(undefined);
			else setPreviewTopo(topo);
		}, [previewTopo]);

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

				<div className={`${props.likedTopos.length === 0 ? '' : 'hidden'} hide-scrollbar pt-12 relative flex w-full items-center justify-center`}>
					<div className="relative flex flex-col gap-16 h-full w-5/6 md:w-3/4 p-8 md:p-10 items-center overflow-hidden rounded-lg bg-grey-superlight">
						<div className="flex flex-col bg-white rounded-full px-8 py-3 items-center">
							<span className="ktext-label">Aucun topo favoris</span>
						</div>

						<div className="flex flex-col gap-3 bg-white rounded-sm p-10">
							<div className="px-8 py-8 border border-grey-medium rounded-full relative mb-4 w-0">
                                <Heart className="stroke-main w-8 h-8 absolute ml-[1px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
							<div className="ktext-label">Fonctionnement</div>
							<div>Pour retrouver facilement un topo, appuie sur l'icône pour l'ajouter à tes favoris</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

LikedTopos.displayName = 'LikedTopos';