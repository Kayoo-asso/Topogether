import React, { useCallback, useState } from "react";
import { LightTopoOld, UUID } from "types";
import { watchDependencies } from "helpers/quarky";
import { staticUrl } from "helpers/constants";
import { TopoPreview } from "../../TopoPreview";
import { encodeUUID } from "helpers/utils";
import { downloads } from "helpers/downloads/DownloadManager";
import { TopoList } from "components/molecules/TopoList";
import { DlHeader } from "./DlHeader";

import Download from "assets/icons/download.svg";
import { useModal } from "helpers/hooks/useModal";
import { Button } from "components/atoms/buttons/Button";

interface DlToposProps {
	dlTopos: LightTopoOld[];
	setDisplayTabs: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DlTopos: React.FC<DlToposProps> = watchDependencies(
	(props: DlToposProps) => {
		const [dlTopos, setDlTopos] = useState(props.dlTopos);
		const [filter, setFilter] = useState(0);
		const [isDeleting, setIsDeleting] = useState(false);
		const [toDelete, setToDelete] = useState<UUID[]>([]);

		const [previewTopo, setPreviewTopo] = useState<LightTopoOld>();
		const togglePreviewTopo = useCallback(
			(topo: LightTopoOld) => {
				if (previewTopo && previewTopo.id === topo.id)
					setPreviewTopo(undefined);
				else setPreviewTopo(topo);
			},
			[previewTopo]
		);

		const [ModalUnsave, showModalUnsave] = useModal();
		const unsaveTopos = useCallback(
			(uuids: UUID[]) => {
				if (uuids.length > 0) {
					for (const uuid of uuids) {
						downloads.delete(uuid);
					}
					const newDlTopos = dlTopos.filter((t) => !uuids.includes(t.id));
					setDlTopos(newDlTopos);
					setIsDeleting(false);
					setToDelete([]);
				}
			},
			[dlTopos]
		);

		return (
			<div>
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
								topos={
									filter === 0
										? dlTopos
										: dlTopos.sort((t1, t2) => (t1.name <= t2.name ? -1 : 1))
								}
								selectable={isDeleting}
								selected={toDelete}
								setSelected={setToDelete}
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
						props.dlTopos.length === 0 ? "" : "hidden"
					} hide-scrollbar relative flex w-full items-center justify-center pt-12`}
				>
					<div className="relative flex h-full w-5/6 flex-col items-center gap-16 overflow-hidden rounded-lg bg-grey-superlight p-8 md:w-3/4 md:p-10">
						<div className="flex flex-col items-center rounded-full bg-white px-8 py-3">
							<span className="ktext-label">Aucun topo téléchargé</span>
						</div>

						<div className="flex flex-col gap-3 rounded-sm bg-white p-10">
							<div className="relative mb-4 w-0 rounded-full border border-grey-medium px-8 py-8">
								<Download className="absolute left-1/2 top-1/2 ml-[2px] h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform stroke-main" />
							</div>
							<div className="ktext-label">Fonctionnement</div>
							<div>
								Lorsque tu ouvres un topo, appuie sur l'icône pour le
								télécharger
							</div>
						</div>
					</div>
				</div>

				{toDelete.length > 0 && (
					<Button
						content={`Supprimer le${toDelete.length > 1 ? "s" : ""}${
							toDelete.length > 1 ? " (" + toDelete.length + ")" : ""
						} topo${toDelete.length > 1 ? "s" : ""} sélectionné${
							toDelete.length > 1 ? "s" : ""
						}`}
						className="absolute bottom-4 left-1/2 w-3/4 -translate-x-1/2 transform md:w-1/2"
						onClick={() => showModalUnsave()}
					/>
				)}
				<ModalUnsave
					buttonText="Supprimer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={() => unsaveTopos(toDelete)}
				>
					{`Le${toDelete.length > 1 ? "s" : ""} topo${
						toDelete.length > 1 ? "s" : ""
					} ne ${toDelete.length > 1 ? "seront" : "sera"} plus accessible${
						toDelete.length > 1 ? "s" : ""
					} hors ligne. Etes-vous sûr de vouloir continuer ?`}
				</ModalUnsave>
			</div>
		);
	}
);

DlTopos.displayName = "DlTopos";
