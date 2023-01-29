import React, { useCallback } from "react";
import { LightTopo, TopoStatus } from "types";
import { useRouter } from "next/router";
import { encodeUUID } from "helpers/utils";
import { Dropdown, DropdownOption } from "../form/Dropdown";

interface UserActionDropdownProps {
	topo: LightTopo;
	position: { x: number; y: number };
	onSendToValidationClick: () => void;
	onSendToDraftClick: () => void;
	onDeleteClick: () => void;
	onSelect?: () => void;
}

export const UserActionDropdown: React.FC<UserActionDropdownProps> = (
	props: UserActionDropdownProps
) => {
	const router = useRouter();

	//TODO
	const downloadTopo = useCallback(() => {
		alert("à venir");
		console.log("Downloading the topo...");
	}, []);

	const options: DropdownOption[] = [];
	if (props.topo.status === TopoStatus.Draft) {
		options.push(
			{ value: "Modifier", action: () => router.push(`/builder/${encodeUUID(props.topo.id)}`) }, 
			{ value: "Valider", action: props.onSendToValidationClick }
		);
	}
	if (props.topo.status === TopoStatus.Submitted) {
		options.push(
			{ value: "Voir le topo", action: () => router.push(`/topo/${encodeUUID(props.topo.id)}`) }, 
			{ value: "Modifier", action: props.onSendToDraftClick }
		);
	}
	if (props.topo.status === TopoStatus.Validated) {
		options.push({ value: "Télécharger", action: downloadTopo });
	}
	options.push({ value: "Supprimer", action: props.onDeleteClick });

	return (
		<Dropdown
			className="w-64"
			position={props.position}
			options={options}
			onSelect={props.onSelect}
		/>
	);
};

UserActionDropdown.displayName = "UserActionDropdown";
