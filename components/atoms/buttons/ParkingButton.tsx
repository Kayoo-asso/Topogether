import React from "react";
import Parking from "assets/icons/parking.svg";

interface ParkingButtonProps {
	onClick?: () => void;
}

export const ParkingButton: React.FC<ParkingButtonProps> = ({
	...props
}: ParkingButtonProps) => {
	return (
		<div
			className="ktext-base flex cursor-pointer flex-row items-center justify-center text-main"
			onClick={props.onClick}
		>
			Itinéraire vers le parking
			<Parking className="ml-3 h-5 w-5 fill-main" />
		</div>
	);
};
