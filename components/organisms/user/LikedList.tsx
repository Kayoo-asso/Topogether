import { LikedActionDropdown, TopoCardList } from "components/molecules";
import React, { useCallback, useRef, useState } from "react";
import { LightTopo, TopoStatus } from "types";
import { useContextMenu, useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";

interface LikedListProps {
	likedTopos: LightTopo[];
	onUnlikeTopo: (topo: LightTopo) => void;
}

export const LikedList: React.FC<LikedListProps> = (props: LikedListProps) => {
	const [ModalUnlike, showModalUnlike] = useModal<LightTopo>();

	const ref = useRef<HTMLDivElement>(null);
	const [topoDropdown, setTopoDropdown] = useState<LightTopo>();
	const [dropdownPosition, setDropdownPosition] = useState<{
		x: number;
		y: number;
	}>();

	useContextMenu(() => setDropdownPosition(undefined), ref.current);
	const onContextMenu = useCallback(
		(topo: LightTopo, position: { x: number; y: number }) => {
			// What the fuck happend with position ?? Patch for the moment.
			const patchedPosition = { x: position.x - 282, y: position.y - 58 };
			setTopoDropdown(topo);
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
					clickable="topo"
					noTopoCardContent="Aucun topo liké"
					onContextMenu={onContextMenu}
				/>
			</div>

			{topoDropdown && dropdownPosition && (
				<LikedActionDropdown
					topo={topoDropdown}
					position={dropdownPosition}
					onUnlikeClick={showModalUnlike}
					onSelect={() => setDropdownPosition(undefined)}
				/>
			)}
			<ModalUnlike
				buttonText="Confirmer"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={(topo) => {
					props.onUnlikeTopo(topo);
				}}
			>
				Le topo sera retiré de la liste de vos topos likés. Voulez-vous
				continuer ?
			</ModalUnlike>
		</>
	);
};

LikedList.displayName = "LikedList";
