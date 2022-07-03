import React, { useCallback } from "react";
import { Dropdown } from "components";
import { Parking } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { useSession } from "helpers/services";

interface ParkingMarkerDropdownProps {
	parking: Quark<Parking>;
	position?: { x: number; y: number };
	deleteParking: (parking: Quark<Parking>) => void;
	onSelect?: () => void;
}

export const ParkingMarkerDropdown: React.FC<ParkingMarkerDropdownProps> =
	watchDependencies((props: ParkingMarkerDropdownProps) => {
		const session = useSession();

		const deleteParking = useCallback(
			() => props.deleteParking(props.parking),
			[props.parking]
		);

		if (!session) return null;
		return (
			<Dropdown
				position={props.position}
				options={[{ value: "Supprimer", action: deleteParking }]}
				onSelect={props.onSelect}
			/>
		);
	});

ParkingMarkerDropdown.displayName = "Parking Marker Dropdown";
