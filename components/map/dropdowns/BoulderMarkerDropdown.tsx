import React, { useCallback } from "react";
import { Dropdown } from "components";
import { Boulder, Track } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { createTrack } from "helpers/builder";
import { useSession } from "helpers/services";

interface BoulderMarkerDropdownProps {
	boulder: Quark<Boulder>;
	position?: { x: number; y: number };
	multipleImageInputRef: React.RefObject<HTMLInputElement>;
	toggleTrackSelect: (
		track: Quark<Track>,
		boulderQuark: Quark<Boulder>
	) => void;
	deleteBoulder: (boulder: Quark<Boulder>) => void;
	onSelect?: () => void;
	onAddImageClick?: () => void;
}

export const BoulderMarkerDropdown: React.FC<BoulderMarkerDropdownProps> =
	watchDependencies((props: BoulderMarkerDropdownProps) => {
		const session = useSession();

		const addTrack = useCallback(() => {
			if (session) {
				const trackQuark = createTrack(props.boulder(), session.id);
				props.toggleTrackSelect(trackQuark, props.boulder);
			}
		}, [props.boulder, props.boulder(), session, props.toggleTrackSelect]);

		const deleteBoulder = useCallback(
			() => props.deleteBoulder(props.boulder),
			[props.boulder, props.deleteBoulder]
		);

		if (!session) return null;
		return (
			<Dropdown
				position={props.position}
				options={[
					{ value: "Ajouter un passage", action: addTrack },
					{ value: "Ajouter une image", action: props.onAddImageClick },
					{ value: "Supprimer", action: deleteBoulder },
				]}
				onSelect={props.onSelect}
			/>
		);
	});

BoulderMarkerDropdown.displayName = "Boulder Marker Dropdown";
