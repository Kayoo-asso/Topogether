import React, { useCallback, useState } from "react";
import { LightTopo, UUID } from "types";
import { watchDependencies } from "helpers/quarky";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks";
import { TopoPreview } from "../../TopoPreview";
import { encodeUUID } from "helpers/utils";
import { downloads } from "helpers/downloads/DownloadManager";
import { TopoList } from "components/molecules/TopoList";
import { DlHeader } from "./DlHeader";
import { Button } from "components/atoms";

import Download from "assets/icons/download.svg";

interface DlToposProps {
	dlTopos: LightTopo[];
	setDisplayTabs: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DlTopos: React.FC<DlToposProps> = watchDependencies(
	(props: DlToposProps) => {
		const [dlTopos, setDlTopos] = useState(props.dlTopos);
		const [filter, setFilter] = useState(0);
		const [isDeleting, setIsDeleting] = useState(false);
		const [toDelete, setToDelete] = useState<UUID[]>([]);
		
		const [previewTopo, setPreviewTopo] = useState<LightTopo>();
		const togglePreviewTopo = useCallback((topo: LightTopo) => {
			if (previewTopo && previewTopo.id === topo.id) setPreviewTopo(undefined);
			else setPreviewTopo(topo);
		}, [previewTopo]);

		const [ModalUnsave, showModalUnsave] = useModal();
		const unsaveTopos = useCallback(
			(uuids: UUID[]) => {
				if (uuids.length > 0) {
					for (const uuid of uuids) {
						downloads.delete(uuid)
					}
					const newDlTopos = dlTopos.filter(t => !uuids.includes(t.id));
					setDlTopos(newDlTopos);
					setIsDeleting(false);
					setToDelete([]);
				}
			},
			[dlTopos]
		);

		return (
			<div className="relative h-full">
				<DlHeader 
					noTopos={dlTopos.length === 0}
					isDeleting={isDeleting}
					setIsDeleting={setIsDeleting}
					setDisplayTabs={props.setDisplayTabs}
					filter={filter}
					setFilter={setFilter}
					setToDelete={setToDelete}
				/>
				
				{props.dlTopos.length > 0 && (
					<>
						<div className="flex flex-col gap-6">
							<TopoList 
								topos={filter === 0 ? dlTopos : dlTopos.sort((t1, t2) => t1.name <= t2.name ? -1 : 1)}
								selectable={isDeleting}
								selected={toDelete}
								setSelected={setToDelete}
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

				<div className={`${props.dlTopos.length === 0 ? '' : 'hidden'} pt-12 relative flex h-[60vh] w-full items-center justify-center`}>
					<div className="relative flex flex-col gap-16 h-full w-5/6	 md:w-3/4 p-10 items-center overflow-hidden rounded-lg bg-grey-superlight">
						<div className="flex flex-col bg-white rounded-full px-8 py-3 items-center">
							<span className="ktext-label">Aucun topo téléchargé</span>
						</div>

						<div className="flex flex-col gap-3 bg-white rounded-sm p-10">
							<div className="px-8 py-8 border border-grey-medium rounded-full relative mb-4 w-0">
                                <Download className="stroke-main w-8 h-8 absolute ml-[2px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
							<div className="ktext-label">Fonctionnement</div>
							<div>Lorsque tu ouvres un topo, appuie sur l'icône pour le télécharger</div>
						</div>
					</div>
				</div>

				{toDelete.length > 0 && 
					<Button 
						content={`Supprimer le${toDelete.length > 1 ? "s" : ""}${toDelete.length > 1 ? " ("+toDelete.length+")" : ""} topo${toDelete.length > 1 ? "s" : ""} sélectionné${toDelete.length > 1 ? "s" : ""}`}
						className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/2"
						onClick={() => showModalUnsave()}
					/>
				}
				<ModalUnsave
					buttonText="Supprimer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={() => unsaveTopos(toDelete)}
				>
					{`Le${toDelete.length > 1 ? "s" : ""} topo${toDelete.length > 1 ? "s" : ""} ne ${toDelete.length > 1 ? "seront" : "sera"} plus accessible${toDelete.length > 1 ? "s" : ""} hors ligne. Etes-vous sûr de vouloir continuer ?`}
				</ModalUnsave>
			</div>
		);
	}
);

DlTopos.displayName = 'DlTopos';