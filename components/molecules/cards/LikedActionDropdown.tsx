import React, { useCallback } from "react";
import { LightTopo } from "types";
import { useRouter } from "next/router";
import { encodeUUID } from "helpers/utils";
import { Dropdown } from "../form/Dropdown";

interface LikedActionDropdownProps {
	topo: LightTopo;
	position: { x: number; y: number };
	onSelect?: () => void;
}

export const LikedActionDropdown: React.FC<LikedActionDropdownProps> = (
	props: LikedActionDropdownProps
) => {
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
				{ value: "Ouvrir", action: openTopo }
			]}
			onSelect={props.onSelect}
		/>
	);
};

LikedActionDropdown.displayName = "LikedActionDropdown";
