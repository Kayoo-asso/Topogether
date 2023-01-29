// import React, { useCallback, useState } from "react";
// import { TopoCardList } from "components";
// import { LightTopo, TopoStatus } from "types";
// import { watchDependencies } from "helpers/quarky";
// import { staticUrl } from "helpers/constants";
// import { useModal } from "helpers/hooks";
// import { TopoPreview } from "../TopoPreview";
// import { encodeUUID } from "helpers/utils";
// import { downloads } from "helpers/downloads/DownloadManager";

// interface DlToposProps {
// 	dlTopos: LightTopo[];
// }

// export const DlTopos: React.FC<DlToposProps> = watchDependencies(
// 	(props: DlToposProps) => {
// 		const [dlTopos, setDlTopos] = useState(props.dlTopos);
// 		const [ModalUnsave, showModalUnsave] = useModal<LightTopo>();

// 		const [previewTopo, setPreviewTopo] = useState<LightTopo>();
// 		const togglePreviewTopo = useCallback((topo: LightTopo) => {
// 			if (previewTopo && previewTopo.id === topo.id) setPreviewTopo(undefined);
// 			else setPreviewTopo(topo);
// 		}, [previewTopo]);

// 		const unsaveTopo = useCallback(
// 			(topo: LightTopo) => {
// 				if (topo) {
// 					downloads.delete(topo.id)
// 					const newDlTopos = dlTopos.filter((t) => t.id !== topo.id);
// 					setDlTopos(newDlTopos);
// 				}
// 			},
// 			[dlTopos]
// 		);

// 		return (
// 			<>
// 				<div className="flex items-center justify-between px-4 py-6 md:px-8">
// 					<div className="ktext-section-title text-center md:hidden">
// 						Topos téléchargés
// 					</div>
// 				</div>
				
// 				{props.dlTopos.length > 0 && (
// 					<>
// 						<div className="flex flex-col gap-6">
// 							<TopoCardList
// 								topos={dlTopos}
// 								status={TopoStatus.Validated}
// 								onClick={togglePreviewTopo}
// 							/>
// 						</div>
			
// 						{previewTopo && 
// 							<TopoPreview
// 								topo={previewTopo}
// 								displayParking
// 								displayCreator
// 								displayLikeDownload
// 								mainButton={{ content: 'Ouvrir', link: '/topo/' + encodeUUID(previewTopo.id) }}
// 								secondButton={{ content: 'Retirer des téléchargements', onClick: () => showModalUnsave(previewTopo) }}
// 								onClose={() => setPreviewTopo(undefined)}
// 							/>
// 						}
// 					</>
// 				)}
// 				{props.dlTopos.length === 0 && (
// 					<div className="relative flex h-[70vh] w-full justify-center">
// 						<div className="relative flex h-full w-[90%] items-center overflow-hidden rounded bg-grey-superlight">
// 								<div className="flex w-full flex-col items-center">
// 									<span>Aucun topo téléchargé</span>
// 								</div>
// 						</div>
// 					</div>
// 				)}

// 				<ModalUnsave
// 					buttonText="Supprimer"
// 					imgUrl={staticUrl.deleteWarning}
// 					onConfirm={unsaveTopo}
// 				>
// 					Le topo ne sera plus accessible hors ligne. Etes-vous sûr de vouloir continuer ?
// 				</ModalUnsave>
// 			</>
// 		);
// 	}
// );

// DlTopos.displayName = 'DlTopos';