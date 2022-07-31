import { LikedActionDropdown, TopoCardList } from "components/molecules";
import React, { useCallback, useRef, useState } from "react";
import { LightTopo, TopoStatus } from "types";
import { useContextMenu } from "helpers/hooks";
import { TopoPreview } from "components/organisms";
import { encodeUUID } from "helpers/utils";

interface LikedListProps {
	likedTopos: LightTopo[];
	onUnlikeTopo: (topo: LightTopo) => void;
}

export const LikedList: React.FC<LikedListProps> = (props: LikedListProps) => {
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
			// What the fuck happend with position ?? Patch for the moment.
			const patchedPosition = { x: position.x - 282, y: position.y - 58 };
			setActionTopo(topo);
			setDropdownPosition(patchedPosition);
		},
		[ref]
	);

	return (
		<>
			<div ref={ref} className="flex flex-col gap-6">
				<TopoCardList
					topos={props.likedTopos}
					status={TopoStatus.Validated}
					noTopoCardContent="Aucun topo liké"
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
					onClose={() => setPreviewTopo(undefined)}
				/>
			}

			{actionTopo && dropdownPosition && (
				<LikedActionDropdown
					topo={actionTopo}
					position={dropdownPosition}
					onSelect={() => setDropdownPosition(undefined)}
				/>
			)}
		</>
	);
};

LikedList.displayName = "LikedList";
