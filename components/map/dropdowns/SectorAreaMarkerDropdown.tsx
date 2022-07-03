import React, { useCallback } from "react";
import { Dropdown } from "components";
import { Sector } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { useSession } from "helpers/services";

interface SectorAreaMarkerDropdownProps {
	sector: Quark<Sector>;
	position?: { x: number; y: number };
	deleteSector: (sector: Quark<Sector>) => void;
	renameSector: (sector: Quark<Sector>) => void;
	onSelect?: () => void;
}

export const SectorAreaMarkerDropdown: React.FC<SectorAreaMarkerDropdownProps> = watchDependencies(
	(props: SectorAreaMarkerDropdownProps) => {
		const session = useSession();

		// surement que ces useCallback ne sont pas nécessaire si les props le sont
		const deleteSector = useCallback(() => props.deleteSector(props.sector), [props.sector]);
		const renameSector = useCallback(() => props.renameSector(props.sector), [props.sector]);

		if (!session) return null;
		return (
			<Dropdown
				position={props.position}
				options={[
					{ value: "Renommer", action: renameSector },
					{ value: "Supprimer", action: deleteSector },
				]}
				onSelect={props.onSelect}
			/>
		);
	}
);

SectorAreaMarkerDropdown.displayName = "SectorAreaMarkerDropdown";
