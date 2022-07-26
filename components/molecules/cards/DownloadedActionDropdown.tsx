import React, { useCallback } from "react";
import { Dropdown } from "components";
import { LightTopo, TopoStatus } from "types";
import { useRouter } from "next/router";
import { encodeUUID } from "helpers/utils";

interface DownloadedActionDropdownProps {
	topo: LightTopo;
	position: { x: number; y: number };
	onUnsaveClick: () => void;
	onSelect?: () => void;
}

export const DownloadedActionDropdown: React.FC<
	DownloadedActionDropdownProps
> = (props: DownloadedActionDropdownProps) => {
	const router = useRouter();

	const openTopo = useCallback(
		() => router.push(`/topo/${encodeUUID(props.topo.id)}`),
		[router, props.topo]
	);

	return (
		<Dropdown
			className="w-64"
			position={props.position}
			options={[
					{ value: "Ouvrir", action: openTopo },
					{ value: "Retirer des téléchargements", action: props.onUnsaveClick }
			]}
			onSelect={props.onSelect}
		/>
	);
};

DownloadedActionDropdown.displayName = "DownloadedActionDropdown";
