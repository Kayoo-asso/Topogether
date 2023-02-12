import React, { useCallback, useMemo } from "react";
import { LightTopo, TopoStatus } from "types";
import { useRouter } from "next/router";
import { encodeUUID } from "helpers/utils";
import { Dropdown, DropdownOption } from "../form/Dropdown";

interface AdminActionDropdownProps {
	topo: LightTopo;
	position: { x: number; y: number };
	onValidateClick: () => void;
	onUnvalidateClick: () => void;
	onRejectClick: () => void;
	onDeleteClick: () => void;
	onSelect?: () => void;
}

export const AdminActionDropdown: React.FC<AdminActionDropdownProps> = (
	props: AdminActionDropdownProps
) => {
	const router = useRouter();

	const openTopo = useCallback(
		() => router.push(`/topo/${encodeUUID(props.topo.id)}`),
		[router, props.topo.id]
	);
	const editTopo = useCallback(
		() => router.push(`/builder/${encodeUUID(props.topo.id)}`),
		[router, props.topo.id]
	);
	//TODO
	const contactCreator = useCallback(() => {
		alert("à venir");
	}, []);

	const actions = useMemo<DropdownOption[]>(
		() => [
			{ value: "Ouvrir", action: openTopo },
			{ value: "Modifier", action: editTopo },
			...(props.topo.status === TopoStatus.Submitted
				? [
						{ value: "Valider", action: () => {console.log("1"); props.onValidateClick(); } },
						{ value: "Refuser", action: props.onRejectClick },
				  ]
				: []),
			...(props.topo.status === TopoStatus.Validated
				? [{ value: "Annuler la validation", action: props.onUnvalidateClick }]
				: []),
			{ value: "Contacter le créateur", action: contactCreator },
			...(props.topo.status !== TopoStatus.Validated
				? [{ value: "Supprimer", action: props.onDeleteClick }]
				: []),
		],
		[
			props.topo.status,
			openTopo,
			editTopo,
			props.onValidateClick,
			props.onRejectClick,
			contactCreator,
			props.onDeleteClick,
		]
	);

	return (
		<Dropdown
			position={props.position}
			options={actions}
			onSelect={props.onSelect}
		/>
	);
};

AdminActionDropdown.displayName = "AdminActionDropdown";
