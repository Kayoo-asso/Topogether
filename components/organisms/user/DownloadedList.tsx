import { DownloadedActionDropdown, TopoCardList } from "components/molecules";
import { staticUrl } from "helpers/constants";
import { useModal, useContextMenu } from "helpers/hooks";
import React, { useCallback, useRef, useState } from "react";
import { LightTopo, TopoStatus } from "types";
import { encodeUUID } from "helpers/utils";
import { TopoPreview } from "../TopoPreview";

interface DownloadedListProps {
	downloadedTopos: LightTopo[];
}

export const DownloadedList: React.FC<DownloadedListProps> = (
	props: DownloadedListProps
) => {
	const [ModalUnsave, showModalUnsave] = useModal();

	const [actionTopo, setActionTopo] = useState<LightTopo>();

	const [previewTopo, setPreviewTopo] = useState<LightTopo>();
	const togglePreviewTopo = useCallback((topo: LightTopo) => {
		if (previewTopo && previewTopo.id === topo.id) setPreviewTopo(undefined);
		else {
			setActionTopo(topo);
			setPreviewTopo(topo);
		}
	}, [previewTopo]);

	const ref = useRef<HTMLDivElement>(null);
	const [dropdownPosition, setDropdownPosition] = useState<{
		x: number;
		y: number;
	}>();

	useContextMenu(() => setDropdownPosition(undefined), ref.current);
	const onContextMenu = useCallback(
		(topo: LightTopo, position: { x: number; y: number }) => {
			setActionTopo(topo);
			setDropdownPosition(position);
		},
		[ref]
	);

	const unsaveTopo = useCallback(() => {
		//TODO
		alert("à venir");
	}, [actionTopo]);

	return (
		<>
			<div className="flex flex-col gap-6">
				<TopoCardList
					topos={props.downloadedTopos}
					status={TopoStatus.Validated}
					noTopoCardContent="Aucun topo téléchargé"
					onContextMenu={onContextMenu}
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
					secondButton={{ content: 'Retirer des téléchargements', onClick: showModalUnsave }}
					onClose={() => setPreviewTopo(undefined)}
				/>
			}

			{actionTopo && dropdownPosition && (
				<DownloadedActionDropdown
					topo={actionTopo}
					position={dropdownPosition}
					onUnsaveClick={showModalUnsave}
					onSelect={() => setDropdownPosition(undefined)}
				/>
			)}

			<ModalUnsave
				buttonText="Confirmer"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={unsaveTopo}
			>
				Le topo ne sera plus accessible hors ligne. Êtes-vous sûr de vouloir continuer ?
			</ModalUnsave>
		</>
	);
};

DownloadedList.displayName = "DownloadedList";
